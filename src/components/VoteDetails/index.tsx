import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, Modal, TableTitle, DescriptionWrapper, DescriptionBox } from '../common'
import { getModalContainer } from '../../utils'

import {
  WrappedContainer,
  Container,
  TableContainer,
  TableRow,
  getVoteTableData,
  defaultFilters,
  getComponentData,
} from './helpers'

const VoteDetailContainer = styled.div``

type Props = {
  vote: any
}
function VoteDetails(props: Props) {
  const { vote } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const voteMap = {
    table: {
      description: {
        data: vote.about,
        component: props => <Description expanded content="Description" component="description" {...props} />,
      },
    },
    chart: {},
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

  /* for chart components
  const getModalProps = (type, component, expanded = false) => {
    const data = voteMap[type][component].data
    return {
      modalStyles: expanded ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      height: 400,
      data,
    }
  }
*/
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

  //Description Data
  const Description = props => {
    const data = getComponentData('table', props.component, props.content, props.expanded)

    return (
      <>
        <DescriptionWrapper {...getWrapperProps(data)}>
          <DescriptionBox expanded={props.expanded}>
            <span>{vote.about}</span>
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
            {getVoteTableData(vote).map(el => (
              <TableRow key={el.label}>
                <span>{el.label}</span>
                <span>{el.value}</span>
              </TableRow>
            ))}
          </TableContainer>
        </Card>
        <Card style={{ height: 300 }}>
          <Description content="Description" component="description" />
        </Card>
        <Card style={{ height: 300 }}></Card>
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

export default VoteDetails
