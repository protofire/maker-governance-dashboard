import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

// Utils
import { getMakerDaoData } from '../../utils/makerdao'

//Vote detail
import VoteDetails from '../../components/VoteDetails'

type Props = {
  match: any
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

  const [data, setData] = useState<any>({})

  useEffect(() => {
    getMakerDaoData()
      .then(({ executiveVotes }) => {
        const vote = executiveVotes.find(el => el.key === voteId)
        setData(vote)
      })
      .catch(error => {
        console.log(error)
      })
  }, [voteId])

  if (!data) return <Error />
  if (Object.keys(data).length === 0) return <Loading />
  return (
    <VoteContainer>
      <PageTitle>{data.title}</PageTitle>
      <VoteDetails vote={data} />
    </VoteContainer>
  )
}

export default VoteInfo
