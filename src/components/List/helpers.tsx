import React from 'react'
import styled from 'styled-components'
import ReactTooltip from 'react-tooltip'
import { format, fromUnixTime, differenceInMonths, getUnixTime } from 'date-fns'
import { timeLeft } from '../../utils'
import { getVoterBalances } from '../../utils'
import { SelectColumnFilter } from '../common/Table/filters'
import { Spinner, SpinnerContainer } from '../common'
import { HatIcon } from '../common/Icon'

const Loading = () => (
  <SpinnerContainer>
    <Spinner table />
  </SpinnerContainer>
)

const HatIconContainer = styled(HatIcon)`
  position: relative;
  top: 1px;
  right: 3px;
`

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

export const Executivecolumns = governance => {
  const hat = governance ? governance.governanceInfo.hat : undefined
  const active = governance ? governance.governanceInfo.active : undefined
  return [
    {
      Header: 'Status',
      Filter: SelectColumnFilter,
      filter: 'includes',
      accessor: row =>
        row.id === hat && row.id === active
          ? 'Hat+Active'
          : row.id === hat
          ? 'Hat'
          : row.id === active
          ? 'Active'
          : row.casted
          ? 'Passed'
          : differenceInMonths(new Date(), fromUnixTime(row.timestamp)) < 12
          ? 'Open'
          : 'Limbo',
      id: 'status',
      Cell: ({ row }) =>
        row.original.id === hat && row.original.id === active ? (
          <span style={{ color: '#2730a0', marginLeft: '12px' }}>
            <HatIconContainer /> <span>Active</span>
          </span>
        ) : row.original.id === hat ? (
          <span style={{ color: '#000', marginLeft: '12px' }}>
            <HatIconContainer /> <span>Hat</span>
          </span>
        ) : row.original.id === active ? (
          <span style={{ color: '#2730a0', marginLeft: '30px' }}>Active</span>
        ) : row.original.casted ? (
          <span style={{ color: '#00ba9c', marginLeft: '30px' }}>Passed</span>
        ) : differenceInMonths(new Date(), fromUnixTime(row.original.timestamp)) < 12 ? (
          <span style={{ color: '#fac202', marginLeft: '30px' }}>Open</span>
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

export const getPollsBalances = async polls => {
  const now = new Date()
  const allVoters = Array.from(
    new Set(polls.flatMap(poll => poll.votes.reduce((voters, v) => [...voters, v.voter], []))),
  )

  const allBalances = await Promise.all(allVoters.map(addr => getVoterBalances(addr, getUnixTime(now))))
  return allBalances.flat().reduce((lookup, snapshot: any) => {
    const account = snapshot.account.address
    const balances = lookup[account] || []
    const newBalances = [
      ...balances,
      {
        amount: snapshot.amount,
        timestamp: snapshot.timestamp,
      },
    ]

    return {
      ...lookup,
      [account]: newBalances,
    }
  }, {})
}
