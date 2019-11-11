import gql from 'graphql-tag'

const makerGovernanceDetailFragment = gql`
  fragment makerGovernanceDetail on GovernanceInfo {
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
    wad
    type
  }
`

const executivesDetailFragment = gql`
  fragment executivesDetail on Spell {
    id
    timestamp
    approvals
    casted
    castedWith
    lifted
    liftedWith
    timeLine(first: 1000) {
      id
      timestamp
      transactionHash
      sender
      type: __typename
      ... on AddAction {
        locked
      }
      ... on RemoveAction {
        locked
      }
      ... on LockAction {
        wad
      }
      ... on FreeAction {
        wad
      }
    }
  }
`

const pollsDetailFragment = gql`
  fragment pollsDetail on Poll {
    id
    creator
    url
    pollId
    votes(first: 1000) {
      id
      voter
      option
    }
    startDate
    endDate
  }
`
export const GOVERNANCE_INFO_QUERY = gql`
  query GetGovernanceInfo {
    governanceInfo(id: "0x0") {
      ...makerGovernanceDetail
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
  query getHomeData($voters: Int!, $executives: Int!, $polls: Int!, $lock: Int!, $free: Int!) {
    polls(first: $polls) {
      ...pollsDetail
    }
    executives: spells(first: $executives) {
      ...executivesDetail
    }
    voters: actions(where: { type: VOTER }, first: $voters) {
      ...actionsDetail
    }
    lock: actions(where: { type: LOCK }, first: $lock) {
      ...actionsDetail
      sender
    }
    free: actions(where: { type: FREE }, first: $free) {
      ...actionsDetail
      sender
    }
  }
  ${pollsDetailFragment}
  ${executivesDetailFragment}
  ${actionsDetailFragment}
`

export const GOVERNANCE_INFO_SUBSCRIPTION = gql`
  subscription GovernanceInfo {
    governanceInfo(id: "0x0") {
      ...makerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`
