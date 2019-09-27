import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import { DEFAULT_FETCH_ROWS } from '../../constants'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

//Queries
import { EXECUTIVE_INFO_QUERY, VOTING_ACTIONS_QUERY } from './queries'

// Utils
import { getMakerDaoData } from '../../utils/makerdao'

//Vote detail
import VoteDetails from '../../components/VoteDetails'

type Props = {
  match: any
}

const getExecutiveVariables = data => {
  return {
    id: data.id.toLowerCase(),
    timeLineCount: data.timeLineCount ? Number(data.timeLineCount) : DEFAULT_FETCH_ROWS,
  }
}

const Loading = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
)

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const VoteContainer = styled.div``

function VoteInfo(props: Props) {
  const { match } = props
  const voteId = match.params.id

  const [resultVariables, setResultVariables] = useState(getExecutiveVariables({ id: voteId }))
  const [data, setData] = useState<any>({})
  const [makerData, setMakerData] = useState<any>({})
  const { data: votingData, ...votingResult } = useQuery(VOTING_ACTIONS_QUERY, { variables: resultVariables })

  const { data: vData, ...vResult } = useQuery(EXECUTIVE_INFO_QUERY, { variables: resultVariables })

  useEffect(() => {
    getMakerDaoData()
      .then(({ executiveVotes }) => {
        const vote = executiveVotes.find(el => {
          return el.source.toLowerCase() === voteId.toLowerCase()
        })
        setMakerData(vote)
      })
      .catch(error => {
        console.log(error)
      })
  }, [voteId])

  useEffect(() => {
    if (vData && vData.spell && voteId) {
      setData(() => ({ ...makerData, ...vData.spell }))
      setResultVariables(getExecutiveVariables({ id: voteId, timeLineCount: vData.spell.timeLineCount }))
    }
  }, [vData, voteId, makerData])

  if (!data || vResult.error || votingResult.error) return <Error />
  if (Object.keys(data).length === 0 || vResult.loading || votingResult.loading) return <Loading />

  return (
    <VoteContainer>
      <PageTitle>{data.title}</PageTitle>
      <VoteDetails votingActions={votingData.spell ? votingData.spell.timeLine : []} vote={data} />
    </VoteContainer>
  )
}

export default VoteInfo
