import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import List from '../../components/List'
import { getMakerDaoData, getPollsData } from '../../utils/makerdao'
import { getPollData, getPollsBalances } from '../../utils'
import { PageTitle, FullLoading } from '../../components/common'
import { VoterHistoryColumns } from '../../components/List/helpers'
import { DEFAULT_FETCH_ROWS, VOTING_ACTION_ADD, VOTING_ACTION_LOCK } from '../../constants'
import { ACTIONS_QUERY, GOVERNANCE_INFO_QUERY } from './queries'

type Props = {
  match: any
}

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
    executives: Number(governance.countSpells) || DEFAULT_FETCH_ROWS,
  }
}

function VoterHistory(props: Props) {
  const { match } = props
  const voterId = match.params.id
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))
  const [executives, setExecutives] = useState<any[]>([])
  const [polls, setPolls] = useState<any[]>([])
  const [pollsBalances, setBalances] = useState<any>({})

  const historyColumns = React.useMemo(() => VoterHistoryColumns(), [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const historyData = useQuery(ACTIONS_QUERY, { variables: resultVariables })

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
    if (!historyData || !historyData.data) return
    getPollsBalances(historyData.data.polls).then(balances => setBalances(balances))
  }, [historyData])

  useEffect(() => {
    if (historyData.data && historyData.data.polls) {
      getPollsData(historyData.data.polls).then(result => {
        const polls = result.filter(Boolean)
        setPolls([...polls])
        Promise.all(
          polls.map(poll => {
            return getPollData(poll, pollsBalances).then(data => {
              return { ...poll, plurality: setPlurality(data) }
            })
          }),
        ).then(pollsWithPluralityAndParticipation => {
          setPolls(pollsWithPluralityAndParticipation)
        })
      })
    }
  }, [historyData.data, pollsBalances])

  useEffect(() => {
    const getData = () => {
      if (!historyData || !historyData.data) return
      const executives = historyData.data.executives
        .map(vote =>
          vote.timeLine.filter(
            tl => (tl.type === VOTING_ACTION_ADD || tl.type === VOTING_ACTION_LOCK) && tl.sender === voterId,
          ).length > 0
            ? { ...vote }
            : undefined,
        )
        .filter(Boolean)
      const polls = historyData.data.polls
        .map(poll => (poll.votes.filter(vote => vote.voter === voterId).length > 0 ? { ...poll } : undefined))
        .filter(Boolean)
      setExecutives(executives)
      setPolls(polls)
    }
    getData()
  }, [historyData, voterId])

  useEffect(() => {
    if (historyData.data && historyData.data.executives) {
      getMakerDaoData()
        .then(({ executiveVotes }) => {
          setExecutives(exs =>
            exs.map(spell => {
              const proposal = executiveVotes.find(prop => prop.source.toLowerCase() === spell.id.toLowerCase())
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
    }
  }, [historyData])

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  if (historyData.loading || gResult.loading) return <FullLoading />
  if (historyData.error || gResult.error) return <Error />
  return (
    <>
      <PageTitle>Voter History</PageTitle>
      <List data={[...executives, ...polls]} columns={historyColumns} />
    </>
  )
}

export default VoterHistory
