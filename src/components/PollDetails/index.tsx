import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { Card, Modal, TableTitle, DescriptionWrapper, DescriptionBox } from '../common'
import { getModalContainer } from '../../utils'

import { TimeLeftChart } from './Charts'

import {
  WrappedContainer,
  Container,
  TableContainer,
  TableRow,
  getPollTableData,
  defaultFilters,
  getComponentData,
  getTimeLeftData,
} from './helpers'

const NoData = styled.span`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`

const VoteDetailContainer = styled.div``

type Props = {
  poll: any
}
function PollDetails(props: Props) {
  const { poll } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const voteMap = {
    table: {
      description: {
        data: poll.content,
        component: props => <Description expanded content="Description" component="description" {...props} />,
      },
    },
    chart: {
      timeLeft: {
        data: getTimeLeftData(poll.startDate, poll.endDate),
        component: props => <TimeLeft content="Time left" component="timeLeft" {...props} />,
      },
    },
  }

  const setModal = (data: any, isChart: boolean = false): void => {
    setModalOpen(true)
    setModalChart(isChart)
    setModalData(data)
  }

  const setFilter = (e, component) => {
    const obj = {
      ...chartFilters,
      [component]: e.target.value,
    }
    setChartFilters(obj)
  }

  const getModalProps = (type, component, expanded = false) => {
    const data = voteMap[type][component].data
    return {
      modalStyles: expanded ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      height: 400,
      data,
    }
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

  //TimeLeft data
  const TimeLeft = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <TimeLeftChart
        data={voteMap.chart[props.component].data}
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  //Description Data
  const Description = props => {
    const data = getComponentData('table', props.component, props.content, props.expanded)

    return (
      <>
        <DescriptionWrapper {...getWrapperProps(data)}>
          <DescriptionBox expanded={props.expanded}>
            <ReactMarkdown source={voteMap.table[props.component].data} />
          </DescriptionBox>
        </DescriptionWrapper>
      </>
    )
  }

  return (
    <VoteDetailContainer>
      <WrappedContainer>
        <Card type="table" style={{ padding: 0 }}>
          <Container>
            <TableTitle>Details</TableTitle>
          </Container>
          <TableContainer>
            {getPollTableData(poll).map(el => (
              <TableRow key={el.label}>
                <span>{el.label}</span>
                <span>{el.value}</span>
              </TableRow>
            ))}
          </TableContainer>
        </Card>
        <Card style={{ height: 300 }}>
          {poll.content ? (
            <Description content="Description" component="description" />
          ) : (
            <NoData>No data to display.</NoData>
          )}
        </Card>
        <Card style={{ height: 300 }}>
          <TimeLeft content="Time left" component="timeLeft" />
        </Card>
        <Card style={{ height: 300 }}></Card>
        <Card style={{ height: 300 }}></Card>
        <Card style={{ height: 300 }}></Card>
      </WrappedContainer>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} isChart={isModalChart} closeModal={() => setModalOpen(false)}>
          {getModalContainer(voteMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </VoteDetailContainer>
  )
}

export default PollDetails
