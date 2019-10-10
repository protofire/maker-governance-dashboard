import React from 'react'
import styled from 'styled-components'
import { format, fromUnixTime, differenceInDays } from 'date-fns'
import gini from 'gini'
import BigNumber from 'bignumber.js'
import { Card, TitleContainer, Link } from '../common/styled'

import { getLastYear, getLastWeek, getLastMonth, getLastDay, shortenAccount, timeLeft } from '../../utils'
import { LAST_YEAR, LAST_MONTH, LAST_WEEK, LAST_DAY, ACTION_FREE } from '../../constants'

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
    return [
      ...acc,
      {
        label: k,
        gini: Object.keys(res[k]).length
          ? gini.unordered(Object.keys(res[k]).map(a => res[k][a].toNumber())).toFixed(2)
          : 0,
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

export const WrappedContainer = styled.div`
  ${TitleContainer} {
    span {
      font-size: 12px !important;
    }
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  ${Card} {
    flex: 0 0 28%;
    width: 25%;
  }
  @media (max-width: 768px) {
    ${Card} {
      width: 40%;
      flex: unset;
    }
  }
  @media (max-width: 580px) {
    ${Card} {
      width: 100% !important;
      flex: unset;
    }
  }
`

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

export const Pollcolumns = (isModalOpen: boolean) => {
  return [
    {
      Header: 'Name',
      accessor: 'title',
      Cell: ({ row }) => <Link href={row.original.url}>{row.original.title}</Link>,
    },
    {
      Header: 'Start date',
      id: 'startDate',
      accessor: row => fromUnixTime(row.startDate),
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.startDate), 'dd MMM yy'),
      show: isModalOpen,
    },
    {
      Header: 'End Date',
      accessor: 'endDate',
      Cell: ({ row }) => format(fromUnixTime(row.original.endDate), 'dd MMM yy'),
      show: isModalOpen,
    },
    {
      Header: 'Time Left',
      accessor: row => timeLeft(row.endDate),
    },
  ]
}

export const Executivecolumns = (isModalOpen: boolean) => {
  return [
    {
      Header: 'Executive creator',
      accessor: 'id',
      Cell: ({ row }) => shortenAccount(row.original.id),
    },
    {
      Header: 'MKR in Support',
      id: 'approvals',
      accessor: row => Number(row.approvals).toFixed(2),
    },
    {
      Header: 'Casted date',
      accessor: 'casted',
      Cell: ({ row }) => (row.original.casted ? format(fromUnixTime(row.original.casted), 'dd MMM yy') : '-'),
      show: isModalOpen,
    },
    {
      Header: 'MKR when lifted',
      accessor: 'liftedWith',
      Cell: ({ row }) => Number(row.original.liftedWith).toFixed(2),
      show: isModalOpen,
    },
    {
      Header: 'Lift date',
      accessor: 'lifted',
      Cell: ({ row }) => (row.original.lifted ? format(fromUnixTime(row.original.lifted), 'dd MMM yy') : '-'),
      show: isModalOpen,
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
    .filter(vote => vote.casted && differenceInDays(Date.now(), fromUnixTime(vote.casted)) <= 30)
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
