import gql from 'graphql-tag'
import { getAllEvents } from '../../utils'

const pollsDetailFragment = gql`
  fragment pollsDetailTotal on Poll {
    id
    creator
    url
    pollId
    startDate
    endDate
    votesCount
    votes {
      voter
      option
    }
  }
`
const getPollsData = (pageIndex, pageSize, offset, ordering) => {
  return `
  polls_${pageIndex}: polls(first: ${pageSize}, skip: ${offset}, ${ordering}, where: { id_not_in: [0,1,2,3,6,7,8,9,11] }) {
    ...pollsDetailTotal
  }
  `
}
export const GOVERNANCE_INFO_QUERY = gql`
  query GetPollsInfo {
    governanceInfo(id: "0x0") {
      id
      countPolls
    }
  }
`

export const POLLS_FIRST_QUERY = gql`
  query GetPollsData {
    ${getAllEvents(getPollsData, 'startDate')}
  }
  ${pollsDetailFragment}
`
