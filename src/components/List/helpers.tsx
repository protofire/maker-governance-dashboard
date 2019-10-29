import React from 'react'
import ReactTooltip from 'react-tooltip'
import { format, fromUnixTime, differenceInMonths } from 'date-fns'
import { timeLeft } from '../../utils'
import { SelectColumnFilter } from '../common/Table/filters'

//Common components
import { Spinner, SpinnerContainer } from '../common'

const Loading = () => (
  <SpinnerContainer>
    <Spinner table />
  </SpinnerContainer>
)

export const Pollcolumns = () => {
  return [
    {
      Header: 'Name',
      accessor: 'title',
      filter: 'fuzzyText',
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <span data-tip={row.original.title}>{row.original.title}</span>
        </>
      ),
    },
    {
      Header: 'Winning Option',
      accessor: 'win-option',
      disableFilters: true,
      sortType: (a, b) => (a.original.plurality.option.label > b.original.plurality.option.label ? 1 : -1),
      Cell: ({ row }) => (row.original.plurality ? row.original.plurality.option.label : <Loading />),
      width: 50,
    },
    {
      Header: 'Winning Option Weight',
      accessor: 'win-mkr',
      disableFilters: true,
      sortType: (a, b) => a.original.plurality.option.mkr - b.original.plurality.option.mkr,
      Cell: ({ row }) => (row.original.plurality ? row.original.plurality.option.mkr : <Loading />),
      width: 80,
    },
    {
      Header: 'Winning Plurality',
      accessor: 'plurality',
      disableFilters: true,
      sortType: (a, b) => a.original.plurality.mkr - b.original.plurality.mkr,
      Cell: ({ row }) => (row.original.plurality ? `${row.original.plurality.mkr}%` : <Loading />),
      width: 80,
    },
    {
      Header: 'MKR Participation',
      accessor: 'participation',
      disableFilters: true,
      Cell: ({ row }) => (row.original.participation ? `${row.original.participation}%` : <Loading />),
      width: 80,
    },
    {
      Header: 'Category',
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row => 'uncategorized',
      width: 100,
    },
    {
      Header: 'Start',
      accessor: row => fromUnixTime(row.startDate),
      disableFilters: true,
      id: 'date',
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.startDate), 'dd MMM yy'),
      width: 100,
    },
    {
      Header: 'End',
      accessor: row => fromUnixTime(row.endDate),
      disableFilters: true,
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.endDate), 'dd MMM yy'),
      width: 100,
    },
    {
      Header: 'Status',
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row => timeLeft(row.endDate),
      width: 100,
    },
  ]
}

export const Executivecolumns = () => {
  return [
    {
      Header: 'Status',
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row =>
        row.casted ? 'Passed' : differenceInMonths(new Date(), fromUnixTime(row.timestamp)) < 12 ? 'Open' : 'Limbo',
      id: 'status',
      Cell: ({ row }) =>
        row.original.casted ? (
          <span style={{ color: '#00ba9c' }}>Passed</span>
        ) : differenceInMonths(new Date(), fromUnixTime(row.original.timestamp)) < 12 ? (
          <span style={{ color: '#fac202' }}>Open</span>
        ) : (
          'Limbo'
        ),
      width: 100,
    },
    {
      Header: 'Name',
      accessor: row => row.title || row.id,
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <span data-tip={row.original.title || row.original.id}>{row.original.title || row.original.id}</span>
        </>
      ),
      filter: 'fuzzyText',
    },
    {
      Header: 'MKR in support',
      disableFilters: true,
      accessor: row => Number(row.approvals).toFixed(2),
      width: 100,
    },
    {
      Header: 'Category',
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row => 'uncategorized',
      width: 100,
    },
    {
      Header: 'Started',
      id: 'date',
      disableFilters: true,
      accessor: row => (!row.timestamp ? new Date(row.date) : fromUnixTime(row.timestamp)),
      sortType: 'datetime',
      Cell: ({ row }) =>
        row.original.timestamp
          ? format(fromUnixTime(row.original.timestamp), 'dd MMM yy')
          : format(new Date(row.date), 'dd MMM yy'),
      width: 100,
    },
    {
      Header: 'Executed',
      id: 'executed',
      disableFilters: true,
      sortType: (a, b) => a.original.casted - b.original.casted,
      accessor: row => (row.casted ? format(fromUnixTime(row.casted), 'dd MMM yy') : 'NO'),
      width: 100,
    },
  ]
}
