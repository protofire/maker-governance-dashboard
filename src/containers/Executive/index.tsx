import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import List from '../../components/List'
import { Executivecolumns } from '../../components/List/helpers'

import { DEFAULT_FETCH_ROWS } from '../../constants'

//Common components
import { PageTitle, Spinner, SpinnerContainer } from '../../components/common'

// Queries
import { GOVERNANCE_INFO_QUERY, VOTES_FIRST_QUERY } from './queries'

// Utils
import { getMakerDaoData } from '../../utils/makerdao'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    executives: Number(governance.countSpells) || DEFAULT_FETCH_ROWS,
  }
}

const Loading = () => (
  <SpinnerContainer>
    <Spinner />
  </SpinnerContainer>
)

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

const ExecutiveContainer = styled.div``

function ExecutiveInfo() {
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))
  const [data, setData] = useState([])
  const executivecolumns = React.useMemo(() => Executivecolumns(), [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const excutivesData = useQuery(VOTES_FIRST_QUERY, { variables: resultVariables })

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (excutivesData.data && excutivesData.data.spells) {
      const executiveIds = excutivesData.data.spells.map(ex => ex.id)
      getMakerDaoData()
        .then(({ executiveVotes }) => {
          const test = executiveVotes.filter(vote => {
            return executiveIds.indexOf(vote.source.toLocaleLowerCase()) > -1
          })
          setData(test)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [excutivesData.data])
  if (excutivesData.loading || gResult.loading) return <Loading />
  if (excutivesData.error || gResult.error) return <Error />

  return (
    <ExecutiveContainer>
      <PageTitle>Executive Votes</PageTitle>
      <List data={data} columns={executivecolumns} />
    </ExecutiveContainer>
  )
}

export default ExecutiveInfo
