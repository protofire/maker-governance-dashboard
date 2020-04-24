import gql from 'graphql-tag'

const pollsDetailFragmentPage = gql`
  fragment pollsDetailPage on Poll {
    id
    creator
    url
    pollId
    startDate
    timeLineCount
    endDate
    votesCount
    votes {
      id
      voter
      option
    }
    timeLine {
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
  query GetPollsInfoPage {
    governanceInfo(id: "0x0") {
      countPolls
    }
  }
`
export const POLL_QUERY_BY_ID = gql`
  query GetPollsDataPage($id: ID!) {
    poll(id: $id) {
      ...pollsDetailPage
    }
  }
  ${pollsDetailFragmentPage}
`
