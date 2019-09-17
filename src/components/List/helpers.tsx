import React from 'react'
import { format, fromUnixTime } from 'date-fns'
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
      accessor: 'name',
    },
    {
      Header: 'Overview',
      accessor: 'overview',
    },
    {
      Header: 'MKR in support',
      accessor: 'mkr',
    },
    {
      Header: 'Started',
      accessor: 'started',
    },
    {
      Header: 'Executed',
      accessor: 'executed',
    },
  ]
}
