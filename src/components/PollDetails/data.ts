import { request } from 'graphql-request'
import { BigNumber } from 'bignumber.js'

const GOVERNANCE_API_URI = process.env.REACT_APP_GRAPH_HTTP
const MKR_API_URI = process.env.REACT_APP_MKR_GRAPH_HTTP

const fetchQuery = (url, query, variables) => request(url, query, variables)

export const getPollVotersPerOption = poll => {
  return poll.votes.reduce((acum, el) => {
    const option = acum[el.option] || []
    return {
      ...acum,
      [el.option]: [...option, el.voter],
    }
  }, {})
}

export const getVoterRegistries = async (addresses, endDate) => {
  // The query can't be called with empty array because it errors
  if (!addresses.length) {
    return []
  }

  const query = `
    query getVoterRegistries($voters: [Bytes!]!, $endDate: BigInt!  ){
      hot: voterRegistries(first: 1000, where: {hotAddress_in: $voters, timestamp_lte: $endDate}) {
        id
        coldAddress
        hotAddress
        voteProxies {
          id
        }
      }
      cold: voterRegistries(first: 100, where: {coldAddress_in: $voters, timestamp_lte: $endDate}) {
        id
        coldAddress
        hotAddress
        voteProxies {
          id
        }
      }
    }
  `
  const result: any = await fetchQuery(GOVERNANCE_API_URI, query, {
    voters: addresses,
    endDate,
  })

  return [...result.cold, ...result.hot]
}

export const getVoterAddresses = poll => {
  const pollVoters = getPollVotersPerOption(poll)
  return Object.keys(pollVoters).flatMap(option => pollVoters[option])
}

export const getVoteProxies = registries => {
  return Array.from(new Set(registries.flatMap((el: any) => el.voteProxies.flatMap(p => p.id))))
}

export const stakedByAddress = data => {
  const result = [...data.free, ...data.lock].reduce((acc, el) => {
    let current = acc[el.sender] || new BigNumber('0')
    current = el.type === 'FREE' ? current.minus(new BigNumber(el.wad)) : current.plus(new BigNumber(el.wad))
    return {
      ...acc,
      [el.sender]: current,
    }
  }, {})

  return result
}

export const getStakedByAddress = async (addresses, endDate) => {
  // The query can't be called with empty array because it errors
  if (!addresses.length) {
    return {
      free: [],
      lock: [],
    }
  }

  const query = `
    query getStakedByAddress($voters: [Bytes!]!, $endDate: BigInt!  ) {
      lock: actions(first: 1000, where: {type: LOCK, sender_in: $voters, timestamp_lte: $endDate}) {
        sender
        type
        wad
      }
      free: actions(first: 1000, where: {type: FREE, sender_in: $voters, timestamp_lte: $endDate}) {
        sender
        type
        wad
      }
    }
  `
  const result: any = await fetchQuery(GOVERNANCE_API_URI, query, {
    voters: addresses,
    endDate,
  })

  return result
}

export const getPollDataWithoutBalances = async poll => {
  const votersAddresses = getVoterAddresses(poll)
  const voteRegistries = await getVoterRegistries(votersAddresses, poll.endDate)
  const voteProxies = getVoteProxies(voteRegistries)

  const stakedProxies = stakedByAddress(await getStakedByAddress(voteProxies, poll.endDate))
  const stakedVoters = stakedByAddress(await getStakedByAddress(votersAddresses, poll.endDate))

  const hotCold = Array.from(new Set(voteRegistries.flatMap((el: any) => [el.coldAddress, el.hotAddress])))
  const votersHotCold = Array.from(new Set([...votersAddresses, ...hotCold]))
  const balances = getBalanceByAccount(await getAccountBalances(votersHotCold, poll.endDate))

  const stakedVotersAndBalances = votersHotCold.reduce((acc, key) => {
    const staked = stakedVoters[key] || ZERO
    const balance = balances[key] ? new BigNumber(balances[key]) : ZERO
    const amount = staked.plus(balance).toString()

    return {
      ...acc,
      [key]: amount,
    }
  }, {})

  const lookup = getLookup(votersAddresses, voteRegistries)
  const stakedTotal = totalStaked(poll, lookup, balances, stakedProxies)

  const mkrVoter = Array.from(new Set([...Object.keys(stakedTotal), ...Object.keys(stakedVotersAndBalances)])).reduce(
    (acc, key) => {
      const st = stakedTotal[key] || new BigNumber('0')
      const vt = stakedVotersAndBalances[key] ? new BigNumber(stakedVotersAndBalances[key]) : new BigNumber('0')
      const amount = st.plus(vt)

      return {
        ...acc,
        [key]: amount,
      }
    },
    {},
  )

  console.log(
    'mkrVoter',
    Object.keys(mkrVoter).map(e => [e, mkrVoter[e].toString()]),
  )

  const votersPerOption = getPollVotersPerOption(poll)
  const mkrOptions = Object.keys(votersPerOption).reduce((acc, op) => {
    const voters = votersPerOption[op]
    const total = voters.reduce((acc, v) => {
      return acc.plus(mkrVoter[v])
    }, new BigNumber('0'))

    return {
      ...acc,
      [op]: total.toNumber().toFixed(2),
    }
  }, {})

  const ret = poll.options.map((key, i) => {
    return {
      label: key,
      mkr: mkrOptions[i + 1] || 0,
      voter: votersPerOption[i + 1] ? votersPerOption[i + 1].length : 0,
    }
  })
  return ret
}

// This is used to get final results for a given poll, so it's ok to get only the last snapshot
const getAccountBalances = async (addresses, endDate) => {
  // Query
  const query = `
    query getAccountBalances($voter: Bytes!, $endDate: BigInt!  ) {
      accountBalanceSnapshots(
        first: 1,
        where:{
          account: $voter,
          timestamp_lte: $endDate
        },
        orderBy: timestamp, orderDirection: desc
      ) {
        account {
          address
        }
        amount
        timestamp
      }
    }
  `

  const result: any = await Promise.all(
    addresses.map(address =>
      fetchQuery(MKR_API_URI, query, {
        voter: address,
        endDate,
      }),
    ),
  )

  return result
}

const getBalanceByAccount = balances => {
  return balances.reduce((acc, el) => {
    const snapshot = el.accountBalanceSnapshots[0]

    if (snapshot) {
      return {
        ...acc,
        [snapshot.account.address]: snapshot.amount,
      }
    } else {
      return acc
    }
  }, {})
}

export const getLookup = (addresses, registries) => {
  return addresses.reduce((acc, addr) => {
    const reges = registries.reduce((acc: any, reg: any) => {
      if (addr === reg.coldAddress || addr === reg.hotAddress) {
        return [
          ...acc,
          {
            cold: reg.coldAddress,
            hot: reg.hotAddress,
            proxy: reg.voteProxies.flatMap(p => p.id),
          },
        ]
      } else {
        return acc
      }
    }, [])

    return {
      ...acc,
      [addr]: reges,
    }
  }, {})
}

export const ZERO = new BigNumber('0')
// total staked proxy + balance hot + balance cold
export const totalStaked = (poll, lookup, balances, stakedProxies) => {
  let addedColHotByVoter: any = {}

  return getVoterAddresses(poll).reduce((acc, voter) => {
    const amount = lookup[voter].reduce((acc, reg) => {
      const cold = reg.cold
      const hot = reg.hot
      const proxies = reg.proxy

      const proxyAmount = proxies.reduce((acc, p) => {
        const balance = stakedProxies[p] || ZERO
        return acc.plus(balance)
      }, ZERO)

      if (!addedColHotByVoter[voter]) {
        const hotBalance = balances[hot] || ZERO
        const coldBalance = balances[cold] || ZERO

        addedColHotByVoter[voter] = true
        return acc.plus(proxyAmount.plus(hotBalance).plus(coldBalance))
      }
      return acc.plus(proxyAmount)
    }, new BigNumber('0'))

    return {
      ...acc,
      [voter]: amount,
    }
  }, {})
}
