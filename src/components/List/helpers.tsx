import React from 'react'
import ReactTooltip from 'react-tooltip'
import { format, fromUnixTime, differenceInMonths } from 'date-fns'
import { timeLeft } from '../../utils'
import { SelectColumnFilter } from '../common/Table/filters'
import { Spinner, SpinnerContainer, AddressNav } from '../common'

const Loading = () => (
  <SpinnerContainer>
    <Spinner table />
  </SpinnerContainer>
)

export const Pollcolumns = () => {
  return [
    {
      Header: 'Status',
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row => (timeLeft(row.endDate) === 'Ended' ? 'Ended' : 'Active'),
      Cell: ({ row }) => timeLeft(row.original.endDate),
      width: 100,
    },
    {
      Header: 'Category',
      Filter: SelectColumnFilter,
      separator: true,
      show: false,
      filter: 'includes',
      accessor: row => 'uncategorized',
      width: 100,
    },
    {
      Header: 'Name',
      separator: true,
      accessor: row => row.title,
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
      sortType: (a, b) => a.original.participation - b.original.participation,
      separator: true,
      disableFilters: true,
      Cell: ({ row }) => (row.original.participation ? `${row.original.participation}%` : <Loading />),
      width: 80,
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
      separator: true,
      sortType: 'datetime',
      Cell: ({ row }) => format(fromUnixTime(row.original.endDate), 'dd MMM yy'),
      width: 100,
    },
  ]
}

export const Executivecolumns = () => {
  return [
    {
      Header: 'Status',
      separator: true,
      hat: true,
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row =>
        row.isHat && row.isActive
          ? 'Hat+Active'
          : row.isHat
          ? 'Hat'
          : row.isActive
          ? 'Active'
          : row.casted
          ? 'Passed'
          : differenceInMonths(new Date(), fromUnixTime(row.timestamp)) < 12
          ? 'Open'
          : 'Limbo',
      id: 'status',
      Cell: ({ row }) =>
        row.original.isHat && row.original.isActive ? (
          <span style={{ color: '#00ba9c', marginLeft: '20px', fontWeight: 700 }}>
            <span>Active</span>
          </span>
        ) : row.original.isHat ? (
          <span style={{ color: '#000', marginLeft: '20px' }}>
            <span>Hat</span>
          </span>
        ) : row.original.isActive ? (
          <span style={{ color: '#00ba9c', marginLeft: '20px', fontWeight: 700 }}>Active</span>
        ) : row.original.casted ? (
          <span style={{ color: '#2730a0', marginLeft: '20px' }}>Passed</span>
        ) : differenceInMonths(new Date(), fromUnixTime(row.original.timestamp)) < 12 ? (
          <span style={{ color: '#fac202', marginLeft: '20px' }}>Open</span>
        ) : (
          'Limbo'
        ),
      width: 100,
    },
    {
      Header: 'Category',
      Filter: SelectColumnFilter,
      separator: true,
      show: false,
      filter: 'includes',
      accessor: row => 'uncategorized',
      width: 100,
    },
    {
      Header: 'Name',
      separator: true,
      accessor: row => row.title || row.id,
      Cell: ({ row }) => (
        <>
          <ReactTooltip place="top" type="dark" effect="solid" />
          {row.original.title ? (
            <AddressNav address={row.original.id}>
              <span data-tip={row.original.title}>{row.original.title}</span>
            </AddressNav>
          ) : (
            <AddressNav address={row.original.id}>
              <span data-tip={row.original.id}>{row.original.id}</span>
            </AddressNav>
          )}
        </>
      ),
    },
    {
      Header: 'MKR in support',
      separator: true,
      disableFilters: true,
      accessor: row => Number(row.approvals).toFixed(2),
      width: 100,
    },
    {
      Header: 'Started',
      id: 'date',
      separator: true,
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

export const VoterHistoryColumns = () => {
  return [
    {
      Header: 'Type',
      separator: true,
      Filter: SelectColumnFilter,
      accessor: row => (row.__typename === 'Spell' ? 'Executive' : 'Poll'),
      width: 100,
    },
    {
      Header: 'Status',
      separator: true,
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row =>
        row.__typename === 'Spell' && row.casted
          ? 'Passed'
          : row.__typename !== 'Spell' && timeLeft(row.endDate) === 'Ended'
          ? 'Ended'
          : 'Open',
      id: 'status',
      Cell: ({ row }) =>
        row.original.__typename === 'Spell' && row.original.casted ? (
          <span style={{ color: '#2730a0', marginLeft: '20px' }}>Passed</span>
        ) : row.__typename !== 'Spell' && timeLeft(row.original.endDate) === 'Ended' ? (
          <span style={{ color: '#444', marginLeft: '20px' }}>Ended</span>
        ) : (
          <span style={{ color: '#fac202', marginLeft: '20px' }}>Open</span>
        ),
      width: 100,
    },
    {
      Header: 'Name',
      separator: true,
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
      Header: 'Category',
      Filter: SelectColumnFilter,
      separator: true,
      filter: 'includes',
      show: false,
      accessor: () => 'uncategorized',
      width: 100,
    },
    {
      Header: 'Winning Option',
      accessor: 'win-option',
      separator: true,
      disableFilters: true,
      width: 100,
      Cell: ({ row }) =>
        row.original.__typename === 'Spell' ? (
          'N/A'
        ) : row.original.plurality ? (
          row.original.plurality.option.label
        ) : (
          <Loading />
        ),
    },
  ]
}
