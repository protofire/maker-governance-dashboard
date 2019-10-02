import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { fromUnixTime } from 'date-fns'

import styled from 'styled-components'

import List from '../../components/List'
import { Pollcolumns } from '../../components/List/helpers'

import { DEFAULT_FETCH_ROWS } from '../../constants'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

// Queries
import { GOVERNANCE_INFO_QUERY, POLLS_FIRST_QUERY } from './queries'

// Utils
import { getPollsData, getMakerDaoData } from '../../utils/makerdao'

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

function PollsInfo(props) {
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))
  const [data, setData] = useState<any[]>([])
  const pollcolumns = React.useMemo(() => Pollcolumns(), [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const pollsData = useQuery(POLLS_FIRST_QUERY, { variables: resultVariables })

  const getPoll = row => {
    if (row.id) props.history.push(`/poll/${row.id}`)
  }

  const defaultSort = (a, b) => (fromUnixTime(a.startDate) > fromUnixTime(b.startDate) ? -1 : 1)

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (pollsData.data && pollsData.data.polls) {
      Promise.all([getPollsData(pollsData.data.polls), getMakerDaoData()]).then(result => {
        const polls = result[0].filter(Boolean)
        setData([...polls])
      })
    }
  }, [pollsData.data])

  if (pollsData.loading || gResult.loading || data.length === 0) return <Loading />
  if (pollsData.error || gResult.error) return <Error />

  return (
    <PollsContainer>
      <PageTitle>Polls</PageTitle>
      <List handleRow={getPoll} data={data.sort(defaultSort)} columns={pollcolumns} />
    </PollsContainer>
  )
}

export default PollsInfo
