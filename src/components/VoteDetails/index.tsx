import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import {
  Card,
  DescriptionBox,
  DescriptionWrapper,
  Modal,
  NoData,
  StrippedRowsContainer,
  CardTitle,
  // TitleContainer,
} from '../common'
import { getModalContainer } from '../../utils'
import { VotersVsMkrChart, ApprovalsByAddressChart } from './Charts'
import {
  TableRow,
  defaultFilters,
  getApprovalsByAddress,
  getComponentData,
  getTopSupporters,
  getTopSupportersTableData,
  getVoteTableData,
  getVotersVsMkrData,
} from './helpers'

// const TitleContainerStyled = styled(TitleContainer)`
//   padding: ${props => props.theme.cards.paddingVertical} ${props => props.theme.cards.paddingHorizontal} 0
//     ${props => props.theme.cards.paddingHorizontal};
// `

const VoteDetailContainer = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${props => props.theme.themeBreakPoints.xl}) {
    column-gap: ${props => props.theme.separation.gridSeparation};
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    row-gap: ${props => props.theme.separation.gridSeparation};
    grid-template-areas:
      'col1 col2 col2'
      'col4 col5 col6';
  }
`

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

  // Voters vs mkr data
  const VotersVsMkr = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <VotersVsMkrChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  // Approvals by address
  const ApprovalsByAddress = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <ApprovalsByAddressChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  // Description Data
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
    <>
      <VoteDetailContainer>
        <Card type="table" style={{ padding: 0, height: '340px', gridArea: 'col1' }}>
          {/* <TitleContainerStyled> */}
          <CardTitle content="Details" />
          {/* </TitleContainerStyled> */}
          <StrippedRowsContainer>
            {getVoteTableData(vote).map(el => (
              <TableRow key={el.label}>
                <span>{el.label}</span>
                <span>{el.value}</span>
              </TableRow>
            ))}
          </StrippedRowsContainer>
        </Card>
        <Card style={{ height: '340px', gridArea: 'col2' }}>
          {vote.about ? (
            <Description content="Description" component="description" />
          ) : (
            <NoData>Cannot fetch executive description.</NoData>
          )}
        </Card>
        <Card style={{ height: '340px', gridArea: 'col4' }}>
          <VotersVsMkr content="Number of voters" versus="Total MKR staked" component="votersVsMkr" />
        </Card>
        <Card style={{ height: '340px', gridArea: 'col5' }}>
          <ApprovalsByAddress content="Approvals by address" component="approvalsByAddress" />
        </Card>
        <Card type="table" style={{ padding: 0, height: '340px', gridArea: 'col6' }}>
          {/* <TitleContainerStyled> */}
          <CardTitle content="Top Supporters" />
          {/* </TitleContainerStyled> */}
          <StrippedRowsContainer>
            {getTopSupportersTableData(topSupporters, vote)
              .slice(0, 8)
              .map(el => (
                <TableRow key={el.sender}>
                  <span>{el.supports}%</span>
                  <span>{el.sender}</span>
                </TableRow>
              ))}
          </StrippedRowsContainer>
        </Card>
      </VoteDetailContainer>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} isChart={isModalChart} closeModal={() => setModalOpen(false)}>
          {getModalContainer(voteMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default VoteDetails
