import React from 'react'
import ReactTooltip from 'react-tooltip'
import { format, fromUnixTime, differenceInDays, subDays, getUnixTime, startOfDay } from 'date-fns'
import gini from 'gini'
import BigNumber from 'bignumber.js'
import { Link } from '../common/styled'

import { getLastYear, getLastWeek, getLastMonth, getLastDay, shortenAccount, timeLeft } from '../../utils'
import {
  LAST_YEAR,
  LAST_MONTH,
  LAST_WEEK,
  LAST_DAY,
  ACTION_FREE,
  VOTING_ACTION_ADD,
  VOTING_ACTION_REMOVE,
  VOTING_ACTION_LOCK,
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
          <Link>
            <span data-tip={row.original.sender}>{shortenAccount(row.original.sender)}</span>
          </Link>
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
          <span data-tip={row.original.id}>{shortenAccount(row.original.id)}</span>
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
          <span data-tip={row.original.id}>{shortenAccount(row.original.id)}</span>
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

export const getMKRActiveness = executives => {
  const DAYS = 60
  const date = getUnixTime(subDays(Date.now(), DAYS - 1))
  const executivesTimeLine = executives
    .flatMap(vote => Array.from(new Set(vote.timeLine.filter(tl => tl.type !== VOTING_ACTION_REMOVE && tl.sender))))
    .filter(tl => tl.timestamp >= date)

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
  let activenessDeepClone = JSON.parse(JSON.stringify(groupByAddressDate))

  const startPos = DAYS / 2 - 1
  Object.keys(groupByAddressDate)
    .slice(startPos, DAYS)
    .forEach((day, i) => {
      let hasAddObj = {}
      Object.keys(groupByAddressDate)
        .slice(i, startPos + i + 1)
        .forEach(window => {
          Object.keys(groupByAddressDate[day]).forEach(addr => {
            const value = groupByAddressDate[window][addr]
              ? getActivenessValue(groupByAddressDate[window][addr].events, hasAddObj[addr] || 0)
              : 0
            hasAddObj[addr] = value
            activenessDeepClone[window].result = activenessDeepClone[window].result
              ? value + activenessDeepClone[window].result
              : value
          })
        })
    })
  const resultObj = Object.keys(activenessDeepClone)
    .map(day => ({
      day: Number(day),
      activeness: activenessDeepClone[day].result / (DAYS / 2),
    }))
    .slice(startPos, DAYS - 1)

  const periods = periodsMap[LAST_MONTH]()

  return periods.map(el => {
    const obj = resultObj.find(ev => ev.day >= el.from && ev.day <= el.to)
    return {
      ...el,
      activeness: obj ? Number(obj.activeness.toFixed(2)) : 0,
    }
  })
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
      : event.type === VOTING_ACTION_LOCK
      ? acc - Number(event.wad)
      : addValue
  }, hasAdd)
}
