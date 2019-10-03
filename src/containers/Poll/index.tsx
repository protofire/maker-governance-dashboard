import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import styled from 'styled-components'

import { DEFAULT_FETCH_ROWS } from '../../constants'

// Utils
import { getPollsData, getMakerDaoData } from '../../utils/makerdao'

//Queries
import { GOVERNANCE_INFO_QUERY, POLLS_FIRST_QUERY } from './queries'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

//Poll details
import PollDetails from '../../components/PollDetails'

type Props = {
  match: any
}

const Loading = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
)

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const PollContainer = styled.div``

function PollInfo(props: Props) {
  const { match } = props
  const pollId = match.params.id

  const getPollsVariables = data => {
    const governance = data.governanceInfo
    return {
      polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
    }
  }

  const [data, setData] = useState<any>({})
  const [resultVariables, setResultVariables] = useState(getPollsVariables({ governanceInfo: {} }))
  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const pollsData = useQuery(POLLS_FIRST_QUERY, { variables: resultVariables })

  useEffect(() => {
    if (gData) setResultVariables(getPollsVariables(gData))
  }, [gData])

  useEffect(() => {
    if (pollsData.data && pollsData.data.polls) {
      Promise.all([getPollsData(pollsData.data.polls), getMakerDaoData()]).then(result => {
        const polls = result[0].filter(Boolean)
        setData(polls.find((el: any) => el.id === pollId))
      })
    }
  }, [pollsData.data, pollId])

  if (pollsData.loading || gResult.loading || Object.keys(data).length === 0) return <Loading />
  if (pollsData.error || gResult.error) return <Error />

  return (
    <PollContainer>
      <PageTitle>{data.title}</PageTitle>
      <PollDetails poll={data} />
    </PollContainer>
  )
}

export default PollInfo
