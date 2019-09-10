import gql from 'graphql-tag'

const makerGovernanceDetailFragment = gql`
  fragment MakerGovernanceDetail on GovernanceInfo {
    id
    countVoters
    locked
    lastBlock
  }
`

const pollsDetailFragment = gql`
  fragment pollsDetail on Poll {
    id
    creator
    url
    pollId
    startDate
    endDate
  }
`
export const GOVERNANCE_INFO_QUERY = gql`
  query GetGovernanceInfo {
    governanceInfo(id: "0x0") {
      ...MakerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`

export const POLLS_FIRST_QUERY = gql`
  query GetPolls {
    polls {
      ...pollsDetail
    }
  }
  ${pollsDetailFragment}
`

export const GOVERNANCE_INFO_SUBSCRIPTION = gql`
  subscription GovernanceInfo {
    governanceInfo(id: "0x0") {
      ...MakerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`
