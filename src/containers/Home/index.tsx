import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import HomeDetail from '../../components/Home/HomeDetail'

//Common components
import { Spinner, SpinnerContainer, PageTitle } from '../../components/common'

//Queries
import { POLL_VOTES_FIRST_QUERY } from './queries'

const HomeContainer = styled.div``

function MakerGovernanceInfo() {
  const { data, ...result } = useQuery(POLL_VOTES_FIRST_QUERY)

  if (result.loading) {
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    )
  }

  if (result.error) {
    return <div>ERROR: There was an error trying to fetch the data. </div>
  }

  return (
    <HomeContainer>
      <PageTitle>Dashboard</PageTitle>
      <HomeDetail subscribeToChanges={() => console.log} pollVotes={data.pollVotes} />
    </HomeContainer>
  )
}

export default MakerGovernanceInfo
