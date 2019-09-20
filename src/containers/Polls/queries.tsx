import gql from 'graphql-tag'

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
  query GetPollsInfo {
    governanceInfo(id: "0x0") {
      countPolls
    }
  }
`

export const POLLS_FIRST_QUERY = gql`
  query GetPollsData($polls: Int!) {
    polls(first: $polls) {
      ...pollsDetail
    }
  }
  ${pollsDetailFragment}
`
