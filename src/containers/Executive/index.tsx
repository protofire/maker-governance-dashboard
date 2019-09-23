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

function ExecutiveInfo(props) {
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))
  const [data, setData] = useState<any[]>([])
  const executivecolumns = React.useMemo(() => Executivecolumns(), [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const excutivesData = useQuery(VOTES_FIRST_QUERY, { variables: resultVariables })

  const getVote = row => {
    //Temporal fix as we don't have all the executive votes thru the API
    if (row.key) props.history.push(`/executive/${row.key}`)
  }

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (excutivesData.data && excutivesData.data.spells) {
      getMakerDaoData()
        .then(({ executiveVotes }) => {
          setData([...executiveVotes, ...excutivesData.data.spells])
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
      <List handleRow={getVote} data={data} columns={executivecolumns} />
    </ExecutiveContainer>
  )
}

export default ExecutiveInfo