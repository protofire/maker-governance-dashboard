import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import randomColor from 'randomcolor'
import {
  Card,
  DescriptionBox,
  DescriptionWrapper,
  NoData,
  Modal,
  Spinner,
  SpinnerContainer,
  StrippedTableWrapper,
  StrippedTableRow,
  StrippedTableCell,
  ThreeRowGrid,
} from '../common'
import { getModalContainer } from '../../utils'
import { TimeLeftChart, PollPerOptionChart, VotersDistributionChart, MakerDistributionChart } from './Charts'
import {
  getPollTableData,
  defaultFilters,
  getComponentData,
  getTimeLeftData,
  getPollPerOptionData,
  getPollVotersHistogramData,
  getPollMakerHistogramData,
} from './helpers'

type Props = {
  poll: any
}

const Loading = () => (
  <SpinnerContainer>
    <Spinner width="35px" height="35px" />
  </SpinnerContainer>
)

function PollDetails(props: Props) {
  const { poll } = props
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [pollPerOptionData, setPollPerOptionData] = useState<any>([])
  const [mkrDistributionData, setMkrDistributionData] = useState<any>([])

  const colors = useMemo(() => randomColor({ count: poll.options.length, seed: poll.id }), [poll.options, poll.id])

  useEffect(() => {
    getPollPerOptionData(poll).then(data => setPollPerOptionData(data))
    getPollMakerHistogramData(poll).then(data => setMkrDistributionData(data))
  }, [poll])

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
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  //Poll voters distribution per option data
  const VotersDistribution = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <VotersDistributionChart
        colors={colors}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        options={poll.options}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  //Poll MKR distribution between options data
  const MakerDistribution = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <MakerDistributionChart
        colors={colors}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        options={poll.options}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  //Poll per option data
  const PollPerOption = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <PollPerOptionChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
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
    <>
      <ThreeRowGrid style={{ marginBottom: '20px' }}>
        <Card type="table" style={{ padding: 0, height: '340px' }}>
          <StrippedTableWrapper content="Details">
            {getPollTableData(poll).map(el => (
              <StrippedTableRow key={el.label}>
                <StrippedTableCell>{el.label}</StrippedTableCell>
                <StrippedTableCell>{el.value}</StrippedTableCell>
              </StrippedTableRow>
            ))}
          </StrippedTableWrapper>
        </Card>
        <Card style={{ height: '340px' }}>
          {poll.content ? (
            <Description content="Description" component="description" />
          ) : (
            <NoData>Cannot fetch poll description.</NoData>
          )}
        </Card>
        <Card style={{ height: '340px' }}>
          <TimeLeft content="Time left" component="timeLeft" />
        </Card>
      </ThreeRowGrid>
      <ThreeRowGrid>
        <Card style={{ height: '340px' }}>
          <VotersDistribution content="Voters distribution between options" component="votersDistribution" />
        </Card>
        <Card style={{ height: '340px' }}>
          {pollPerOptionData.length === 0 ? (
            <Loading />
          ) : (
            <PollPerOption content="Voters" versus="MKR Voter Per Option" component="pollPerOption" />
          )}
        </Card>
        <Card style={{ height: '340px' }}>
          {mkrDistributionData.length === 0 ? (
            <Loading />
          ) : (
            <MakerDistribution content="MKR distribution between options" component="makerDistribution" />
          )}
        </Card>
      </ThreeRowGrid>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} isChart={isModalChart} closeModal={() => setModalOpen(false)}>
          {getModalContainer(voteMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default PollDetails
