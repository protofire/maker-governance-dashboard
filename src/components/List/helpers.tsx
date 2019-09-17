import React from 'react'
import { format, fromUnixTime, formatDistance } from 'date-fns'
import { Link } from '../common/styled'

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
      accessor: 'title',
    },
    {
      Header: 'Overview',
      accessor: 'proposal_blurb',
    },
    {
      Header: 'MKR in support',
      accessor: 'mkr',
    },
    {
      Header: 'Started',
      accessor: 'date',
      Cell: ({ row }) => formatDistance(new Date(row.original.date), new Date(), { addSuffix: true }),
    },
    {
      Header: 'Executed',
      accessor: 'executed',
    },
  ]
}
