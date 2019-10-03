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
  const initialSort = React.useMemo(() => [{ id: 'date', desc: true }], [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const excutivesData = useQuery(VOTES_FIRST_QUERY, { variables: resultVariables })

  const getVote = row => {
    if (row.id) props.history.push(`/executive/${row.id}`)
  }

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    if (excutivesData.data && excutivesData.data.spells) {
      getMakerDaoData()
        .then(({ executiveVotes }) => {
          setData(
            excutivesData.data.spells.map(spell => {
              const proposal = executiveVotes.find(prop => {
                return prop.source.toLowerCase() === spell.id.toLowerCase()
              })
              return {
                ...spell,
                ...proposal,
              }
            }),
          )
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
      <List handleRow={getVote} data={data} columns={executivecolumns} sortBy={initialSort} />
    </ExecutiveContainer>
  )
}

export default ExecutiveInfo
