import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { Card, Modal, TableTitle, DescriptionWrapper, DescriptionBox } from '../common'
import { getModalContainer } from '../../utils'
import { VotersVsMkrChart, ApprovalsByAddressChart } from './Charts'

import {
  WrappedContainer,
  Container,
  TableContainer,
  TableRow,
  getVoteTableData,
  defaultFilters,
  getComponentData,
  getVotersVsMkrData,
  getTopSupporters,
  getTopSupportersTableData,
  getApprovalsByAddress,
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
  vote: any
  votingActions: Array<any>
}
function VoteDetails(props: Props) {
  const { vote, votingActions } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const topSupporters = getTopSupporters(votingActions)
  const voteMap = {
    table: {
      description: {
        data: vote.about,
        component: props => <Description expanded content="Description" component="description" {...props} />,
      },
    },
    chart: {
      votersVsMkr: {
        data: getVotersVsMkrData(votingActions, vote),
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
      approvalsByAddress: {
        data: getApprovalsByAddress(votingActions),
        component: props => (
          <ApprovalsByAddress expanded content="Approvals by address" component="approvalsByAddress" {...props} />
        ),
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
  //Voters vs mkr data
  const VotersVsMkr = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    const currentVoters = vote.totalVotes ? vote.totalVotes : '-'
    const currentMkr = vote.approvals ? Number(vote.approvals).toFixed(2) : '-'
    return (
      <VotersVsMkrChart
        currentVoters={currentVoters}
        currentMkr={currentMkr}
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  //Approvals by address
  const ApprovalsByAddress = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    const currentVoters = Object.keys(topSupporters).length
    return (
      <ApprovalsByAddressChart
        currentVoters={currentVoters}
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
            {getVoteTableData(vote).map(el => (
              <TableRow key={el.label}>
                <span>{el.label}</span>
                <span>{el.value}</span>
              </TableRow>
            ))}
          </TableContainer>
        </Card>
        <Card style={{ height: 300 }}>
          {vote.about ? (
            <Description content="Description" component="description" />
          ) : (
            <NoData>No data to display.</NoData>
          )}
        </Card>
        <Card style={{ height: 300 }}>
          <VotersVsMkr content="Number of voters" versus="Total MKR staked" component="votersVsMkr" />
        </Card>
        <Card style={{ height: 300 }}>
          <ApprovalsByAddress content="Approvals by address" component="approvalsByAddress" />
        </Card>
        <Card type="table" style={{ padding: 0 }}>
          <Container>
            <TableTitle>Top Supporters</TableTitle>
          </Container>
          <TableContainer>
            {getTopSupportersTableData(topSupporters, vote)
              .slice(0, 8)
              .map(el => (
                <TableRow key={el.sender}>
                  <span>{el.supports}%</span>
                  <span>{el.sender}</span>
                </TableRow>
              ))}
          </TableContainer>
        </Card>
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
