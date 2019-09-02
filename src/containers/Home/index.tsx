import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import HomeDetail from '../../components/Home/HomeDetail'

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
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>ERROR: There was an error trying to fetch data!</div>
  }

  return (
    <HomeDetail
      data={result.data.governanceInfo}
      subscribeToChanges={() =>
        subscribeToMore({
          document: GOVERNANCE_INFO_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => (subscriptionData.data ? subscriptionData.data : prev),
        })
      }
    />
  )
}

export default MakerGovernanceInfo
