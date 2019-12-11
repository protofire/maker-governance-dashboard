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
  polls[0].participation ? polls.sort((a, b) => Number(b.participation) - Number(a.participation)) : []

export const getRecentPolls = polls => polls.sort((a, b) => Number(b.startDate) - Number(a.startDate))

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
          <AddressNav address={row.original.sender}>
            <Link>
              <span data-tip={row.original.sender}>{shortenAccount(row.original.sender)}</span>
            </Link>
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
      disableFilters: true,
      Cell: ({ row }) => (row.original.participation ? `${row.original.participation}%` : '-'),
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
  const events = executives.flatMap(vote =>
    vote.timeLine
      .filter(tl => tl.type === VOTING_ACTION_ADD || tl.type === VOTING_ACTION_LOCK)
      .map(v => ({
        ...v,
        vote_date: vote.timestamp,
        mkr: v.type === VOTING_ACTION_ADD ? v.locked : v.wad,
      })),
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
  return periodEvents.map(p => ({ ...p, mkr: Number(p.mkr.toFixed(2)) }))
}

export const getPollsMKRResponsiveness = async polls => {
  const days = Math.max(
    ...polls.map(poll => {
      const start = poll.startDate >= 1e12 ? (poll.startDate / 1e3).toFixed(0) : poll.startDate
      const end = poll.endDate >= 1e12 ? (poll.endDate / 1e3).toFixed(0) : poll.endDate
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
        .reduce(
          (accum, v) => ({
            ...accum,
            [v.sender]:
              accum[v.sender] && accum[v.sender].timestamp < v.timestamp
                ? accum[v.sender]
                : { ...v, poll_startDate: poll.startDate, poll_endDate: poll.endDate, poll_id: poll.id },
          }),
          {},
        ),
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

  return periodEvents.map(p => ({ ...p, mkr: Number(p.mkr.toFixed(2)) }))
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

const getActiveness = (executives, window) => {
  const DAYS = window * 2
  const date = getUnixTime(subDays(Date.now(), DAYS - 1))

  //Get all votes events equal or greater than date
  const executivesTimeLine = executives
    .flatMap(vote => Array.from(new Set(vote.timeLine.filter(tl => tl.type !== VOTING_ACTION_REMOVE && tl.sender))))
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
      let activenessByWindow = {}
      Object.keys(groupByAddressDate)
        .slice(i, startPos + i + 1)
        .forEach(window => {
          activenessByWindow[window] = 0
          Object.keys(groupByAddressDate[window]).forEach(addr => {
            const value = groupByAddressDate[window][addr]
              ? getActivenessValue(groupByAddressDate[window][addr].events, hasAddObj[addr] || 0)
              : 0
            hasAddObj[addr] = value
            activenessByWindow[window] += value
          })
        })
      valuePerDay[day] = getAverage(activenessByWindow) //Get the average of each day.
    })
  return valuePerDay
}

export const getActivenessBreakdown = executives => {
  const valueLastDay = { period: 'Last Day', activeness: Object.values(getActiveness(executives, 1)).slice(-1)[0] }
  const valueLastWeek = { period: 'Last Week', activeness: Object.values(getActiveness(executives, 7)).slice(-1)[0] }
  const valueLastMonth = { period: 'Last Month', activeness: Object.values(getActiveness(executives, 30)).slice(-1)[0] }
  const valueLast3Months = {
    period: 'Last 3 Months',
    activeness: Object.values(getActiveness(executives, 90)).slice(-1)[0],
  }
  const valueLast6Months = {
    period: 'Last 6 Months',
    activeness: Object.values(getActiveness(executives, 180)).slice(-1)[0],
  }
  const valueLastYear = { period: 'Last Year', activeness: Object.values(getActiveness(executives, 365)).slice(-1)[0] }

  return [valueLastDay, valueLastWeek, valueLastMonth, valueLast3Months, valueLast6Months, valueLastYear]
}

export const getMKRActiveness = executives => {
  const valuePerDay = getActiveness(executives, 30)

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

const getActivenessValue = (events, hasAdd) => {
  let addValue = hasAdd
  return events.reduce((acc, event) => {
    if (!hasAdd) {
      addValue = event.type === VOTING_ACTION_ADD ? Number(event.locked) : 0
      return addValue
    }
    return event.type === VOTING_ACTION_ADD
      ? Number(event.locked)
      : event.type === VOTING_ACTION_LOCK
      ? acc + Number(event.wad)
      : event.type === VOTING_ACTION_FREE
      ? acc - Number(event.wad)
      : addValue
  }, hasAdd)
}
