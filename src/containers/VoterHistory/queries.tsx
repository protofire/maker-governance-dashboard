import gql from 'graphql-tag'

const makerGovernanceDetailFragment = gql`
  fragment makerGovernanceDetailHistory on GovernanceInfo {
    id
    countProxies
    countAddresses
    countSlates
    countSpells
    countPolls
    hat
  }
`

const executivesDetailFragment = gql`
  fragment executivesDetailVoter on Spell {
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
  fragment pollsDetailVoter on Poll {
    id
    creator
    url
    pollId
    votes(first: 1000) {
      id
      voter
      option
      timestamp
    }
    startDate
    endDate
    votesCount
    timeLine(first: 1000) {
      id
      timestamp
      type: __typename
      ... on VotePollAction {
        sender
        option
        timestamp
      }
      ... on CreatePollAction {
        block
      }
      ... on WithdrawPollAction {
        block
      }
    }
  }
`

export const GOVERNANCE_INFO_QUERY = gql`
  query GetGovernanceInfoVoterHistory {
    governanceInfo(id: "0x0") {
      ...makerGovernanceDetailHistory
    }
  }
  ${makerGovernanceDetailFragment}
`

export const ACTIONS_QUERY = gql`
  query getVoterHistoryData($executives: Int!, $polls: Int!) {
    polls(first: $polls, orderBy: startDate, orderDirection: desc, where: { id_not_in: [0, 1, 2, 3, 6, 7, 8, 9, 11] }) {
      ...pollsDetailVoter
    }
    executives: spells(first: $executives) {
      ...executivesDetailVoter
    }
  }
  ${pollsDetailFragment}
  ${executivesDetailFragment}
`
