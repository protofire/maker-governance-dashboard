import React from 'react'
import ReactTooltip from 'react-tooltip'
import { format, fromUnixTime, differenceInMonths } from 'date-fns'
import { timeLeft } from '../../utils'

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
      sortType: (a, b) => (a.original.plurality.option.label > b.original.plurality.option.label ? 1 : -1),
      Cell: ({ row }) => (row.original.plurality ? row.original.plurality.option.label : <Loading />),
      width: 100,
    },
    {
      Header: 'Winning Option Weight',
      accessor: 'win-mkr',
      sortType: (a, b) => a.original.plurality.option.mkr - b.original.plurality.option.mkr,
      Cell: ({ row }) => (row.original.plurality ? row.original.plurality.option.mkr : <Loading />),
      width: 100,
    },
    {
      Header: 'Winning Plurality',
      accessor: 'plurality',
      sortType: (a, b) => a.original.plurality.mkr - b.original.plurality.mkr,
      Cell: ({ row }) => (row.original.plurality ? `${row.original.plurality.mkr}%` : <Loading />),
      width: 100,
    },
    {
      Header: 'MKR Participation',
      accessor: 'participation',
      Cell: ({ row }) => (row.original.participation ? `${row.original.participation}%` : <Loading />),
      width: 100,
    },
    {
      Header: 'Start',
      accessor: row => fromUnixTime(row.startDate),
      id: 'date',
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.startDate), 'dd MMM yy'),
      width: 100,
    },
    {
      Header: 'End',
      accessor: row => fromUnixTime(row.endDate),
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.endDate), 'dd MMM yy'),
      width: 100,
    },
    {
      Header: 'Status',
      accessor: row => timeLeft(row.endDate),
      width: 100,
    },
  ]
}

export const Executivecolumns = () => {
  return [
    {
      Header: 'Status',
      accessor: 'status',
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
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          <span data-tip={row.original.title || row.original.id}>{row.original.title || row.original.id}</span>
        </>
      ),
    },
    {
      Header: 'MKR in support',
      accessor: row => Number(row.approvals).toFixed(2),
      width: 100,
    },
    {
      Header: 'Started',
      id: 'date',
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
      sortType: (a, b) => a.original.casted - b.original.casted,
      accessor: row => (row.casted ? format(fromUnixTime(row.casted), 'dd MMM yy') : 'NO'),
      width: 100,
    },
  ]
}
