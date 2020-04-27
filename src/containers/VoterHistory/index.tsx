import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import List from '../../components/List'
import { getMakerDaoData, getPollsMetaData } from '../../utils/makerdao'
import { getPollData, getPollsBalances } from '../../utils'
import { PageTitle, FullLoading } from '../../components/common'
import { VoterHistoryColumns } from '../../components/List/helpers'
import { DEFAULT_FETCH_ROWS, VOTING_ACTION_ADD, VOTING_ACTION_LOCK } from '../../constants'
import { ACTIONS_QUERY, GOVERNANCE_INFO_QUERY } from './queries'

type Props = {
  match: any
  history?: any
}

const NoResult = () => <div>This address has no participations. </div>

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
    executives: Number(governance.countSpells) || DEFAULT_FETCH_ROWS,
  }
}

const descendantTimestampSort = (a, b) => (a.timestamp > b.timestamp ? 1 : -1)

function VoterHistory(props: Props) {
  const { match, history } = props
  const voterId = match.params.id
  const [executives, setExecutives] = useState<any[]>([])
  const [polls, setPolls] = useState<any[]>([])
  const [executivesMetadataLoaded, setExecutiveMetadataLoaded] = useState(false)
  const [pollsMetadataLoaded, setPollsMetadataLoaded] = useState(false)

  const historyColumns = React.useMemo(() => VoterHistoryColumns(), [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const historyData = useQuery(ACTIONS_QUERY, { variables: gData && getHomeVariables(gData), skip: !gData })

  useEffect(() => {
    if (!historyData || !historyData.data) return

    const executives = historyData.data.executives
      .map(vote => {
        const participation = vote.timeLine
          .filter(tl => (tl.type === VOTING_ACTION_ADD || tl.type === VOTING_ACTION_LOCK) && tl.sender === voterId)
          .sort(descendantTimestampSort)

        return participation.length > 0 ? { ...vote, lastParticipation: participation[0] } : undefined
      })
      .filter(Boolean)

    const polls = historyData.data.polls
      .map(poll => {
        const participation = poll.votes.filter(vote => vote.voter === voterId).sort(descendantTimestampSort)

        return participation.length > 0 ? { ...poll, lastParticipation: participation[0] } : undefined
      })
      .filter(Boolean)

    setExecutives(executives)
    setPolls(polls)
  }, [voterId, historyData])

  const hasParticipations = historyData.loading || executives.length || polls.length

  const getItem = row => {
    if (row.__typename === 'Spell') history.push(`/executive/${row.id}`)
    else history.push(`/poll/${row.id}`)
  }

  const setPlurality = plurality => {
    const winnerOption = plurality.reduce(
      (prev, current) => (Number(prev.mkr) > Number(current.mkr) ? prev : current),
      0,
    )
    return {
      option: winnerOption,
    }
  }

  useEffect(() => {
    if (!polls.length || pollsMetadataLoaded) return

    setPollsMetadataLoaded(true)

    async function fetchPollsData() {
      const pollsBalances = await getPollsBalances(polls)

      const pollsData = await getPollsMetaData(polls)
      const filteredPolls = pollsData.filter(Boolean)
      const pollsWithPlurality = await Promise.all(
        filteredPolls.map(poll => {
          return getPollData(poll, pollsBalances).then(data => {
            return { ...poll, plurality: setPlurality(data) }
          })
        }),
      )
      setPolls(pollsWithPlurality)
    }

    fetchPollsData()
  }, [polls, pollsMetadataLoaded])

  useEffect(() => {
    if (!executives.length || executivesMetadataLoaded) return

    setExecutiveMetadataLoaded(true)

    getMakerDaoData()
      .then(({ spellsInfo }) => {
        setExecutives(exs =>
          exs.map(spell => {
            const proposal = spellsInfo.find(prop => prop.source.toLowerCase() === spell.id.toLowerCase())
            return {
              ...spell,
              ...proposal,
            }
          }),
        )
      })
      .catch(error => {
        console.log(error)
      })
  }, [executives, executivesMetadataLoaded])

  if ((historyData.loading || gResult.loading) && hasParticipations) return <FullLoading />
  if (!hasParticipations) return <NoResult />
  if (historyData.error || gResult.error) return <Error />
  return (
    <>
      <PageTitle>{`Voter History - ${voterId}`}</PageTitle>
      <List handleRow={getItem} data={[...executives, ...polls]} columns={historyColumns} />
    </>
  )
}

export default VoterHistory
