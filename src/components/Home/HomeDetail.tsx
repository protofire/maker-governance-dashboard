import React, { useState, useEffect, useMemo } from 'react'
import lscache from 'lscache'
import { withRouter } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { fromUnixTime, differenceInMonths } from 'date-fns'
import { GetGovernanceInfo } from '../../types/generatedGQL'
import {
  StakedMkrChart,
  VotesVsPollsChart,
  VotersVsMkrChart,
  GiniChart,
  TimeTakenChart,
  MkrDistributionPerExecutiveChart,
  //MKRActivenessChart,
  ExecutivesResponsivenessChart,
  PollsResponsivenessChart,
} from './Charts'
import { DEFAULT_CACHE_TTL } from '../../constants'
import {
  Card,
  Modal,
  Spinner,
  SpinnerContainer,
  StrippedTableWrapper,
  Table,
  TwoRowGrid,
  PageTitle,
  PageSubTitle,
} from '../common'
import { getPollsData, getMKRSupply } from '../../utils/makerdao'
import { getModalContainer, getPollData, getPollsBalances } from '../../utils'
import {
  getStakedMkrData,
  getVotersVsMkrData,
  getVotesVsPollsData,
  getGiniData,
  defaultFilters,
  getComponentData,
  Pollcolumns,
  VotedPollcolumns,
  Executivecolumns,
  TopVotersColumns,
  //ActivenessBreakdownColumns,
  UncastedExecutivecolumns,
  getTimeTakenForExecutives,
  getMkrDistributionPerExecutive,
  getTopVoters,
  //getMKRActiveness,
  getPollsMKRResponsiveness,
  //getActivenessBreakdown,
  getMostVotedPolls,
  getRecentPolls,
} from './helpers'
import styled from 'styled-components'
import LinkableComponent from '../common/LinkableComponent'

const CardStyled = styled(Card)`
  height: ${props => props.theme.defaultCardHeight};
  min-height: fit-content;
`
const TableCardStyled = styled(Card)`
  min-height: ${props => props.theme.defaultCardHeight};
  height: auto;
  scroll-y: auto;
`

const Loading = () => (
  <SpinnerContainer>
    <Spinner width="35px" height="35px" />
  </SpinnerContainer>
)

const getParticipation = (data, mkrSupply) => {
  const totalMkr: BigNumber = data.reduce((acc, value) => acc.plus(new BigNumber(value.mkr)), new BigNumber('0'))
  return totalMkr
    .times(100)
    .div(mkrSupply)
    .toString()
}

const TABLE_PREVIEW = 5

type Props = {
  data: any
  gData: GetGovernanceInfo
  history?: any
  executivesResponsiveness?: any
  subscribeToChanges?: () => void
}

function HomeDetail(props: Props) {
  const { data, gData, history, executivesResponsiveness } = props
  const { governanceInfo } = gData
  const [isModalOpen, setModalOpen] = useState(false)
  const cachedDataPoll = lscache.get('home-polls') || []
  const cachedMkrSupply = lscache.get('mkr-supply') || undefined

  const cachedDataTopVoters = lscache.get('home-topVoters') || []
  const cachedDataPollsResponsiveness = lscache.get('polls-responsiveness') || []

  const [isModalChart, setModalChart] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [mkrSupply, setMkrSupply] = useState<BigNumber | undefined>(cachedMkrSupply)
  const [pollsBalances, setBalances] = useState<any>({})

  const [modalData, setModalData] = useState({ type: '', component: '' })
  const [topVoters, setTopVoters] = useState<any[]>(cachedDataTopVoters)
  const [pollsResponsiveness, setPollsResponsiveness] = useState<any[]>(cachedDataPollsResponsiveness)
  //const [activenessBreakdown, setActivenessBreakdown] = useState<any>([])
  // const [mkrActiveness, setMkrActiveness] = useState<any>([])
  const [mostVotedPolls, setMostVotedPolls] = useState<any>([])
  const [stakedMkr, setStakedMkr] = useState<any>([])
  const [recentPolls, setRecentPolls] = useState<any>([])

  const [polls, setPolls] = useState<any[]>(cachedDataPoll.length === 0 ? data.polls : cachedDataPoll)

  const pollcolumns = expanded => Pollcolumns(expanded)
  const votedPollcolumns = () => VotedPollcolumns()

  useEffect(() => {
    if (cachedDataPoll.length === 0) getPollsBalances(polls).then(balances => setBalances(balances))
    if (cachedDataPollsResponsiveness.length === 0)
      getPollsMKRResponsiveness(polls).then(responsiveness => setPollsResponsiveness(responsiveness))
  }, [polls, cachedDataPoll.length, cachedDataPollsResponsiveness.length])

  useEffect(() => {
    if (!mkrSupply) {
      getMKRSupply().then(supply => setMkrSupply(supply))
    }
  }, [mkrSupply])

  const executiveColumns = expanded => Executivecolumns(expanded)
  const topVotersColumns = () => TopVotersColumns()
  const uncastedExecutiveColumns = () => UncastedExecutivecolumns()
  //const activenessBreakdownColumns = () => ActivenessBreakdownColumns()

  const executives = data.executives

  useEffect(() => {
    setStakedMkr(getStakedMkrData(data, chartFilters.stakedMkr))
  }, [data, chartFilters.stakedMkr])

  useEffect(() => {
    if (cachedDataTopVoters.length === 0) {
      setTopVoters(getTopVoters(executives, polls))
    }
  }, [executives, polls, cachedDataTopVoters.length])

  useEffect(() => {
    setMostVotedPolls(getMostVotedPolls(polls))
    setRecentPolls(getRecentPolls(polls))
  }, [polls])
  useEffect(() => {
    //setActivenessBreakdown(getActivenessBreakdown(executives))
    //setMkrActiveness(getMKRActiveness(executives))
  }, [executives])

  const getPoll = row => {
    if (row.id) history.push(`/poll/${row.id}`)
  }

  const getVote = row => {
    if (row.id) history.push(`/executive/${row.id}`)
  }

  // Data map for building this page
  const giniData = getGiniData([...data.free, ...data.lock], chartFilters.gini)
  const homeMap = {
    table: {
      polls: {
        data: recentPolls,
        columns: expanded => pollcolumns(expanded),
        info: `This tile shows a short list of the most recent polls and the amount of time left with which to vote. It serves as a navigation aid for users to explore further. <br><br> This list is generated using the PollCreated event emitted by the PollingEmitter contract. Each poll that is created is sorted by creation date and the top five most recently created polls are displayed.`,
        links: [
          {
            title: 'MakerDAO Governance Graph',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
          },
        ],
        sortBy: useMemo(() => [{ id: 'startDate', desc: true }], []),
        component: props => (
          <HomeTable handleRow={getPoll} expanded content="Recent Polls" component="polls" {...props} />
        ),
      },
      votedPolls: {
        data: mostVotedPolls,
        columns: votedPollcolumns,
        info: `This tile shows the polls that have gathered the most MKR participation in the history of Maker Governance. As well as showing as a historical record, it also gives governance an idea of how much participation to expect, and a target level of participation to beat. <br><br> This list is generated by calculating the amount of MKR voting for each poll at the time it closed using Voted events emitted by the PollingEmitter contract. Each value is then divided by the total MKR supply and this value is formatted as a percentage. This list is then sorted by participation percentage and displayed.`,
        links: [
          {
            title: 'MakerDAO Governance Graph',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
          },
        ],
        sortBy: React.useMemo(() => [{ id: 'participation', desc: true }], []),
        component: props => (
          <HomeTable
            handleRow={getPoll}
            sortBy={{ id: 'participation', desc: true }}
            expanded
            content="Most Voted Polls"
            component="votedPolls"
            {...props}
          />
        ),
      },
      executives: {
        data: data.executives.sort((a, b) => Number(b.approvals) - Number(a.approvals)),
        columns: expanded => executiveColumns(expanded),
        info: `This tile shows the executive proposals that have the most MKR staked. This allows governance to see how MKR is currently distributed within the DSChief contract. This gives some idea of the value of the current hat, the security of the system, and where ‘idle’ MKR is sitting in the system.<br><br> This metric is calculated by using the Lock, Free and the Etch (vote) events emitted by the DSChief contract to sum the amount of MKR currently voting for each executive proposal. Each executive proposal is then sorted by the amount of MKR staked and displayed.`,
        links: [
          {
            title: 'MakerDAO Governance Graph',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
          },
        ],
        sortBy: useMemo(() => [{ id: 'approvals', desc: true }], []),
        component: props => (
          <HomeTable expanded handleRow={getVote} content="Top Executives" component="executives" {...props} />
        ),
      },
      topVoters: {
        data: topVoters.sort((a, b) => Number(b.count) - Number(a.count)),
        info: `This tile shows a list of the addresses that have voted the most in the MKR governance ecosystem. It is hoped that having a ‘leaderboard’ will incentivise voters to become more active and consistent within the voting ecosystem. <br><br> To calculate this metric we use the Vote event emitted by the DSChief contract and the Voted event emitted by the PollingEmitter contract to get all vote events. We then tally the number of polls and executives voted on by each address. This count is then sorted and the top five addresses are displayed.`,
        links: [
          {
            title: 'MakerDAO Governance Graph - Executives',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
          },
          {
            title: 'MakerDAO Governance Graph - Polls',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
          },
        ],
        columns: topVotersColumns,
        component: props => <HomeTable expanded content="Top Voters" component="topVoters" {...props} />,
      },
      uncastedExecutives: {
        data: data.executives
          .filter(vote => !vote.casted && differenceInMonths(new Date(), fromUnixTime(vote.timestamp)) < 12)
          .sort((a, b) => Number(b.approvals) - Number(a.approvals)),
        columns: uncastedExecutiveColumns,
        info: `This tile shows a list of the executive proposals that have never been ‘cast’ (passed and become active in the system.) This allows governance to become aware of any malicious MKR being moved to old uncast executive proposals. <br><br> This list is generated by checking all executive proposals and checking their ‘casted’ property to determine whether they have ever been cast. Those that haven’t are sorted by the amount of MKR staked on each proposal and displayed. <br><br> <strong>Note that this metric only displays uncast executives created in the last twelve months.</strong>        `,
        links: [
          {
            title: 'MakerDAO Governance Graph',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
          },
        ],
        component: props => (
          <HomeTable
            expanded
            handleRow={getVote}
            content="Uncast Executives"
            component="uncastedExecutives"
            {...props}
          />
        ),
      },
      /*
      activenessBreakdown: {
        data: activenessBreakdown,
        columns: activenessBreakdownColumns,
        info:
          'The MKR Activeness gives a good picture of the health of governance, the more tokens that are frequently active, the safer the system is. ',
        links: [
          {
            title: 'Maker Governance Graph',
            uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
          },
        ],
        component: props => (
          <HomeTable expanded content="MKR Activeness Breakdown" component="activenessBreakdown" {...props} />
        ),
      },
      */
    },
    chart: {
      stakedMkr: {
        data: stakedMkr,
        component: props => <StakedMkr expanded content="Staked MKR" component="stakedMkr" {...props} />,
      },
      votersVsMkr: {
        data: getVotersVsMkrData(data.voters, [...data.free, ...data.lock], chartFilters.votersVsMkr),
        component: props => (
          <VotersVsMkr
            expanded
            content="Number of Voters"
            versus="Total MKR Staked"
            component="votersVsMkr"
            {...props}
          />
        ),
      },
      pollsResponsiveness: {
        data: pollsResponsiveness,
        component: props => (
          <PollsResponsiveness
            expanded
            content="Polls - MKR Responsiveness"
            component="pollsResponsiveness"
            {...props}
          />
        ),
      },
      executivesResponsiveness: {
        data: executivesResponsiveness,
        component: props => (
          <ExecutivesResponsiveness
            expanded
            content="Votes - MKR Responsiveness"
            component="executivesResponsiveness"
            {...props}
          />
        ),
      },
      mkrDistributionPerExecutive: {
        data: getMkrDistributionPerExecutive(executives, governanceInfo ? governanceInfo.hat : null),
        component: props => (
          <MkrDistributionPerExecutive
            expanded
            content="MKR Distribution By Executive"
            component="mkrDistributionPerExecutive"
            {...props}
          />
        ),
      },
      /*
      mkrActiveness: {
        data: mkrActiveness,
        component: props => <MKRActiveness expanded content="MKR Activeness" component="mkrActiveness" {...props} />,
      },
      */
      votesVsPolls: {
        data: getVotesVsPollsData(data.executives, polls, chartFilters.votesVsPolls),
        component: props => <VotesVsPolls expanded content="Total Votes" component="votesVsPolls" {...props} />,
      },
      gini: {
        data: giniData,
        component: props => <Gini expanded content="Voting MKR Gini Coefficient" component="gini" {...props} />,
      },
      timeTakenForExecutives: {
        data: getTimeTakenForExecutives(data.executives),
        component: props => (
          <TimeTakenForExecutives
            expanded
            content="Executive Time to Pass"
            component="timeTakenForExecutives"
            {...props}
          />
        ),
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

  const getModalProps = (type, component, expanded = false, handleRow = undefined) => {
    const data = homeMap[type][component].data
    if (type === 'table')
      return {
        expanded,
        handleRow,
        scrollable: expanded,
        data: expanded ? data : data.slice(0, TABLE_PREVIEW),
        columns: homeMap[type][component].columns(expanded),
        sortBy: expanded ? homeMap[type][component].sortBy : [],
      }
    return {
      modalStyles: expanded ? { width: '99%', aspect: 3 } : undefined,
      width: 100,
      minHeight: '400px',
      data,
    }
  }

  // StakedMkrPercentage graph data
  const StakedMkr = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <StakedMkrChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // VotersVsMkr graph data
  const VotersVsMkr = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <VotersVsMkrChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // VotesVsPolls graph data
  const VotesVsPolls = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <VotesVsPollsChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  /*
  // MKR activeness graph data
  const MKRActiveness = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <MKRActivenessChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }
  */

  // MkrDistributionPerExecutive graph data
  const MkrDistributionPerExecutive = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <MkrDistributionPerExecutiveChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // Gini graph data
  const Gini = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)
    return (
      <GiniChart
        wrapperProps={getWrapperProps(data)}
        modalProps={getModalProps(data.type, data.component, data.expanded)}
      />
    )
  }

  // Time taken graph data
  const TimeTakenForExecutives = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <TimeTakenChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  // Votes Responsiveness graph data
  const ExecutivesResponsiveness = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <ExecutivesResponsivenessChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  // Polls Responsiveness graph data
  const PollsResponsiveness = props => {
    const data = getComponentData('chart', props.component, props.content, props.expanded, props.versus)

    return (
      <PollsResponsivenessChart
        modalProps={getModalProps(data.type, data.component, data.expanded)}
        wrapperProps={getWrapperProps(data)}
      />
    )
  }

  // Table Data
  const HomeTable = props => {
    const data = getComponentData('table', props.component, props.content, props.expanded)

    return (
      <StrippedTableWrapper markdown info={props.info} links={props.links} {...getWrapperProps(data)}>
        <Table sortBy={props.sortBy} {...getModalProps(data.type, data.component, data.expanded, props.handleRow)} />
      </StrippedTableWrapper>
    )
  }

  const setModal = (data: any, isChart: boolean = false): void => {
    setModalOpen(true)
    setModalChart(isChart)
    setModalData(data)
  }

  useEffect(() => {
    if (mkrSupply) {
      getPollsData(data.polls).then(result => {
        const polls = result.filter(Boolean)
        setPolls([...polls])
        Promise.all(
          polls.map(poll => {
            return getPollData(poll, pollsBalances).then(data => {
              return { ...poll, participation: getParticipation(data, mkrSupply) }
            })
          }),
        ).then(pollsWithPluralityAndParticipation => {
          setPolls(pollsWithPluralityAndParticipation)
        })
      })
    }
  }, [data.polls, mkrSupply, pollsBalances])

  useEffect(() => {
    lscache.set('mkr-supply', mkrSupply, DEFAULT_CACHE_TTL)
    lscache.set('home-polls', polls, DEFAULT_CACHE_TTL)
    lscache.set('home-topVoters', topVoters, DEFAULT_CACHE_TTL)
    lscache.set('polls-responsiveness', pollsResponsiveness, DEFAULT_CACHE_TTL)
  }, [mkrSupply, polls, topVoters, pollsResponsiveness])

  return (
    <>
      <PageTitle>System Statistics</PageTitle>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <LinkableComponent id="STAKED_MKR">
          <CardStyled>
            {stakedMkr.length === 0 ? <Loading /> : <StakedMkr content="Staked MKR" component="stakedMkr" />}
          </CardStyled>
        </LinkableComponent>
        <LinkableComponent id="NUMBER_OF_VOTERS">
          <CardStyled>
            <VotersVsMkr content="Number of Voters" versus="Total MKR Staked" component="votersVsMkr" />
          </CardStyled>
        </LinkableComponent>
      </TwoRowGrid>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <LinkableComponent id="TOTAL_VOTES">
          <CardStyled>
            {polls.length === 0 ? <Loading /> : <VotesVsPolls content="Total Votes" component="votesVsPolls" />}
          </CardStyled>
        </LinkableComponent>
        <LinkableComponent id="VOTING_MKR_GINI">
          <CardStyled>
            <Gini content="Voting MKR Gini Coefficient" component="gini" />
          </CardStyled>
        </LinkableComponent>
      </TwoRowGrid>
      <PageSubTitle>Voter Behaviour</PageSubTitle>
      {/*
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <CardStyled>
          {mkrActiveness.length === 0 ? (
            <Loading />
          ) : (
            <MKRActiveness content="MKR Activeness" component="mkrActiveness" />
          )}
        </CardStyled>
        <TableCardStyled style={{ padding: 0 }}>
          <HomeTable
            info={homeMap.table.activenessBreakdown.info}
            links={homeMap.table.activenessBreakdown.links}
            content="MKR Activeness Breakdown"
            component="activenessBreakdown"
          />
        </TableCardStyled>
      </TwoRowGrid>
          */}
      <LinkableComponent id="VOTES_MKR_RESPONSIVENESS">
        <CardStyled style={{ marginBottom: '20px' }}>
          {executivesResponsiveness.length === 0 ? (
            <Loading />
          ) : (
            <ExecutivesResponsiveness content="Votes - MKR Responsiveness" component="executivesResponsiveness" />
          )}
        </CardStyled>
      </LinkableComponent>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <LinkableComponent id="POLLS_MKR_RESPONSIVENESS">
          <CardStyled>
            {pollsResponsiveness.length === 0 ? (
              <Loading />
            ) : (
              <PollsResponsiveness content="Polls - MKR Responsiveness" component="pollsResponsiveness" />
            )}
          </CardStyled>
        </LinkableComponent>
        <LinkableComponent id="TOP_VOTERS">
          <TableCardStyled style={{ padding: 0 }}>
            {topVoters.length === 0 ? (
              <Loading />
            ) : (
              <HomeTable
                info={homeMap.table.topVoters.info}
                links={homeMap.table.topVoters.links}
                content="Top Voters"
                component="topVoters"
              />
            )}
          </TableCardStyled>
        </LinkableComponent>
      </TwoRowGrid>
      <PageSubTitle>Executives</PageSubTitle>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <LinkableComponent id="TOP_EXECUTIVES">
          <TableCardStyled style={{ padding: 0 }}>
            <HomeTable
              info={homeMap.table.executives.info}
              links={homeMap.table.executives.links}
              handleRow={getVote}
              content="Top Executives"
              component="executives"
            />
          </TableCardStyled>
        </LinkableComponent>
        <LinkableComponent id="UNCAST_EXECUTIVES">
          <TableCardStyled style={{ padding: 0 }}>
            <HomeTable
              info={homeMap.table.uncastedExecutives.info}
              links={homeMap.table.uncastedExecutives.links}
              handleRow={getVote}
              content="Uncast Executives"
              component="uncastedExecutives"
            />
          </TableCardStyled>
        </LinkableComponent>
      </TwoRowGrid>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <LinkableComponent id="EXECUTIVE_TIME_TO_PASS">
          <CardStyled>
            <TimeTakenForExecutives content="Executive Time to Pass" component="timeTakenForExecutives" />
          </CardStyled>
        </LinkableComponent>
        <LinkableComponent id="MKR_DISTRIBUTION_BY_EXECUTIVE">
          <CardStyled>
            <MkrDistributionPerExecutive
              content="MKR Distribution By Executive"
              component="mkrDistributionPerExecutive"
            />
          </CardStyled>
        </LinkableComponent>
      </TwoRowGrid>
      <PageSubTitle>Polls</PageSubTitle>
      <TwoRowGrid style={{ marginBottom: '20px' }}>
        <LinkableComponent id="MOST_VOTED_POLLS">
          <TableCardStyled style={{ padding: 0 }}>
            {polls.length === 0 || !polls[0].participation ? (
              <Loading />
            ) : (
              <HomeTable
                info={homeMap.table.votedPolls.info}
                links={homeMap.table.votedPolls.links}
                handleRow={getPoll}
                content="Most Voted Polls"
                component="votedPolls"
              />
            )}
          </TableCardStyled>
        </LinkableComponent>
        <LinkableComponent id="RECENT_POLLS">
          <TableCardStyled style={{ padding: 0 }}>
            {polls.length === 0 ? (
              <Loading />
            ) : (
              <HomeTable
                info={homeMap.table.polls.info}
                links={homeMap.table.polls.links}
                handleRow={getPoll}
                content="Recent Polls"
                component="polls"
              />
            )}
          </TableCardStyled>
        </LinkableComponent>
      </TwoRowGrid>
      {isModalOpen && (
        <Modal isChart={isModalChart} isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
          {getModalContainer(homeMap[modalData.type][modalData.component].component)}
        </Modal>
      )}
    </>
  )
}

export default withRouter(HomeDetail)
