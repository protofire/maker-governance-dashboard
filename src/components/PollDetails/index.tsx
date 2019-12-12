import React, { useState, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import randomColor from 'randomcolor'
import lscache from 'lscache'
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
  CenteredRowGrid,
  StrippedRowsContainer,
} from '../common'
import { getModalContainer } from '../../utils'
import { DEFAULT_CACHE_TTL } from '../../constants'
import { TimeLeftChart, PollPerOptionChart, VotersDistributionChart, MakerDistributionChart } from './Charts'
import {
  getPollTableData,
  defaultFilters,
  getComponentData,
  getTimeLeftData,
  getPollPerOptionData,
  getPollVotersHistogramData,
  getPollMakerHistogramData,
  getTopVoters,
  getTopVotersTableData,
} from './helpers'
import styled from 'styled-components'

const CardStyled = styled(Card)`
  height: ${props => props.theme.defaultCardHeight};
`

const PollDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

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
  poll: any
}

const Loading = () => (
  <SpinnerContainer>
    <Spinner width="35px" height="35px" />
  </SpinnerContainer>
)

function PollDetails(props: Props) {
  const { poll } = props
  const mkrDistributionCached = lscache.get(`mkrDistribution-${poll.id}`) || []
  const pollPerOptionCached = lscache.get(`pollPerOption-${poll.id}`) || []
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [pollPerOptionData, setPollPerOptionData] = useState<any>(pollPerOptionCached)
  const [mkrDistributionData, setMkrDistributionData] = useState<any>(mkrDistributionCached)
  const [topVoters, setTopVoters] = useState({})

  const timeLeftData = getTimeLeftData(poll.startDate, poll.endDate)

  const colors = useMemo(() => randomColor({ count: poll.options.length, seed: poll.id }), [poll.options, poll.id])

  useEffect(() => {
    getTopVoters(poll).then(data => setTopVoters(data))
  }, [poll])

  useEffect(() => {
    if (pollPerOptionCached.length === 0) getPollPerOptionData(poll).then(data => setPollPerOptionData(data))

    if (mkrDistributionCached.length === 0) getPollMakerHistogramData(poll).then(data => setMkrDistributionData(data))
  }, [poll, pollPerOptionCached.length, mkrDistributionCached.length])

  useEffect(() => {
    lscache.set(`mkrDistribution-${poll.id}`, mkrDistributionData, DEFAULT_CACHE_TTL)
    lscache.set(`pollPerOption-${poll.id}`, pollPerOptionData, DEFAULT_CACHE_TTL)
  }, [mkrDistributionData, pollPerOptionData, poll.id])

  const voteMap = {
    table: {
      description: {
        data: poll.content,
        component: props => <Description expanded content="Description" component="description" {...props} />,
      },
    },
    chart: {
      timeLeft: {
        data: timeLeftData,
        component: props => <TimeLeft content="Time left" component="timeLeft" {...props} />,
      },
      votersDistribution: {
        data: getPollVotersHistogramData(poll),
        component: props => (
          <VotersDistribution expanded content="Vote Count By Option" component="votersDistribution" {...props} />
        ),
      },
      makerDistribution: {
        data: mkrDistributionData,
        component: props => (
          <MakerDistribution expanded content="MKR Count By Option" component="makerDistribution" {...props} />
        ),
      },
      pollPerOptionVoters: {
        data: pollPerOptionData,
        component: props => (
          <PollPerOption isVoter expanded content="Voters Per Option" component="pollPerOptionVoters" {...props} />
        ),
      },
      pollPerOptionMkr: {
        data: pollPerOptionData,
        component: props => (
          <PollPerOption expanded content="MKR Voter Per Option" component="pollPerOptionMkr" {...props} />
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
    return <TimeLeftChart data={voteMap.chart[props.component].data} />
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
        colors={colors}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
        isVoter={props.isVoter}
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
      <PollDetailContainer>
        <CardStyled style={{ padding: 0, gridArea: 'col1' }}>
          <StrippedTableWrapper content="Details">
            {mkrDistributionData.length === 0 ? (
              <Loading />
            ) : (
              getPollTableData(poll, mkrDistributionData).map(el => (
                <StrippedTableRow key={el.label}>
                  <StrippedTableCell>{el.label}</StrippedTableCell>
                  <StrippedTableCell>{el.value}</StrippedTableCell>
                </StrippedTableRow>
              ))
            )}
          </StrippedTableWrapper>
        </CardStyled>
        <CardStyled style={{ gridArea: 'col2' }}>
          {poll.content ? (
            <Description content="Description" component="description" />
          ) : (
            <NoData>Cannot fetch poll description.</NoData>
          )}
        </CardStyled>
        <CardStyled style={{ gridArea: 'col4' }}>
          <VotersDistribution content="Vote Count By Option" component="votersDistribution" />
        </CardStyled>
        <CardStyled style={{ gridArea: 'col5' }}>
          {pollPerOptionData.length === 0 ? (
            <Loading />
          ) : (
            <PollPerOption content="Voters Per Option" isVoter component="pollPerOptionVoters" />
          )}
        </CardStyled>
        <CardStyled style={{ gridArea: 'col6' }}>
          {pollPerOptionData.length === 0 ? (
            <Loading />
          ) : (
            <PollPerOption content="MKR Voter Per Option" component="pollPerOptionMkr" />
          )}
        </CardStyled>
      </PollDetailContainer>
      <CenteredRowGrid>
        <CardStyled>
          {mkrDistributionData.length === 0 ? (
            <Loading />
          ) : (
            <MakerDistribution content="MKR Count By Option" component="makerDistribution" />
          )}
        </CardStyled>
        <CardStyled style={{ padding: 0 }}>
          <StrippedTableWrapper content="Top Voters">
            <StrippedRowsContainer>
              {Object.keys(topVoters).length === 0 ? (
                <Loading />
              ) : (
                getTopVotersTableData(topVoters)
                  .slice(0, 8)
                  .map(el => (
                    <StrippedTableRow key={el.sender}>
                      <StrippedTableCell>{el.supports}%</StrippedTableCell>
                      <StrippedTableCell>{el.sender}</StrippedTableCell>
                    </StrippedTableRow>
                  ))
              )}
            </StrippedRowsContainer>
          </StrippedTableWrapper>
        </CardStyled>
      </CenteredRowGrid>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} isChart={isModalChart} closeModal={() => setModalOpen(false)}>
          {getModalContainer(voteMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default PollDetails
