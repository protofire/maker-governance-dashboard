import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import randomColor from 'randomcolor'
import lscache from 'lscache'
import styled from 'styled-components'
import { Card, Modal, TableTitle, DescriptionWrapper, DescriptionBox, Spinner, SpinnerContainer } from '../common'
import { getModalContainer } from '../../utils'
import { DEFAULT_CACHE_TTL } from '../../constants'

import { TimeLeftChart, PollPerOptionChart, VotersDistributionChart, MakerDistributionChart } from './Charts'

import {
  WrappedContainer,
  Container,
  TableContainer,
  TableRow,
  getPollTableData,
  defaultFilters,
  getComponentData,
  getTimeLeftData,
  getPollPerOptionData,
  getPollVotersHistogramData,
  getPollMakerHistogramData,
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

const Loading = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
)

function PollDetails(props: Props) {
  const { poll } = props
  const mkrDistributionCached = lscache.get('mkrDistribution') || []
  const pollPerOptionCached = lscache.get('pollPerOption') || []
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [pollPerOptionData, setPollPerOptionData] = useState<any>(pollPerOptionCached)
  const [mkrDistributionData, setMkrDistributionData] = useState<any>(mkrDistributionCached)

  const colors = useMemo(() => randomColor({ count: poll.options.length, seed: poll.id }), [poll.options, poll.id])
  useEffect(() => {
    if (pollPerOptionCached.length === 0) getPollPerOptionData(poll).then(data => setPollPerOptionData(data))

    if (mkrDistributionCached.length === 0) getPollMakerHistogramData(poll).then(data => setMkrDistributionData(data))
  }, [poll, pollPerOptionCached.length, mkrDistributionCached.length])

  useEffect(() => {
    lscache.set('mkrDistribution', mkrDistributionData, DEFAULT_CACHE_TTL)
    lscache.set('pollPerOption', pollPerOptionData, DEFAULT_CACHE_TTL)
  }, [mkrDistributionData, pollPerOptionData])

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
      votersDistribution: {
        data: getPollVotersHistogramData(poll),
        component: props => (
          <VotersDistribution
            expanded
            content="Voters distribution between options"
            component="votersDistribution"
            {...props}
          />
        ),
      },
      makerDistribution: {
        data: mkrDistributionData,
        component: props => (
          <MakerDistribution
            expanded
            content="MKR distribution between options"
            component="makerDistribution"
            {...props}
          />
        ),
      },
      pollPerOption: {
        data: pollPerOptionData,
        component: props => (
          <PollPerOption expanded content="Voters" versus="MKR Voter Per Option" component="pollPerOption" {...props} />
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

  //Poll voters distribution per option data
  const VotersDistribution = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <VotersDistributionChart
        options={poll.options}
        colors={colors}
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  //Poll MKR distribution between options data
  const MakerDistribution = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <MakerDistributionChart
        options={poll.options}
        colors={colors}
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  //Poll per option data
  const PollPerOption = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <PollPerOptionChart
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
            <NoData>Cannot fetch poll description.</NoData>
          )}
        </Card>
        <Card style={{ height: 300 }}>
          <TimeLeft content="Time left" component="timeLeft" />
        </Card>
        <Card style={{ height: 300 }}>
          <VotersDistribution content="Voters distribution between options" component="votersDistribution" />
        </Card>
        <Card style={{ height: 300 }}>
          {pollPerOptionData.length === 0 ? (
            <Loading />
          ) : (
            <PollPerOption content="Voters" versus="MKR Voter Per Option" component="pollPerOption" />
          )}
        </Card>
        <Card style={{ height: 300 }}>
          {mkrDistributionData.length === 0 ? (
            <Loading />
          ) : (
            <MakerDistribution content="MKR distribution between options" component="makerDistribution" />
          )}
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

export default PollDetails
