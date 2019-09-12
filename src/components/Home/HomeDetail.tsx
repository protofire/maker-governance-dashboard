import React, { useState } from 'react'
import { ChartWrapper } from '../../components/common'
import { getHomeData } from '../../types/generatedGQL'
import { Card, Table, Chart, Modal, TableWrapper } from '../common'
import { getModalContainer, WrappedContainer, getGraphData1, defaultFilters } from './helpers'
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
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const pollcolumns = React.useMemo(() => Pollcolumns(isModalOpen), [isModalOpen])

  // Data map for building this page
  const homeMap = {
    table: {
      polls: {
        data: data.polls,
        columns: pollcolumns,
        component: props => <PollsTable {...props} />,
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
    setChartFilters(obj)
  }

  const getWrapperProps = data => {
    const { content, versus = null, component } = data
    const isChart = data.type === 'table' ? false : true
    const handleModal = !isModalOpen ? () => setModal(data, isChart) : () => setModalOpen(false)
    return {
      content,
      versus,
      value: chartFilters[data.component],
      handleModal,
      onChange: e => setFilter(e, component),
      isModalOpen,
    }
  }

  const getModalProps = (type, component) => {
    const data = homeMap[type][component].data
    if (type === 'table')
      return {
        expanded: isModalOpen,
        scrollable: isModalOpen,
        data: isModalOpen ? data : data.slice(0, TABLE_PREVIEW),
        columns: homeMap[type][component].columns,
      }
    return {
      modalStyles: isModalOpen ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      height: 400,
      data,
    }
  }

  // Graph1 graph data
  const Graph1 = () => {
    const data = {
      type: 'chart',
      component: 'chart1',
      content: 'Number of voters',
      versus: 'Total MKR staked',
    }

    return (
      <ChartWrapper {...getWrapperProps(data)}>
        <Chart {...getModalProps(data.type, data.component)}>
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
      </ChartWrapper>
    )
  }

  // Polls Table Data
  const PollsTable = () => {
    const data = {
      content: 'Top polls',
      type: 'table',
      component: 'polls',
    }
    return (
      <TableWrapper {...getWrapperProps(data)}>
        <Table {...getModalProps(data.type, data.component)} />
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
        <Graph1 />
      </Card>
      <WrappedContainer>
        <Card style={{ height: 340 }}>
          <Graph1 />
        </Card>
        <Card type="table" style={{ padding: 0 }}>
          <PollsTable />
        </Card>
        <Card style={{ height: 340 }}>
          <Graph1 />
        </Card>
        <Card style={{ height: 340 }}>
          <Graph1 />
        </Card>
        <Card style={{ height: 340 }}>
          <Graph1 />
        </Card>
        <Card style={{ height: 340 }}>
          <Graph1 />
        </Card>
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
