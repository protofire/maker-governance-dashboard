import React, { useState, useEffect } from 'react'
import { ChartWrapper } from '../../components/common'
import { getHomeData, GetGovernanceInfo } from '../../types/generatedGQL'
import { Card, Table, Chart, Modal, TableWrapper } from '../common'
import {
  getModalContainer,
  WrappedContainer,
  getVotersVsMkrData,
  getVotesVsPollsData,
  getGiniData,
  defaultFilters,
  getComponentData,
  Pollcolumns,
  Executivecolumns,
} from './helpers'
import { Line, YAxis } from 'recharts'

import { getMakerDaoData, getPollsData } from '../../utils/makerdao'

const TABLE_PREVIEW = 5

type Props = {
  data: getHomeData
  gData: GetGovernanceInfo
  subscribeToChanges?: () => void
}

function HomeDetail(props: Props) {
  const { data, gData } = props
  const { governanceInfo } = gData
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [polls, setPolls] = useState<any[]>([])
  const pollcolumns = expanded => Pollcolumns(expanded)
  const executiveColumns = expanded => Executivecolumns(expanded)

  // Data map for building this page
  const giniData = getGiniData([...data.free, ...data.lock], chartFilters.gini)
  const homeMap = {
    table: {
      polls: {
        data: polls,
        columns: expanded => pollcolumns(expanded),
        component: props => <HomeTable expanded content="Top polls" component="polls" {...props} />,
      },
      executives: {
        data: data.executives,
        columns: expanded => executiveColumns(expanded),
        component: props => <HomeTable expanded content="Top executives" component="executives" {...props} />,
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

  const getModalProps = (type, component, expanded = false) => {
    const data = homeMap[type][component].data
    if (type === 'table')
      return {
        expanded,
        scrollable: expanded,
        data: expanded ? data : data.slice(0, TABLE_PREVIEW),
        columns: homeMap[type][component].columns(expanded),
      }
    return {
      modalStyles: expanded ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      height: 400,
      data,
    }
  }

  // VotersVsMkr graph data
  const VotersVsMkr = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    const currentVoter = governanceInfo
      ? Number(governanceInfo.countProxies) + Number(governanceInfo.countAddresses)
      : '-'
    const currentMkr = governanceInfo ? Number(governanceInfo.locked).toFixed(2) : '-'
    return (
      <ChartWrapper {...getWrapperProps(data)}>
        <Chart {...getModalProps(data.type, data.component, data.expanded)}>
          <YAxis yAxisId="0" datakey="count" />
          <YAxis yAxisId="1" datakey="mkr" orientation="right" />

          <Line
            dot={false}
            name={`Number of voters - Current ${currentVoter}`}
            stroke="#2730a0"
            strokeWidth={2}
            type="monotone"
            dataKey="count"
            yAxisId="0"
          />
          <Line
            dot={false}
            name={`Total MKR stacked - Current ${currentMkr}`}
            stroke="#27a02c"
            strokeWidth={2}
            type="monotone"
            dataKey="mkr"
            yAxisId="1"
          />
        </Chart>
      </ChartWrapper>
    )
  }

  // VotesVsPolls graph data
  const VotesVsPolls = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    const countVotes = governanceInfo ? Number(governanceInfo.countSpells) : '-'
    const countPolls = governanceInfo ? Number(governanceInfo.countPolls) : '-'
    return (
      <ChartWrapper {...getWrapperProps(data)}>
        <Chart {...getModalProps(data.type, data.component, data.expanded)}>
          <YAxis yAxisId="0" datakey="countVotes" />
          <YAxis yAxisId="1" datakey="countPolls" orientation="right" />

          <Line
            dot={false}
            name={`Executive Votes - Current ${countVotes}`}
            stroke="#9227a0"
            strokeWidth={2}
            type="monotone"
            dataKey="countVotes"
            yAxisId="0"
          />
          <Line
            dot={false}
            name={`Polls - Current ${countPolls}`}
            stroke="#a06d27"
            strokeWidth={2}
            type="monotone"
            dataKey="countPolls"
            yAxisId="1"
          />
        </Chart>
      </ChartWrapper>
    )
  }

  // Gini graph data
  const Gini = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    const currentGini = giniData[giniData.length - 1].gini
    return (
      <ChartWrapper {...getWrapperProps(data)}>
        <Chart {...getModalProps(data.type, data.component, data.expanded)}>
          <YAxis />
          <Line
            dot={false}
            name={`Gini Coefficient - Current ${currentGini}`}
            stroke="#ffc353"
            strokeWidth={2}
            type="monotone"
            dataKey="gini"
          />
        </Chart>
      </ChartWrapper>
    )
  }

  //Table Data
  const HomeTable = props => {
    const data = getComponentData('table', props.component, props.content, props.expanded)

    return (
      <TableWrapper {...getWrapperProps(data)}>
        <Table {...getModalProps(data.type, data.component, data.expanded)} />
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
        const { historicalPolls } = result[1]
        setPolls([...polls, ...historicalPolls])
      })
      .catch(error => {
        console.log(error)
      })
  }, [data])

  return (
    <>
      <Card style={{ height: 340 }}>
        <VotersVsMkr content="Number of voters" versus="Total MKR staked" component="votersVsMkr" />
      </Card>
      <WrappedContainer>
        <Card type="table" style={{ padding: 0 }}>
          <HomeTable content="Executive votes" component="executives" />
        </Card>
        <Card type="table" style={{ padding: 0 }}>
          <HomeTable content="Top polls" component="polls" />
        </Card>
        <Card style={{ height: 340 }}>
          <VotesVsPolls content="Executive Votes" versus="Polls" component="votesVsPolls" />
        </Card>
        <Card style={{ height: 340 }}></Card>
        <Card style={{ height: 340 }}>
          <Gini content="MKR Gini Coefficient" component="gini" />
        </Card>
        <Card style={{ height: 340 }}></Card>
      </WrappedContainer>
      {isModalOpen && (
        <Modal isChart={isModalChart} isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
          {getModalContainer(homeMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default HomeDetail
