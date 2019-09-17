import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import styled from 'styled-components'

import List from '../../components/List'
import { Pollcolumns } from '../../components/List/helpers'

import { DEFAULT_FETCH_ROWS } from '../../constants'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

// Queries
import { GOVERNANCE_INFO_QUERY, POLLS_FIRST_QUERY } from './queries'

// Utils
import { getPollsData } from '../../utils/makerdao'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
  }
}

const Loading = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
)

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const PollsContainer = styled.div``

function PollsInfo() {
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))
  const [data, setData] = useState([])
  const pollcolumns = React.useMemo(() => Pollcolumns(), [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const pollsData = useQuery(POLLS_FIRST_QUERY, { variables: resultVariables })

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (pollsData.data && pollsData.data.polls) {
      getPollsData(pollsData.data.polls).then(pollsData => {
        const result = pollsData.filter(Boolean) as any
        setData(result)
      })
    }
  }, [pollsData.data])

  if (pollsData.loading || gResult.loading || data.length === 0) return <Loading />
  if (pollsData.error || gResult.error) return <Error />

  return (
    <PollsContainer>
      {console.log(data)}
      <PageTitle>Polling</PageTitle>
      <List data={data} columns={pollcolumns} />
    </PollsContainer>
  )
}

export default PollsInfo
