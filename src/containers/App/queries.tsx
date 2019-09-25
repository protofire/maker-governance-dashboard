import gql from 'graphql-tag'

export const GOVERNANCE_INFO_QUERY = gql`
  query GetGovernanceInfoApp {
    governanceInfo(id: "0x0") {
      lastSynced
    }
  }
`
