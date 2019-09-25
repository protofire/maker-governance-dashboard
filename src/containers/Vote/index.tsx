import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

//Queries
import { EXECUTIVE_INFO_QUERY } from './queries'

// Utils
import { getMakerDaoData } from '../../utils/makerdao'

//Vote detail
import VoteDetails from '../../components/VoteDetails'

type Props = {
  match: any
}

const getExecutiveVariables = data => {
  return { id: data.source.toLowerCase() }
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

  const [resultVariables, setResultVariables] = useState(getExecutiveVariables({ source: '0x0' }))
  const [data, setData] = useState<any>({})
  const { data: vData, ...vResult } = useQuery(EXECUTIVE_INFO_QUERY, { variables: resultVariables })

  useEffect(() => {
    getMakerDaoData()
      .then(({ executiveVotes }) => {
        if (vData) {
          setResultVariables(getExecutiveVariables(executiveVotes[0]))
          const vote = executiveVotes.find(el => el.key === voteId)
          setData({ ...vote, ...vData.spell })
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [voteId, vData])

  if (!data || vResult.error) return <Error />
  if (Object.keys(data).length === 0 || vResult.loading) return <Loading />

  return (
    <VoteContainer>
      <PageTitle>{data.title}</PageTitle>
      <VoteDetails vote={data} />
    </VoteContainer>
  )
}

export default VoteInfo
