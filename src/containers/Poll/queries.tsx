import gql from 'graphql-tag'

const pollsDetailFragment = gql`
  fragment pollsDetailPage on Poll {
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
  query GetPollsInfoPage {
    governanceInfo(id: "0x0") {
      countPolls
    }
  }
`

export const POLLS_FIRST_QUERY = gql`
  query GetPollsDataPage($polls: Int!) {
    polls(first: $polls) {
      ...pollsDetailPage
    }
  }
  ${pollsDetailFragment}
`
