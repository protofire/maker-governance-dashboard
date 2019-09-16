import React from 'react'
import styled from 'styled-components'
import { format, fromUnixTime } from 'date-fns'
import { Card, TitleContainer, Link } from '../common/styled'

import { getLastYear, getLastWeek, getLastMonth, getLastDay, shortenAccount, timeLeft } from '../../utils'
import { LAST_YEAR, LAST_MONTH, LAST_WEEK, LAST_DAY, ACTION_FREE } from '../../constants'

const periodsMap = {
  [LAST_YEAR]: getLastYear,
  [LAST_MONTH]: getLastMonth,
  [LAST_WEEK]: getLastWeek,
  [LAST_DAY]: getLastDay,
}

export const getModalContainer = Content => <Content />

const formatMkrData = (el, data, prev) => {
  return data
    .filter(d => d.timestamp >= el.from && d.timestamp <= el.to)
    .reduce((acum, value) => (value.type === ACTION_FREE ? acum - Number(value.wad) : acum + Number(value.wad)), prev)
}

export const getVotersVsMkrData = (data: Array<any>, mkrLockFree: Array<any>, time: string): Array<any> => {
  const periods = periodsMap[time]()

  let count = data.filter(el => el.timestamp < periods[0].from).length
  let mkr = initializeMkr(periods[0].from, mkrLockFree, 0)
  return periods.map(el => {
    mkr = formatMkrData(el, mkrLockFree, mkr)
    count += data.filter(d => {
      return d.timestamp >= el.from && d.timestamp <= el.to
    }).length
    return {
      ...el,
      count,
      mkr: mkr.toFixed(2),
    }
  })
}

const initializeMkr = (el, data, prev) => {
  return data
    .filter(d => d.timestamp < el)
    .reduce((acum, value) => (value.type === ACTION_FREE ? acum - Number(value.wad) : acum + Number(value.wad)), prev)
}
export const defaultFilters = {
  votersVsMkr: LAST_YEAR,
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

export const Pollcolumns = (isModalOpen: boolean) => {
  return [
    {
      Header: 'Poll creator',
      accessor: 'creator',
      Cell: ({ row }) => <Link href={row.original.url}>{shortenAccount(row.original.creator)}</Link>,
    },
    {
      Header: 'Start date',
      accessor: 'startDate',
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
      accessor: 'castedWith',
      Cell: ({ row }) => (row.original.castedWith / Math.pow(10, 18)).toFixed(2),
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
      Cell: ({ row }) => (row.original.liftedWith / Math.pow(10, 18)).toFixed(2),
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
