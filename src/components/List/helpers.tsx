import React from 'react'
import { format, fromUnixTime, formatDistance, differenceInMonths } from 'date-fns'
import { Link } from '../common/styled'
import { timeLeft } from '../../utils'

export const Pollcolumns = () => {
  return [
    {
      Header: 'Name',
      accessor: 'title',
      Cell: ({ row }) => <Link href={row.original.url}>{row.original.title}</Link>,
    },
    {
      Header: 'Overview',
      accessor: 'summary',
    },
    {
      Header: 'Started',
      defaultDescSorted: true,
      accessor: row => fromUnixTime(row.startDate),
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.startDate), 'dd MMM yy'),
    },
    {
      Header: 'Ended',
      accessor: row => fromUnixTime(row.endDate),
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.endDate), 'dd MMM yy'),
    },
    {
      Header: 'Status',
      accessor: row => timeLeft(row.endDate),
    },
  ]
}

export const Executivecolumns = () => {
  return [
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }) =>
        row.original.casted
          ? 'Passed'
          : differenceInMonths(new Date(), fromUnixTime(row.original.timestamp)) < 12
          ? 'Open'
          : 'Limbo',
    },
    {
      Header: 'Name',
      accessor: row => row.title || row.id,
    },
    {
      Header: 'Overview',
      accessor: 'proposal_blurb',
    },
    {
      Header: 'MKR in support',
      accessor: row => Number(row.approvals).toFixed(2),
    },
    {
      Header: 'Started',
      defaultDescSorted: true,
      accessor: row => (!row.timestamp ? new Date(row.date) : fromUnixTime(row.timestamp)),
      sortType: 'datetime',
      Cell: ({ row }) =>
        !row.original.timestamp
          ? formatDistance(new Date(row.original.date), new Date(), { addSuffix: true })
          : formatDistance(fromUnixTime(row.original.timestamp), new Date(), { addSuffix: true }),
    },
    {
      Header: 'Executed',
      accessor: 'executed',
      Cell: ({ row }) => (row.original.casted ? format(fromUnixTime(row.original.casted), 'dd MMM yy') : 'NO'),
    },
  ]
}
