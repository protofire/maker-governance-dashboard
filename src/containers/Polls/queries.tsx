import gql from 'graphql-tag'

const pollsDetailFragment = gql`
  fragment pollsDetailTotal on Poll {
    id
    creator
    url
    pollId
    startDate
    endDate
    votesCount
    votes(first: 1000) {
      voter
      option
    }
  }
`

export const GOVERNANCE_INFO_QUERY = gql`
  query GetPollsInfo {
    governanceInfo(id: "0x0") {
      countPolls
    }
  }
`

export const POLLS_FIRST_QUERY = gql`
  query GetPollsData($polls: Int!) {
    polls(first: $polls) {
      ...pollsDetailTotal
    }
  }
  ${pollsDetailFragment}
`
