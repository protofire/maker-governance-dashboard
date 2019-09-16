import React, { useState } from 'react'
import { ChartWrapper } from '../../components/common'
import { getHomeData, GetGovernanceInfo } from '../../types/generatedGQL'
import { Card, Table, Chart, Modal, TableWrapper } from '../common'
import {
  getModalContainer,
  WrappedContainer,
  getVotersVsMkrData,
  defaultFilters,
  Pollcolumns,
  Executivecolumns,
} from './helpers'
import { Line, YAxis } from 'recharts'

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
  const pollcolumns = expanded => Pollcolumns(expanded)
  const executiveColumns = expanded => Executivecolumns(expanded)

  // Data map for building this page
  const homeMap = {
    table: {
      polls: {
        data: data.polls,
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
    const data = {
      type: 'chart',
      component: props.component,
      content: props.content,
      versus: props.versus,
      expanded: props.expanded,
    }

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

  //Table Data
  const HomeTable = props => {
    const data = {
      content: props.content,
      type: 'table',
      component: props.component,
      expanded: props.expanded,
    }
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
        <Card style={{ height: 340 }}></Card>
        <Card style={{ height: 340 }}></Card>
        <Card style={{ height: 340 }}></Card>
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
