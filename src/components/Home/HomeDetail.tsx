import React, { useState, useEffect, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { getHomeData, GetGovernanceInfo } from '../../types/generatedGQL'
import {
  VotesVsPollsChart,
  VotersVsMkrChart,
  GiniChart,
  TimeTakenChart,
  MkrDistributionPerExecutiveChart,
} from './Charts'
import { Card, Table, Modal, TableWrapper, Spinner, SpinnerContainer, ThreeRowGrid } from '../common'
import { getMakerDaoData, getPollsData } from '../../utils/makerdao'
import { getModalContainer } from '../../utils'
import {
  getVotersVsMkrData,
  getVotesVsPollsData,
  getGiniData,
  defaultFilters,
  getComponentData,
  Pollcolumns,
  Executivecolumns,
  getTimeTakenForExecutives,
  getMkrDistributionPerExecutive,
} from './helpers'

const Loading = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
)

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
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [polls, setPolls] = useState<any[]>([])

  const pollcolumns = expanded => Pollcolumns(expanded)
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
            content="MKR Distribution Per Executive"
            component="mkrDistributionPerExecutive"
            {...props}
          />
        ),
      },
      votesVsPolls: {
        data: getVotesVsPollsData(data.executives, polls, chartFilters.votesVsPolls),
        component: props => (
          <VotesVsPolls expanded content="Executive Votes" versus="Polls" component="votesVsPolls" {...props} />
        ),
      },
      gini: {
        data: giniData,
        component: props => <Gini expanded content="MKR Gini Coefficient" component="gini" {...props} />,
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
      <TableWrapper {...getWrapperProps(data)}>
        <Table {...getModalProps(data.type, data.component, data.expanded, props.handleRow)} />
      </TableWrapper>
    )
  }

  const setModal = (data: any, isChart: boolean = false): void => {
    setModalOpen(true)
    setModalChart(isChart)
    setModalData(data)
  }

  useEffect(() => {
    Promise.all([getPollsData(data.polls), getMakerDaoData()])
      .then(result => {
        const polls = result[0].filter(Boolean)
        setPolls([...polls])
      })
      .catch(error => {
        console.log(error)
      })
  }, [data])

  return (
    <>
      <Card style={{ height: '340px', marginBottom: '20px', minHeight: 'fit-content' }}>
        <VotersVsMkr content="Number of voters" versus="Total MKR staked" component="votersVsMkr" />
      </Card>
      <ThreeRowGrid style={{ marginBottom: '20px' }}>
        <Card style={{ padding: 0, height: '340px', minHeight: 'fit-content' }}>
          <HomeTable handleRow={getVote} content="Executive votes" component="executives" />
        </Card>
        <Card style={{ height: '340px', minHeight: 'fit-content' }}>
          <TimeTakenForExecutives content="Executive Votes - Time Taken To Pass" component="timeTakenForExecutives" />
        </Card>
        <Card style={{ height: '340px', minHeight: 'fit-content' }}>
          <MkrDistributionPerExecutive
            content="MKR Distribution Per Executive"
            component="mkrDistributionPerExecutive"
          />
        </Card>
      </ThreeRowGrid>
      <ThreeRowGrid>
        <Card style={{ padding: 0, height: '340px', minHeight: 'fit-content' }}>
          {polls.length === 0 ? (
            <Loading />
          ) : (
            <HomeTable handleRow={getPoll} content="Most Recent Polls" component="polls" />
          )}
        </Card>
        <Card style={{ height: '340px', minHeight: 'fit-content' }}>
          {polls.length === 0 ? (
            <Loading />
          ) : (
            <VotesVsPolls content="Executive Votes" versus="Polls" component="votesVsPolls" />
          )}
        </Card>
        <Card style={{ height: '340px', minHeight: 'fit-content' }}>
          <Gini content="MKR Gini Coefficient" component="gini" />
        </Card>
      </ThreeRowGrid>
      {isModalOpen && (
        <Modal isChart={isModalChart} isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
          {getModalContainer(homeMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default withRouter(HomeDetail)
