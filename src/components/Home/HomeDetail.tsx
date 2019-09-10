import React, { useState } from 'react'
import { mockedData } from '../../utils' //This is only for testing
import { GetPolls_polls } from '../../types/generatedGQL'
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
} from '../common'
import { getIconContainer, getModalContainer, WrappedContainer, ViewAll } from './helpers'
import { Pollcolumns } from '../../utils'
import { Line } from 'recharts'

const TABLE_PREVIEW = 5

type Props = {
  polls: Array<GetPolls_polls>
  subscribeToChanges: () => void
}

function HomeDetail(props: Props) {
  const { polls } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [modalData, setModalData] = useState({ type: '', title: '', component: '' })

  const pollcolumns = React.useMemo(() => Pollcolumns(isModalOpen), [isModalOpen])

  // Data map for building this page
  const homeMap = {
    table: {
      polls: {
        data: polls,
        columns: pollcolumns,
        component: props => <Table {...props} />,
      },
    },
    chart: {
      chart1: {
        data: mockedData,
        component: props => <Graph1 {...props} />,
      },
    },
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
      <Line name="Number of voters - Current 1000" stroke="red" strokeWidth={2} type="monotone" dataKey="pv" />
      <Line name="Total MKR stacked - Current 2000" stroke="blue" strokeWidth={2} type="monotone" dataKey="uv" />
    </Chart>
  )
  const getGraph1 = () => {
    const data = {
      title: 'This is the chart title',
      type: 'chart',
      component: 'chart1',
    }
    return (
      <>
        <TitleContainer>
          <ChartTitle>{data.title}</ChartTitle>
          {getIconContainer(ExpandIcon, data, setModal, true)}
        </TitleContainer>
        <Graph1
          modalStyles={isModalOpen ? { width: '99%', aspect: 3 } : undefined}
          width={100}
          height={400}
          data={mockedData}
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
        <Table expanded={isModalOpen} columns={pollcolumns} data={polls.slice(0, TABLE_PREVIEW)} />
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
        <Card type="table" style={{ height: 340, padding: 0 }}>
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
            homeMap.table[modalData.component].component,
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
