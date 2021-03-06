import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { PageTitle, FullLoading } from '../../components/common'
import { DEFAULT_FETCH_ROWS } from '../../constants'
import { ACTIONS_QUERY, GOVERNANCE_INFO_QUERY } from './queries'
import VotingHistoryDetails from '../../components/VotingHistoryDetails'

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
    executives: Number(governance.countSpells) || DEFAULT_FETCH_ROWS,
  }
}

function VotingHistory(props) {
  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const historyData = useQuery(ACTIONS_QUERY, { variables: gData && getHomeVariables(gData), skip: !gData })

  if (historyData.loading || gResult.loading) return <FullLoading />
  if (historyData.error || gResult.error) return <Error />

  return (
    <>
      <PageTitle>Voting History</PageTitle>
      <VotingHistoryDetails
        history={props.history}
        polls={historyData.data.polls}
        executives={historyData.data.executives}
      />
    </>
  )
}

export default VotingHistory
