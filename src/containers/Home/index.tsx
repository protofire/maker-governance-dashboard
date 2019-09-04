import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import styled from 'styled-components'

import gql from 'graphql-tag'

import HomeDetail from '../../components/Home/HomeDetail'

//Common components
import { Spinner, SpinnerContainer } from '../../components/common/Spinner'
import { PageTitle } from '../../components/common/styled'

const HomeContainer = styled.div``

const makerGovernanceDetailFragment = gql`
  fragment MakerGovernanceDetail on GovernanceInfo {
    id
    countVoters
    locked
    lastBlock
  }
`

const GOVERNANCE_INFO_QUERY = gql`
  query GetGovernanceInfo {
    governanceInfo(id: "0x0") {
      ...MakerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`

const GOVERNANCE_INFO_SUBSCRIPTION = gql`
  subscription GovernanceInfo {
    governanceInfo(id: "0x0") {
      ...MakerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`
function MakerGovernanceInfo() {
  const { subscribeToMore, ...result } = useQuery(GOVERNANCE_INFO_QUERY)

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
      <HomeDetail
        data={result.data.governanceInfo}
        subscribeToChanges={() =>
          subscribeToMore({
            document: GOVERNANCE_INFO_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => (subscriptionData.data ? subscriptionData.data : prev),
          })
        }
      />
    </HomeContainer>
  )
}

export default MakerGovernanceInfo
