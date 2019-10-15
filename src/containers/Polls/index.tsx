import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'

import BigNumber from 'bignumber.js'
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
import { getPollsData, getMKRSupply } from '../../utils/makerdao'

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

const ErrorEl = () => <div>ERROR: There was an error trying to fetch the data. </div>

const PollsContainer = styled.div``

function PollsInfo(props) {
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))
  const [data, setData] = useState<any[]>([])
  const [mkrSupply, setMkrSupply] = useState<BigNumber | undefined>(undefined)
  const pollcolumns = React.useMemo(() => Pollcolumns(), [])
  const initialSort = React.useMemo(() => [{ id: 'date', desc: true }], [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const pollsData = useQuery(POLLS_FIRST_QUERY, { variables: resultVariables })

  const getPoll = row => {
    if (row.id) props.history.push(`/poll/${row.id}`)
  }

  const setPopularity = popularity => {
    const totalMkr = popularity.reduce((acc, value) => Number(acc) + Number(value.mkr), 0)
    const winnerOption = popularity.reduce(
      (prev, current) => (Number(prev.mkr) > Number(current.mkr) ? prev : current),
      0,
    )
    return { option: winnerOption, mkr: totalMkr ? Number((winnerOption.mkr * 100) / totalMkr).toFixed(2) : '0' }
  }
  const getParticipation = (data, mkrSupply) => {
    const totalMkr: BigNumber = data.reduce((acc, value) => acc.plus(new BigNumber(value.mkr)), new BigNumber('0'))
    return totalMkr
      .times(100)
      .div(mkrSupply)
      .toString()
  }

  useEffect(() => {
    getMKRSupply().then(supply => setMkrSupply(supply))
  }, [])

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (pollsData.data && pollsData.data.polls && mkrSupply) {
      getPollsData(pollsData.data.polls).then(result => {
        const polls = result.filter(Boolean)
        setData([...polls])

        Promise.all(
          polls.map(poll => {
            return getPollData(poll).then(data => {
              return { ...poll, popularity: setPopularity(data), participation: getParticipation(data, mkrSupply) }
            })
          }),
        ).then(pollsWithPopularityAndParticipation => {
          setData(pollsWithPopularityAndParticipation)
        })
      })
    }
  }, [pollsData.data, mkrSupply])

  if (pollsData.loading || gResult.loading || data.length === 0) return <Loading />
  if (pollsData.error || gResult.error) return <ErrorEl />

  return (
    <PollsContainer>
      <PageTitle>Polls</PageTitle>
      <List handleRow={getPoll} data={data} columns={pollcolumns} sortBy={initialSort} />
    </PollsContainer>
  )
}

export default PollsInfo
