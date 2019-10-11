import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import styled from 'styled-components'

// Utils
import { getPollsData, getMakerDaoData } from '../../utils/makerdao'

//Queries
import { POLL_QUERY_BY_ID } from './queries'

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

  const [data, setData] = useState<any>({})
  const pollData = useQuery(POLL_QUERY_BY_ID, { skip: !pollId, variables: { id: pollId } })

  useEffect(() => {
    if (pollData.data && pollData.data.poll) {
      Promise.all([getPollsData([pollData.data.poll]), getMakerDaoData()]).then(result => {
        const polls = result[0].filter(Boolean)
        setData(polls[0])
      })
    }
  }, [pollData.data, pollId])

  if (pollData.loading || Object.keys(data).length === 0) return <Loading />
  if (pollData.error) return <Error />

  return (
    <PollContainer>
      <PageTitle>{data.title}</PageTitle>
      <PollDetails poll={data} />
    </PollContainer>
  )
}

export default PollInfo
