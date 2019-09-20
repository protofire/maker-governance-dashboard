import React from 'react'
import { format, fromUnixTime, formatDistance } from 'date-fns'
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
      accessor: 'startDate',
      Cell: ({ row }) => format(fromUnixTime(row.original.startDate), 'dd MMM yy'),
    },
    {
      Header: 'Ended',
      accessor: 'endDate',
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
      accessor: row =>
        row.castedWith === undefined
          ? row.end_approvals
          : row.castedWith
          ? (row.castedWith / Math.pow(10, 18)).toFixed(2)
          : '-',
    },
    {
      Header: 'Started',
      accessor: 'date',
      Cell: ({ row }) =>
        !row.original.timestamp
          ? formatDistance(new Date(row.original.date), new Date(), { addSuffix: true })
          : formatDistance(fromUnixTime(row.original.timestamp), new Date(), { addSuffix: true }),
    },
    {
      Header: 'Executed',
      accessor: 'executed',
    },
  ]
}
