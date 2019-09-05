import gql from 'graphql-tag'

const makerGovernanceDetailFragment = gql`
  fragment MakerGovernanceDetail on GovernanceInfo {
    id
    countVoters
    locked
    lastBlock
  }
`

const pollVoteDetailFragment = gql`
  fragment pollVoteDetail on PollVote {
    id
    creator
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

export const POLL_VOTES_FIRST_QUERY = gql`
  query GetPollVotes {
    pollVotes(first: 5) {
      ...pollVoteDetail
    }
  }
  ${pollVoteDetailFragment}
`

export const GOVERNANCE_INFO_SUBSCRIPTION = gql`
  subscription GovernanceInfo {
    governanceInfo(id: "0x0") {
      ...MakerGovernanceDetail
    }
  }
  ${makerGovernanceDetailFragment}
`
