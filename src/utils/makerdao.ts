import matter from 'gray-matter'
import BigNumber from 'bignumber.js'
import { getUnixTime } from 'date-fns'
import { setCache, getCache } from './cache'
import { getPollDates } from './mkr-gov-db'

const Hash = require('ipfs-only-hash')

const prod = 'https://cms-gov.makerfoundation.com'
const spellsPath = 'content/all-spells'
const rawUri = 'https://raw.githubusercontent.com/makerdao/community/master/governance/polls'

const POLLING_EMITTER = '0xF9be8F0945acDdeeDaA64DFCA5Fe9629D0CF8E5D' // mainnet

const MKR_SUPPLY_API = 'https://api.etherscan.io/api'
const PRECISION = new BigNumber('10').exponentiatedBy(18)

const check = async (res, resource) => {
  if (!res.ok) {
    throw new Error(`unable to fetch ${resource}: ${res.status} - ${await res.text()}`)
  }
}

/**
 * @desc return a promise that resolves after specified time
 * @param {Number} time
 * @return {Promise}
 */
export const promiseWait = time => new Promise(resolve => setTimeout(resolve, time || 0))

/**
 * @desc retry an async function a set number of times
 * @param  {Object} { times, fn, delay }
 * @return {Promise}
 */
export const promiseRetry = ({ times = 3, fn, delay = 500, args = [] }) => {
  return fn(...args).catch(err =>
    times > 0
      ? promiseWait(delay).then(() => promiseRetry({ times: times - 1, fn, delay, args }))
      : Promise.reject(err),
  )
}

const fetchNetwork = async (url, resource, path, network = 'mainnet') => {
  const res = await fetch(`${url}/${path}?network=${network}`)
  await check(res, resource)
  return await res.json()
}

const fetchSpells = async network => {
  return fetchNetwork(prod, 'spells', spellsPath, network)
}

export const formatHistoricalPolls = topics => {
  const govTopics = topics.filter(t => t.govVote === true)
  const allPolls = govTopics.reduce((result, { end_timestamp, date, topic_blurb, topic, key, proposals }) => {
    const options = proposals.map(p => p.title)
    const totalVotes = proposals.reduce((acc, proposal) => acc + proposal.end_approvals, 0)

    const poll = {
      legacyPoll: true,
      active: false,
      content: proposals[0] ? proposals[0].about : topic_blurb,
      endDate: end_timestamp,
      options: options,
      source: proposals[0] && proposals[0].source ? proposals[0].source : POLLING_EMITTER,
      startDate: getUnixTime(new Date(date)),
      summary: topic_blurb,
      title: topic,
      totalVotes: isNaN(totalVotes) ? '----' : totalVotes,
      pollId: key,
      voteId: key,
      topicKey: key,
    }

    result.push(poll)
    return result
  }, [])

  return allPolls
}

export async function getMakerDaoData() {
  const allSpells = await promiseRetry({
    fn: fetchSpells,
    times: 4,
    delay: 1,
  })

  const spellsInfo = allSpells.map(({ source, title, proposal_blurb, about }) => ({
    source,
    title,
    proposal_blurb,
    about,
  }))

  return { spellsInfo }
}

// Polls data
const fetchPollFromUrl = async url => {
  let customUri = url
  if (url.includes('github.com')) customUri = `${rawUri}/${url.substring(url.lastIndexOf('/') + 1)}`
  const res = await fetch(customUri)
  await check(res, 'topics')
  const contentType = res.headers.get('content-type')
  if (!contentType) return null
  if (contentType.indexOf('application/json') !== -1) {
    const json = await res.json()
    if (!json.about || typeof json.about !== 'string') return null
    return json
  } else if (contentType.indexOf('text/plain') !== -1) {
    return res.text()
  } else return null
}

const generateIPFSHash = async (data, options) => {
  // options object has the key encoding which defines the encoding type
  // of the data string that has been passed in
  const bufferData = Buffer.from(data, options.encoding || 'ascii')
  const hash = await Hash.of(bufferData)
  return hash
}

const formatOptions = options => {
  const optionVals = Object.values(options)
  // Remove option 0: abstain
  optionVals.shift()
  return optionVals
}

const isPollActive = (startDate, endDate) => {
  const now = new Date()
  return startDate <= now && endDate > now ? true : false
}

const formatYamlToJson = async data => {
  const json = data.about ? matter(data.about) : matter(data)
  if (!json.data.title || !json.data.options)
    throw new Error('Invalid poll document: no options or title field found in front matter')
  const { content } = json
  const { title, summary, options, discussion_link } = json.data
  return {
    voteId: data.voteId
      ? data.voteId
      : await generateIPFSHash(data.replace(/(\r\n|\n|\r)/gm, '\n'), {
          encoding: 'ascii',
        }),
    title,
    summary,
    options: formatOptions(options),
    discussion_link,
    content,
  }
}

export async function getPollsMetaData(polls: Array<any>) {
  const cached = (await getCache('polls-metadata')) || []
  const cachedIds = cached.map(poll => poll.id)
  const nonCached = cachedIds ? polls.filter(poll => !cachedIds.includes(poll.id)) : []

  const pollsToAdd = await Promise.all(
    nonCached.map(async poll => {
      try {
        const pollDocument = await fetchPollFromUrl(poll.url)
        if (pollDocument) {
          const documentData = await formatYamlToJson(pollDocument)
          const pollData = { ...poll, ...documentData } // TODO: save only needed data
          pollData.active = isPollActive(pollData.startDate, pollData.endDate)
          pollData.source = POLLING_EMITTER

          return pollData
        }
        return
      } catch (e) {
        console.log(`Error fetching data for poll with ID ${poll.pollId} from ${poll.url}`)
      }
    }),
  )

  const updatedCached = await Promise.all(
    cached.map(async cachedData => {
      const newPollData = polls.find(p => p.id === cachedData.id)
      let pollDates
      if (newPollData) {
        pollDates = await getPollDates(newPollData.id)
      }
      return {
        ...cachedData,
        ...newPollData,
        ...pollDates,
      }
    }),
  ) // need to update data coming from subgraph

  const allPolls = [...updatedCached, ...pollsToAdd.filter(Boolean)]

  await setCache('polls-metadata', allPolls)

  const pollIds = polls.map(poll => poll.id)
  return allPolls.filter(cachedPoll => pollIds.includes(cachedPoll.id))
}

export async function getMKRSupply() {
  const url: any = new URL(MKR_SUPPLY_API),
    params = {
      action: 'tokensupply',
      contractaddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      module: 'stats',
      apikey: process.env.REACT_APP_ETHERSCAN_API_KEY,
    }
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`unable to fetch MKR supply: ${res.status} - ${await res.text()}`)
    }

    const supply = await res.json()
    return new BigNumber(supply.result).div(PRECISION)
  } catch (e) {
    console.log(`Error fetching MKR supply`)
  }
}
