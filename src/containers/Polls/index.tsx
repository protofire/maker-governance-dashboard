import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import styled from 'styled-components'

import List from '../../components/List'
import { Pollcolumns } from '../../components/List/helpers'
import { getPollData } from '../../components/PollDetails/data'

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
  const initialSort = React.useMemo(() => [{ id: 'date', desc: true }], [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const pollsData = useQuery(POLLS_FIRST_QUERY, { variables: resultVariables })

  const getPoll = row => {
    if (row.id) props.history.push(`/poll/${row.id}`)
  }

  const setPopularity = popularity => {
    const totalMkr = popularity.reduce((acc, value) => Number(acc) + Number(value.mkr), 0)
    const winnerOption = popularity.reduce((prev, current) => (prev.mkr > current.mkr ? prev : current))
    return { option: winnerOption, mkr: totalMkr ? Number((winnerOption.mkr * 100) / totalMkr).toFixed(2) : '0' }
  }

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (pollsData.data && pollsData.data.polls) {
      Promise.all([getPollsData(pollsData.data.polls), getMakerDaoData()]).then(result => {
        const polls = result[0].filter(Boolean)
        setData([...polls])
        const pollsWithPopularity = polls.map(poll =>
          getPollData(poll).then(data => ({ ...poll, popularity: setPopularity(data) })),
        )
        Promise.all(pollsWithPopularity).then(data => setData(data))
      })
    }
  }, [pollsData.data])
  if (pollsData.loading || gResult.loading || data.length === 0) return <Loading />
  if (pollsData.error || gResult.error) return <Error />
  return (
    <PollsContainer>
      <PageTitle>Polls</PageTitle>
      <List handleRow={getPoll} data={data} columns={pollcolumns} sortBy={initialSort} />
    </PollsContainer>
  )
}

export default PollsInfo
