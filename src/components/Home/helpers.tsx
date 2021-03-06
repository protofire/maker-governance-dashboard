import React from 'react'
import ReactTooltip from 'react-tooltip'
import { format, fromUnixTime, differenceInDays, subDays, getUnixTime, startOfDay } from 'date-fns'
import gini from 'gini'
import BigNumber from 'bignumber.js'
import { Link } from '../common/styled'
import { AddressNav } from '../common'

import {
  getLastYear,
  getLastWeek,
  getLastMonth,
  getLastDay,
  shortenAccount,
  timeLeft,
  getPollsBalances,
  getVotersBalance,
  msToSeconds,
} from '../../utils'
import {
  LAST_YEAR,
  LAST_MONTH,
  LAST_WEEK,
  LAST_DAY,
  ACTION_FREE,
  VOTING_ACTION_ADD,
  VOTING_ACTION_REMOVE,
  VOTING_ACTION_LOCK,
  VOTING_ACTION_FREE,
  POLL_VOTE_ACTION,
} from '../../constants'

const periodsMap = {
  [LAST_YEAR]: getLastYear,
  [LAST_MONTH]: getLastMonth,
  [LAST_WEEK]: getLastWeek,
  [LAST_DAY]: getLastDay,
}

const formatMkrData = (el, data, prev) => {
  return data
    .filter(d => d.timestamp >= el.from && d.timestamp <= el.to)
    .reduce((acum, value) => (value.type === ACTION_FREE ? acum - Number(value.wad) : acum + Number(value.wad)), prev)
}

export const getVotesVsPollsData = (votes: Array<any>, polls: Array<any>, time: string): Array<any> => {
  const periods = periodsMap[time]()

  let countVotes = votes.filter(el => el.timestamp < periods[0].from).length
  let countPolls = polls.filter(el => el.startDate < periods[0].from).length
  return periods.map(el => {
    countVotes += votes.filter(d => d.timestamp >= el.from && d.timestamp <= el.to).length
    countPolls += polls.filter(d => d.startDate >= el.from && d.startDate <= el.to).length
    return {
      ...el,
      countVotes,
      countPolls,
    }
  })
}

export const getMostVotedPolls = polls =>
  polls[0].participation
    ? polls
        .map(p => ({
          ...p,
          participationNumber: Number(p.participation).toFixed(2),
        }))
        .sort((a, b) => b.participationNumber - a.participationNumber)
    : []

export const getRecentPolls = polls => polls.sort((a, b) => Number(b.startDate) - Number(a.startDate))

export const getStakedMkrData = (data: any, time: string) => {
  const periods = periodsMap[time]()
  const mkrEvents = [data.mint, data.burn]

  // Some LOCK/FREE events occurs in the same block/timestamp that VOTE, when need LOCK/FREE before VOTE
  const votingEvents = [data.lock, data.free, data.vote].flat().sort((a, b) => {
    if (a.timestamp > b.timestamp) {
      return 1
    }

    if (a.timestamp < b.timestamp) {
      return -1
    }

    if (a.type === 'LOCK' || a.type === 'FREE') {
      return -1
    }

    return 1
  })

  // Calculate total MKR supply before first period
  let totalSupply = calculateMkrSupply(
    mkrEvents.map(events => events.filter(({ timestamp }) => timestamp < periods[0].from)),
  )

  // Calculate total MKR staked/voting before first period
  let { totalStaked, totalVoting, voters } = calculateVotingMkr(
    votingEvents.filter(({ timestamp }) => timestamp < periods[0].from),
  )

  return periods.map(period => {
    // Calculate total MKR supply in the period
    totalSupply = calculateMkrSupply(
      mkrEvents.map(events => events.filter(({ timestamp }) => timestamp > period.from && timestamp <= period.to)),
      totalSupply,
    )

    // Calculate total MKR staked/voting in the period
    ;({ totalStaked, totalVoting, voters } = calculateVotingMkr(
      votingEvents.filter(({ timestamp }) => timestamp > period.from && timestamp <= period.to),
      { totalStaked, totalVoting, voters },
    ))

    // These values should be Number in order the chart to be scaled on demand.
    return {
      ...period,
      totalSupply: Number(totalSupply.toFixed(2)),
      totalStaked: Number(totalStaked.toFixed(2)),
      votingMkr: Number(totalVoting.toFixed(2)),
      nonVotingMkr: Number(totalStaked.minus(totalVoting).toFixed(2)),
    }
  })
}

function calculateMkrSupply(mkrEvents: any[], previousValue = new BigNumber(0)): BigNumber {
  return mkrEvents
    .map(events =>
      events.length
        ? BigNumber.sum(events.reduce((accum, event) => Number(event.amount) + accum, 0))
        : new BigNumber(0),
    )
    .reduce((supply, value, isBurn) => (isBurn ? supply.minus(value) : supply.plus(value)), previousValue)
}

function calculateVotingMkr(
  votingEvents: any[],
  previousValue = { totalStaked: new BigNumber(0), totalVoting: new BigNumber(0), voters: {} },
): { totalStaked: BigNumber; totalVoting: BigNumber; voters: { [addr: string]: BigNumber } } {
  return votingEvents.reduce(({ totalStaked, totalVoting, voters }, { type, wad, sender, yays }) => {
    const stake = voters[sender] || new BigNumber(0)

    if (type === 'LOCK') {
      return {
        totalStaked: totalStaked.plus(wad),
        totalVoting: stake.isZero() ? totalVoting : totalVoting.plus(wad),
        voters: stake.isZero() ? voters : { ...voters, [sender]: stake.plus(wad) },
      }
    } else if (type === 'VOTE') {
      let newTotalVoting = totalVoting

      // first time voting or voting for something again after removing its vote
      if (stake.isZero()) {
        // but it does has to be voting something
        if (yays.length !== 0) {
          newTotalVoting = totalVoting.plus(wad)
        }
      }

      // already voting
      if (!stake.isZero()) {
        // voting for somthing else
        if (yays.length !== 0) {
          newTotalVoting = totalVoting
        } else {
          // removing its vote
          newTotalVoting = totalVoting.minus(stake)
        }
      }

      return {
        totalStaked,
        totalVoting: newTotalVoting,
        voters: { ...voters, [sender]: yays.length ? new BigNumber(wad) : new BigNumber(0) },
      }
    } else if (type === 'FREE') {
      return {
        totalStaked: totalStaked.minus(wad),
        totalVoting: stake.isZero() ? totalVoting : totalVoting.minus(wad),
        voters: stake.isZero() ? voters : { ...voters, [sender]: stake.minus(wad) },
      }
    }
    return {
      totalStaked,
      totalVoting,
      voters,
    }
  }, previousValue)
}

export const getVotersVsMkrData = (data: Array<any>, mkrLockFree: Array<any>, time: string): Array<any> => {
  const periods = periodsMap[time]()

  let count = data.filter(el => el.timestamp < periods[0].from).length
  let mkr = initializeMkr(periods[0].from, mkrLockFree, 0)
  return periods.map(el => {
    mkr = formatMkrData(el, mkrLockFree, mkr)
    count += data.filter(d => d.timestamp >= el.from && d.timestamp <= el.to).length
    return {
      ...el,
      count,
      mkr: mkr.toFixed(2),
    }
  })
}

const initGiniMkr = (data, initial) => {
  return data
    .filter(d => d.timestamp < initial.to)
    .reduce((acum, value) => {
      let mkr = acum[value.sender] || new BigNumber(0)
      mkr = value.type === 'FREE' ? mkr.minus(new BigNumber(value.wad)) : mkr.plus(new BigNumber(value.wad))

      return {
        ...acum,
        [value.sender]: mkr,
      }
    }, {})
}

const formatGiniData = (el, data, prev) => {
  return data
    .filter(d => d.timestamp >= el.from && d.timestamp <= el.to)
    .reduce((acum, value) => {
      let mkr = acum[value.sender] || new BigNumber(0)
      mkr = value.type === 'FREE' ? mkr.minus(new BigNumber(value.wad)) : mkr.plus(new BigNumber(value.wad))

      return {
        ...acum,
        [value.sender]: mkr,
      }
    }, prev)
}

export const getGiniData = (totalMkr: Array<any>, time: string): Array<any> => {
  const periods = periodsMap[time]()
  let mkr = initGiniMkr(totalMkr, periods[0])

  const res = periods.reduce((acc, el) => {
    mkr = formatGiniData(el, totalMkr, mkr)
    return {
      ...acc,
      [el.label]: {
        ...mkr,
      },
    }
  }, {})

  return Object.keys(res).reduce((acc: any[], k) => {
    const giniData = Object.keys(res[k])
      .map(a => res[k][a].toNumber())
      .filter(a => a >= 0)
    return [
      ...acc,
      {
        label: k,
        gini: Object.keys(res[k]).length ? gini.unordered(giniData).toFixed(2) : 0,
      },
    ]
  }, [])
}

const initializeMkr = (el, data, prev) => {
  return data
    .filter(d => d.timestamp < el)
    .reduce((acum, value) => (value.type === ACTION_FREE ? acum - Number(value.wad) : acum + Number(value.wad)), prev)
}
export const defaultFilters = {
  stakedMkr: LAST_YEAR,
  votersVsMkr: LAST_YEAR,
  votesVsPolls: LAST_YEAR,
  gini: LAST_YEAR,
}

export const getComponentData = (
  type: string,
  component: string,
  content: string,
  expanded: boolean,
  versus = undefined,
) => {
  return {
    type,
    component,
    content,
    expanded,
    versus,
  }
}

export const TopVotersColumns = () => {
  return [
    {
      Header: 'Address',
      accessor: 'sender',
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <AddressNav voter address={row.original.sender}>
            <span data-tip={row.original.sender}>{shortenAccount(row.original.sender)}</span>
          </AddressNav>
        </>
      ),
    },
    {
      Header: 'Participations',
      disableFilters: true,
      accessor: 'count',
      id: 'participations',
    },
  ]
}

export const ActivenessBreakdownColumns = () => {
  return [
    {
      Header: 'Period',
      accessor: 'period',
      disableFilters: true,
    },
    {
      Header: 'MKR',
      disableFilters: true,
      accessor: row => (row.activeness ? row.activeness.toFixed(2) : Number(0).toFixed(2)),
    },
  ]
}

export const Pollcolumns = (isModalOpen: boolean) => {
  return [
    {
      Header: 'Name',
      accessor: 'title',
      filter: 'fuzzyText',
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <Link>
            <span data-tip={row.original.title}>{row.original.title}</span>
          </Link>
        </>
      ),
    },
    {
      Header: 'Start date',
      id: 'startDate',
      disableFilters: true,
      accessor: row => fromUnixTime(row.startDate),
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.startDate), 'dd MMM yy'),
      show: isModalOpen,
    },
    {
      Header: 'End Date',
      accessor: 'endDate',
      disableFilters: true,
      Cell: ({ row }) => format(fromUnixTime(row.original.endDate), 'dd MMM yy'),
      show: isModalOpen,
    },
    {
      Header: 'Time Left',
      disableFilters: true,
      accessor: row => timeLeft(row.endDate),
    },
  ]
}
export const VotedPollcolumns = () => {
  return [
    {
      Header: 'Name',
      accessor: 'title',
      filter: 'fuzzyText',
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <Link>
            <span data-tip={row.original.title}>{row.original.title}</span>
          </Link>
        </>
      ),
    },
    {
      Header: 'MKR participation',
      accessor: 'participation',
      sortType: (a, b) => Number(a.original.participation) - Number(b.original.participation),
      disableFilters: true,
      Cell: ({ row }) => (row.original.participation ? `${Number(row.original.participation).toFixed(6)}%` : '-'),
    },
  ]
}
export const Executivecolumns = (isModalOpen: boolean) => {
  return [
    {
      Header: 'Source',
      accessor: 'id',
      filter: 'fuzzyText',
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <AddressNav address={row.original.id}>
            <Link>
              <span data-tip={row.original.id}>{shortenAccount(row.original.id)}</span>
            </Link>
          </AddressNav>
        </>
      ),
    },
    {
      Header: 'MKR in Support',
      id: 'approvals',
      disableFilters: true,
      accessor: row => Number(row.approvals).toFixed(2),
    },
    {
      Header: 'Casted date',
      accessor: 'casted',
      disableFilters: true,
      Cell: ({ row }) => (row.original.casted ? format(fromUnixTime(row.original.casted), 'dd MMM yy') : '-'),
      show: isModalOpen,
    },
    {
      Header: 'MKR when lifted',
      accessor: 'liftedWith',
      disableFilters: true,
      Cell: ({ row }) => Number(row.original.liftedWith).toFixed(2),
      show: isModalOpen,
    },
    {
      Header: 'Lift date',
      accessor: 'lifted',
      disableFilters: true,
      Cell: ({ row }) => (row.original.lifted ? format(fromUnixTime(row.original.lifted), 'dd MMM yy') : '-'),
      show: isModalOpen,
    },
  ]
}

export const UncastedExecutivecolumns = () => {
  return [
    {
      Header: 'Source',
      accessor: 'id',
      filter: 'fuzzyText',
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <AddressNav address={row.original.id}>
            <Link>
              <span data-tip={row.original.id}>{shortenAccount(row.original.id)}</span>
            </Link>
          </AddressNav>
        </>
      ),
    },
    {
      Header: 'MKR in Support',
      id: 'approvals',
      disableFilters: true,
      accessor: row => Number(row.approvals).toFixed(2),
    },
  ]
}

export const getMkrDistributionPerExecutive = (executives: Array<any>, hat: string) => {
  const result = executives.map(vote => ({
    label: format(fromUnixTime(vote.timestamp), 'dd MMM yy'),
    mkr: Number(vote.approvals).toFixed(2),
    isHat: hat === vote.id,
    timestamp: vote.timestamp,
  }))

  return result.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
}

export const getTimeTakenForExecutives = executives => {
  const buckets = Array.from({ length: 30 }, (v, i) => i).map(num => {
    return {
      from: num,
      to: num + 1,
      label: `${num + 1} day${num > 0 ? 's' : ''}`,
      count: 0,
    }
  })

  return executives
    .filter(vote => vote.casted && differenceInDays(fromUnixTime(vote.casted), fromUnixTime(vote.timestamp)) <= 30)
    .reduce((acc, vote) => {
      const days = differenceInDays(fromUnixTime(vote.casted), fromUnixTime(vote.timestamp))
      return acc.map(bucket => {
        return {
          ...bucket,
          count:
            (days > bucket.from || (days === 0 && bucket.from === 0)) && days <= bucket.to
              ? bucket.count + 1
              : bucket.count,
        }
      })
    }, buckets)
}

export const getMKRResponsiveness = executives => {
  const countedEvents = {}
  const addEvents = {}
  const events = executives.flatMap(vote =>
    vote.timeLine
      .filter(tl => tl.type === VOTING_ACTION_ADD || tl.type === VOTING_ACTION_LOCK)
      .map(v => {
        const addId = `${vote.id}-${v.sender}`

        if (countedEvents[v.id] || addEvents[addId]) return []
        if (v.type === VOTING_ACTION_ADD) addEvents[addId] = true
        countedEvents[v.id] = true

        return {
          ...v,
          vote_date: vote.timestamp,
          mkr: v.type === VOTING_ACTION_ADD ? v.locked : v.wad,
        }
      }),
  )
  const buckets = Array.from({ length: 30 }, (v, i) => i).map(num => ({
    from: num,
    to: num + 1,
    label: `${num}-${num + 1} days`,
    mkr: 0,
  }))

  const periodEvents = events.reduce((acc, event) => {
    const diffDays = differenceInDays(fromUnixTime(event.timestamp), fromUnixTime(event.vote_date))
    return acc.map(bucket => ({
      ...bucket,
      mkr: diffDays >= bucket.from && diffDays < bucket.to ? bucket.mkr + Number(event.mkr) : bucket.mkr,
    }))
  }, buckets)
  return periodEvents.map(p => ({ ...p, mkr: Number((p.mkr / executives.length).toFixed(2)) }))
}

export const getPollsMKRResponsiveness = async polls => {
  const countedEvents = {}
  const voteEvents = {}
  const days = Math.max(
    ...polls.map(poll => {
      const start = msToSeconds(poll.startDate)
      const end = msToSeconds(poll.endDate)
      const diffDays = differenceInDays(fromUnixTime(end), fromUnixTime(start))

      return diffDays
    }),
  )

  const buckets = Array.from({ length: days }, (v, i) => i).map(num => ({
    from: num,
    to: num + 1,
    label: `${num}-${num + 1} days`,
    mkr: 0,
  }))

  const pollBalances = await getPollsBalances(polls)
  const pollVotes = polls.map(poll => {
    return {
      voters: poll.timeLine
        .filter(v => v.type === POLL_VOTE_ACTION)
        .reduce((accum, v) => {
          const voteId = `${v.id}-${v.sender}`
          if (countedEvents[v.id] || voteEvents[voteId])
            return {
              ...accum,
            }
          countedEvents[v.id] = true
          countedEvents[voteId] = true

          return {
            ...accum,
            [v.sender]:
              accum[v.sender] && accum[v.sender].timestamp < v.timestamp
                ? accum[v.sender]
                : { ...v, poll_startDate: poll.startDate, poll_endDate: poll.endDate, poll_id: poll.id },
          }
        }, {}),
    }
  })

  await Promise.all(
    polls.map(async (poll, index) => {
      const totalBalance = await getVotersBalance(poll, pollBalances)
      Object.keys(pollVotes[index].voters).forEach(addr => {
        pollVotes[index].voters[addr].balance = totalBalance[addr].toNumber()
      })
    }),
  )

  const periodEvents = pollVotes
    .flatMap(vote => Object.keys(vote.voters).map(v => vote.voters[v]))
    .reduce((acc, event) => {
      const diffDays = differenceInDays(fromUnixTime(event.timestamp), fromUnixTime(event.poll_startDate))
      return acc.map(bucket => ({
        ...bucket,
        mkr: diffDays >= bucket.from && diffDays < bucket.to ? bucket.mkr + Number(event.balance) : bucket.mkr,
      }))
    }, buckets)

  return periodEvents.map(p => ({ ...p, mkr: Number((p.mkr / polls.length).toFixed(2)) }))
}

export const getTopVoters = (executives, polls) => {
  const executivesTimeLine = executives.flatMap(vote =>
    Array.from(new Set(vote.timeLine.filter(tl => tl.type === VOTING_ACTION_ADD && tl.sender).map(el => el.sender))),
  )
  const votesCount = executivesTimeLine.reduce(
    (accum, tl) => ({
      ...accum,
      [tl]: accum[tl] ? accum[tl] + 1 : 1,
    }),
    {},
  )
  const pollVotes = polls.flatMap(poll => poll.votes.map(v => v.voter))
  const pollsVotesCount = pollVotes.reduce(
    (accum, tl) => ({
      ...accum,
      [tl]: accum[tl] ? accum[tl] + 1 : 1,
    }),
    votesCount,
  )
  return Object.keys(pollsVotesCount).map(vp => ({
    sender: vp,
    count: pollsVotesCount[vp],
  }))
}

const getActiveness = (executives, window, operation) => {
  const DAYS = window * 2
  const date = getUnixTime(subDays(Date.now(), DAYS - 1))

  //Get all votes events equal or greater than date
  const executivesTimeLine = executives
    .flatMap(vote => Array.from(new Set(vote.timeLine.filter(tl => tl.sender))))
    .filter(tl => tl.timestamp >= date)

  //Group events by date and by address and sort events by timestamp.
  const groupByAddressDate = executivesTimeLine.reduce((acc, tl) => {
    const datekey = getUnixTime(startOfDay(fromUnixTime(tl.timestamp)))
    return {
      ...acc,
      [datekey]: acc[datekey]
        ? {
            ...acc[datekey],
            ...{
              [tl.sender]:
                acc[datekey][tl.sender] && acc[datekey][tl.sender].events
                  ? { events: [...acc[datekey][tl.sender].events, tl].sort((a, b) => b.timestamp - a.timestamp) }
                  : { events: [tl] },
            },
          }
        : {
            [tl.sender]: { events: [tl] },
          },
    }
  }, {})

  //activeness logic

  let valuePerDay = {}
  let adjustedWindow = window

  if (Object.keys(groupByAddressDate).length < window) adjustedWindow = Object.keys(groupByAddressDate).length

  //For each day and address sum all the events.
  const startPos = adjustedWindow - 1
  Object.keys(groupByAddressDate)
    .slice(startPos, DAYS)
    .forEach((day, i) => {
      let hasAddObj = {}
      let countAddObj = {}
      let activenessByWindow = {}
      Object.keys(groupByAddressDate)
        .slice(i, startPos + i + 1)
        .forEach(window => {
          activenessByWindow[window] = 0
          Object.keys(groupByAddressDate[window]).forEach(addr => {
            const data = groupByAddressDate[window][addr]
              ? getActivenessValue(
                  groupByAddressDate[window][addr].events,
                  hasAddObj[addr] || 0,
                  countAddObj[addr] || 0,
                )
              : { value: 0, addCount: 0 }

            hasAddObj[addr] = data.value
            countAddObj[addr] = data.addCount
            activenessByWindow[window] += data.value
          })
        })
      valuePerDay[day] = operation(activenessByWindow) //Get the average of each day.
    })

  return valuePerDay
}

export const getActivenessBreakdown = executives => {
  const valueLastDay = {
    period: 'Last Day',
    activeness: Object.values(getActiveness(executives, 1, getAverage)).slice(-1)[0],
  }
  const valueLastWeek = {
    period: 'Last Week',
    activeness: Object.values(getActiveness(executives, 7, getAverage)).slice(-1)[0],
  }
  const valueLastMonth = {
    period: 'Last Month',
    activeness: Object.values(getActiveness(executives, 30, getAverage)).slice(-1)[0],
  }
  const valueLast3Months = {
    period: 'Last 3 Months',
    activeness: Object.values(getActiveness(executives, 90, getAverage)).slice(-1)[0],
  }
  const valueLast6Months = {
    period: 'Last 6 Months',
    activeness: Object.values(getActiveness(executives, 180, getAverage)).slice(-1)[0],
  }
  const valueLastYear = {
    period: 'Last Year',
    activeness: Object.values(getActiveness(executives, 365, getAverage)).slice(-1)[0],
  }

  return [valueLastDay, valueLastWeek, valueLastMonth, valueLast3Months, valueLast6Months, valueLastYear]
}

export const getMKRActiveness = executives => {
  const valuePerDay = getActiveness(executives, 30, getAverage)

  const periods = periodsMap[LAST_MONTH]() //get last month periods
  //for each period, get the right average value
  return periods.map(el => {
    const day = Object.keys(valuePerDay).find(day => Number(day) >= el.from && Number(day) <= el.to)
    return {
      ...el,
      activeness: day ? Number(valuePerDay[day].toFixed(2)) : 0,
    }
  })
}

const getAverage = obj => {
  const objArray = Object.keys(obj)
  const result = objArray.reduce((accum: any, day) => obj[day] + accum, 0)
  return result / objArray.length
}

const getActivenessValue = (events, hasAdd, countAdd) => {
  let addCount = countAdd
  const response = events.reduce((acc, event) => {
    let mkr = acc
    if (event.type === VOTING_ACTION_ADD) {
      addCount++
      mkr = Number(event.locked)
    }
    if (event.type === VOTING_ACTION_REMOVE && addCount) {
      addCount--
    }

    if (event.type === VOTING_ACTION_REMOVE && !addCount) {
      mkr = 0
    }
    if (event.type === VOTING_ACTION_LOCK && addCount) {
      mkr = acc + Number(event.wad)
    }
    if (event.type === VOTING_ACTION_FREE && addCount) {
      mkr = acc - Number(event.wad)
    }
    return mkr
  }, hasAdd)
  return { value: response, addCount }
}
