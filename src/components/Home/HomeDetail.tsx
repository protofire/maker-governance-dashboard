import React, { useState } from 'react'
import { mockedData } from '../../utils' //This is only for testing
import { getHomeData } from '../../types/generatedGQL'
import {
  Card,
  ChartTitle,
  TableContainer,
  Table,
  TableTitle,
  TitleContainer,
  Chart,
  Modal,
  ExpandIcon,
  ChartSelect,
} from '../common'
import {
  getIconContainer,
  getModalContainer,
  WrappedContainer,
  ViewAll,
  getGraphData1,
  defaultFilters,
  filters,
} from './helpers'
import { Pollcolumns } from '../../utils'
import { Line, YAxis } from 'recharts'

const TABLE_PREVIEW = 5

type Props = {
  data: getHomeData
  subscribeToChanges?: () => void
}

function HomeDetail(props: Props) {
  const { data } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setCharFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', title: '', component: '' })
  const pollcolumns = React.useMemo(() => Pollcolumns(isModalOpen), [isModalOpen])

  // Data map for building this page
  const homeMap = {
    table: {
      polls: {
        data: data.polls,
        columns: pollcolumns,
        component: props => <Table {...props} />,
      },
    },
    chart: {
      chart1: {
        data: getGraphData1(data.voters, chartFilters.chart1),
        component: props => <Graph1 {...props} />,
      },
    },
  }

  const setFilter = (e, component) => {
    const obj = {
      ...chartFilters,
      [component]: e.target.value,
    }
    setCharFilters(obj)
  }

  const getModalProps = (type, component) => {
    const obj = {}
    if (type === 'table')
      return {
        ...obj,
        expanded: isModalOpen,
        scrollable: true,
        data: homeMap[type][component].data,
        columns: homeMap[type][component].columns,
      }
    return {
      modalStyles: isModalOpen ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      height: 400,
      data: homeMap[type][component].data,
    }
  }

  // Graph1 graph data
  const Graph1 = props => (
    <Chart {...props}>
      <YAxis dataKey="count" />
      <YAxis dataKey="count" orientation="right" />
      <Line
        dot={false}
        name="Number of voters - Current 1000"
        stroke="#2730a0"
        strokeWidth={2}
        type="monotone"
        dataKey="count"
      />
    </Chart>
  )
  const getGraph1 = () => {
    const data = {
      title: 'Number of voters vs Total MKR staked',
      type: 'chart',
      component: 'chart1',
    }
    return (
      <>
        <TitleContainer>
          <ChartTitle content="Number Of Voters" versus="Total MKR Staked">
            <ChartSelect
              value={chartFilters[data.component]}
              values={filters}
              onChange={e => setFilter(e, data.component)}
            />
          </ChartTitle>
          {getIconContainer(ExpandIcon, data, setModal, true)}
        </TitleContainer>
        <Graph1
          modalStyles={isModalOpen ? { width: '99%', aspect: 3 } : undefined}
          width={100}
          height={400}
          data={homeMap[data.type][data.component].data}
        />
      </>
    )
  }

  // Polls Table Data
  const getPollsTable = () => {
    const data = {
      title: 'Top polls',
      type: 'table',
      component: 'polls',
    }
    return (
      <TableContainer>
        <TitleContainer>
          <TableTitle>{data.title}</TableTitle>
          {getIconContainer(
            () => (
              <ViewAll>View All</ViewAll>
            ),
            data,
            setModal,
          )}
        </TitleContainer>
        <Table expanded={isModalOpen} columns={pollcolumns} data={props.data.polls.slice(0, TABLE_PREVIEW)} />
      </TableContainer>
    )
  }

  const setModal = (data: any, isChart: boolean = false): void => {
    setModalOpen(true)
    setModalChart(isChart)
    setModalData(data)
  }

  return (
    <>
      <Card style={{ height: 300 }}>{getGraph1()}</Card>
      <WrappedContainer>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card type="table" style={{ padding: 0 }}>
          {getPollsTable()}
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
        <Card style={{ height: 300 }}>
          <ChartTitle>This is the chart title</ChartTitle>
          <Chart width={100} height={400} data={mockedData}>
            <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
            <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
          </Chart>
        </Card>
      </WrappedContainer>
      {isModalOpen && (
        <Modal isChart={isModalChart} isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
          {getModalContainer(
            modalData.type,
            homeMap[modalData.type][modalData.component].component,
            modalData.title,
            getModalProps(modalData.type, modalData.component),
            setModalOpen,
          )}
        </Modal>
      )}
    </>
  )
}

export default HomeDetail
