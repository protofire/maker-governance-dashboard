import gql from 'graphql-tag'

const makerGovernanceDetailFragment = gql`
  fragment MakerGovernanceDetail on GovernanceInfo {
    id
    countProxies
    countAddresses
    countSlates
    countSpells
    countLock
    countFree
    countPolls
    locked
    lastBlock
    lastSynced
    hat
  }
`

const actionsDetailFragment = gql`
  fragment actionsDetail on Action {
    id
    timestamp
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
export const ACTIONS_QUERY = gql`
  query getHomeData($voters: Int!) {
    polls {
      ...pollsDetail
    }
    voters: actions(where: { type: VOTER }, first: $voters) {
      ...actionsDetail
    }
  }
  ${pollsDetailFragment}
  ${actionsDetailFragment}
`

export const GOVERNANCE_INFO_SUBSCRIPTION = gql`
  subscription GovernanceInfo {
    governanceInfo(id: "0x0") {
      ...MakerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`
