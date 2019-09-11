import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import HomeDetail from '../../components/Home/HomeDetail'

//Common components
import { Spinner, SpinnerContainer, PageTitle } from '../../components/common'

//Queries
import { ACTIONS_QUERY, GOVERNANCE_INFO_QUERY } from './queries'

const HomeContainer = styled.div``

function MakerGovernanceInfo() {
  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const { data, ...result } = useQuery(ACTIONS_QUERY, { variables: { voters: 304 } })
  if (result.loading || gResult.loading) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    )
  }

  if (result.error || gResult.error) {
    return <div>ERROR: There was an error trying to fetch the data. </div>
  }
  return (
    <HomeContainer>
      <PageTitle>Dashboard</PageTitle>
      <HomeDetail data={data} />
    </HomeContainer>
  )
}

export default MakerGovernanceInfo
