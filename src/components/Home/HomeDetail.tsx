import React, { useState, useEffect, useMemo } from 'react'
import lscache from 'lscache'
import { withRouter } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { getHomeData, GetGovernanceInfo } from '../../types/generatedGQL'
import {
  VotesVsPollsChart,
  VotersVsMkrChart,
  GiniChart,
  TimeTakenChart,
  MkrDistributionPerExecutiveChart,
} from './Charts'
import { DEFAULT_CACHE_TTL } from '../../constants'
import {
  Card,
  Modal,
  Spinner,
  SpinnerContainer,
  StrippedTableWrapper,
  Table,
  TwoRowGrid,
  PageTitle,
  PageSubTitle,
} from '../common'
import { getPollsData, getMKRSupply } from '../../utils/makerdao'
import { getPollData } from '../../components/PollDetails/data'
import { getPollsBalances } from '../List/helpers'

import { getModalContainer } from '../../utils'
import {
  getVotersVsMkrData,
  getVotesVsPollsData,
  getGiniData,
  defaultFilters,
  getComponentData,
  Pollcolumns,
  VotedPollcolumns,
  Executivecolumns,
  getTimeTakenForExecutives,
  getMkrDistributionPerExecutive,
} from './helpers'
import styled from 'styled-components'

const CardStyled = styled(Card)`
  height: ${props => props.theme.defaultCardHeight};
  min-height: fit-content;
`
const TableCardStyled = styled(Card)`
  min-height: ${props => props.theme.defaultCardHeight};
  height: auto;
`

const Loading = () => (
  <SpinnerContainer>
    <Spinner width="35px" height="35px" />
  </SpinnerContainer>
)

const getParticipation = (data, mkrSupply) => {
  const totalMkr: BigNumber = data.reduce((acc, value) => acc.plus(new BigNumber(value.mkr)), new BigNumber('0'))
  return totalMkr
    .times(100)
    .div(mkrSupply)
    .toString()
}

const TABLE_PREVIEW = 5

type Props = {
  data: getHomeData
  gData: GetGovernanceInfo
  history?: any
  subscribeToChanges?: () => void
}

function HomeDetail(props: Props) {
  const { data, gData, history } = props
  const { governanceInfo } = gData
  const [isModalOpen, setModalOpen] = useState(false)
  const cachedData = lscache.get('home-polls') || []
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [mkrSupply, setMkrSupply] = useState<BigNumber | undefined>(undefined)
  const [pollsBalances, setBalances] = useState<any>({})

  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [polls, setPolls] = useState<any[]>(cachedData)

  const pollcolumns = expanded => Pollcolumns(expanded)
  const votedPollcolumns = () => VotedPollcolumns()

  useEffect(() => {
    if (cachedData.length === 0) getPollsBalances(polls).then(balances => setBalances(balances))
  }, [polls, cachedData.length])

  useEffect(() => {
    if (cachedData.length === 0) getMKRSupply().then(supply => setMkrSupply(supply))
  }, [cachedData.length])

  const executiveColumns = expanded => Executivecolumns(expanded)
  const executives = data.executives

  const getPoll = row => {
    if (row.id) history.push(`/poll/${row.id}`)
  }

  const getVote = row => {
    if (row.id) history.push(`/executive/${row.id}`)
  }

  // Data map for building this page
  const giniData = getGiniData([...data.free, ...data.lock], chartFilters.gini)
  const homeMap = {
    table: {
      polls: {
        data: polls.sort((a, b) => Number(b.startDate) - Number(a.startDate)),
        columns: expanded => pollcolumns(expanded),
        sortBy: useMemo(() => [{ id: 'startDate', desc: true }], []),
        component: props => (
          <HomeTable handleRow={getPoll} expanded content="Most Recent Polls" component="polls" {...props} />
        ),
      },
      votedPolls: {
        data: polls.sort((a, b) => Number(b.participation) - Number(a.participation)),
        columns: votedPollcolumns,
        component: props => (
          <HomeTable handleRow={getPoll} expanded content="Most Voted Polls" component="votedPolls" {...props} />
        ),
      },
      executives: {
        data: data.executives.sort((a, b) => Number(b.approvals) - Number(a.approvals)),
        columns: expanded => executiveColumns(expanded),
        sortBy: useMemo(() => [{ id: 'approvals', desc: true }], []),
        component: props => (
          <HomeTable expanded handleRow={getVote} content="Top executives" component="executives" {...props} />
        ),
      },
    },
    chart: {
      votersVsMkr: {
        data: getVotersVsMkrData(data.voters, [...data.free, ...data.lock], chartFilters.votersVsMkr),
        component: props => (
          <VotersVsMkr
            expanded
            content="Number of voters"
            versus="Total MKR staked"
            component="votersVsMkr"
            {...props}
          />
        ),
      },
      mkrDistributionPerExecutive: {
        data: getMkrDistributionPerExecutive(executives, governanceInfo ? governanceInfo.hat : null),
        component: props => (
          <MkrDistributionPerExecutive
            expanded
            content="MKR Distribution By Executive"
            component="mkrDistributionPerExecutive"
            {...props}
          />
        ),
      },
      votesVsPolls: {
        data: getVotesVsPollsData(data.executives, polls, chartFilters.votesVsPolls),
        component: props => <VotesVsPolls expanded content="Total Votes" component="votesVsPolls" {...props} />,
      },
      gini: {
        data: giniData,
        component: props => <Gini expanded content="Voting MKR Gini Coefficient" component="gini" {...props} />,
      },
      timeTakenForExecutives: {
        data: getTimeTakenForExecutives(data.executives),
        component: props => (
          <TimeTakenForExecutives
            expanded
            content="Executive Votes - Time Taken To Pass"
            component="timeTakenForExecutives"
            {...props}
          />
        ),
      },
    },
  }

  const setFilter = (e, component) => {
    const obj = {
      ...chartFilters,
      [component]: e.target.value,
    }
    setChartFilters(obj)
  }

  const getWrapperProps = data => {
    const { content, versus = null, component, expanded } = data
    const isChart = data.type === 'table' ? false : true
    const handleModal = !expanded ? () => setModal(data, isChart) : () => setModalOpen(false)
    return {
      content,
      versus,
      value: chartFilters[data.component],
      handleModal,
      onChange: e => setFilter(e, component),
      isModalOpen: expanded,
    }
  }

  const getModalProps = (type, component, expanded = false, handleRow = undefined) => {
    const data = homeMap[type][component].data
    if (type === 'table')
      return {
        expanded,
        handleRow,
        scrollable: expanded,
        data: expanded ? data : data.slice(0, TABLE_PREVIEW),
        columns: homeMap[type][component].columns(expanded),
        sortBy: expanded ? homeMap[type][component].sortBy : [],
      }
    return {
      modalStyles: expanded ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      minHeight: '400px',
      data,
    }
  }

  // VotersVsMkr graph data
  const VotersVsMkr = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <VotersVsMkrChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // VotesVsPolls graph data
  const VotesVsPolls = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <VotesVsPollsChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // MkrDistributionPerExecutive graph data
  const MkrDistributionPerExecutive = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <MkrDistributionPerExecutiveChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // Gini graph data
  const Gini = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <GiniChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // Time taken graph data
  const TimeTakenForExecutives = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <TimeTakenChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  // Table Data
  const HomeTable = props => {
    const data = getComponentData('table', props.component, props.content, props.expanded)

    return (
      <StrippedTableWrapper {...getWrapperProps(data)}>
        <Table {...getModalProps(data.type, data.component, data.expanded, props.handleRow)} />
      </StrippedTableWrapper>
    )
  }

  const setModal = (data: any, isChart: boolean = false): void => {
    setModalOpen(true)
    setModalChart(isChart)
    setModalData(data)
  }

  useEffect(() => {
    if (mkrSupply && cachedData.length === 0) {
      getPollsData(data.polls).then(result => {
        const polls = result.filter(Boolean)
        setPolls([...polls])
        Promise.all(
          polls.map(poll => {
            return getPollData(poll, pollsBalances).then(data => {
              return { ...poll, participation: getParticipation(data, mkrSupply) }
            })
          }),
        ).then(pollsWithPluralityAndParticipation => {
          setPolls(pollsWithPluralityAndParticipation)
        })
      })
    }
  }, [data.polls, cachedData.length, mkrSupply, pollsBalances])

  useEffect(() => {
    lscache.set('home-polls', polls, DEFAULT_CACHE_TTL)
  }, [polls])

  return (
    <>
      <PageTitle>System Statistics</PageTitle>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <CardStyled></CardStyled>
        <CardStyled>
          <VotersVsMkr content="Number of voters" versus="Total MKR staked" component="votersVsMkr" />
        </CardStyled>
      </TwoRowGrid>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <CardStyled>
          {polls.length === 0 ? (
            <Loading />
          ) : (
            <VotesVsPolls content="Total Votes" versus="Polls" component="votesVsPolls" />
          )}
        </CardStyled>
        <CardStyled>
          <Gini content="Voting MKR Gini Coefficient" component="gini" />
        </CardStyled>
      </TwoRowGrid>
      <PageSubTitle>Executives</PageSubTitle>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <TableCardStyled style={{ padding: 0 }}>
          <HomeTable handleRow={getVote} content="Top Executives" component="executives" />
        </TableCardStyled>
        <CardStyled></CardStyled>
      </TwoRowGrid>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <CardStyled>
          <TimeTakenForExecutives content="Executive Votes - Time Taken To Pass" component="timeTakenForExecutives" />
        </CardStyled>
        <CardStyled>
          <MkrDistributionPerExecutive
            content="MKR Distribution By Executive"
            component="mkrDistributionPerExecutive"
          />
        </CardStyled>
      </TwoRowGrid>
      <PageSubTitle>Polls</PageSubTitle>
      <TwoRowGrid>
        <TableCardStyled style={{ padding: 0 }}>
          {polls.length === 0 ? <Loading /> : <HomeTable content="Most Voted Polls" component="votedPolls" />}
        </TableCardStyled>
        <TableCardStyled style={{ padding: 0 }}>
          {polls.length === 0 ? (
            <Loading />
          ) : (
            <HomeTable handleRow={getPoll} content="Most Recent Polls" component="polls" />
          )}
        </TableCardStyled>
      </TwoRowGrid>
      {isModalOpen && (
        <Modal isChart={isModalChart} isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
          {getModalContainer(homeMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default withRouter(HomeDetail)
