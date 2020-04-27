import gql from 'graphql-tag'
import { getAllEvents } from '../../utils'

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
  fragment executivesDetailHome on Spell {
    id
    timestamp
    approvals
    casted
    castedWith
    lifted
    liftedWith
    timeLine {
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
    url
    pollId
    votes {
      id
      voter
      option
      timestamp
    }
    startDate
    endDate
    votesCount
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
const getPollsData = (pageIndex, pageSize, offset, ordering) => {
  return `
  polls_${pageIndex}: polls(first: ${pageSize}, skip: ${offset}, ${ordering}, where: { id_not_in: [0,1,2,3,6,7,8,9,11] }) {
    ...pollsDetail
  }
  `
}

const getExecutivesData = (pageIndex, pageSize, offset, ordering) => {
  return `
  executives_${pageIndex}: spells(first: ${pageSize}, skip: ${offset}, ${ordering}) {
    ...executivesDetailHome
  }
  `
}

const getHomeData = (pageIndex, pageSize, offset, ordering) => {
  return `
    lock_${pageIndex}: actions(where: { type: LOCK }, first: ${pageSize}, skip: ${offset}, ${ordering}) {
      ...actionsDetail
      sender
    }

    free_${pageIndex}: actions(where: { type: FREE }, first: ${pageSize}, skip: ${offset}, ${ordering}) {
      ...actionsDetail
      sender
    }

    vote_${pageIndex}: actions(where: { type: VOTE }, first: ${pageSize}, skip: ${offset}, ${ordering}) {
      ...actionsDetail
      sender
      yays
    }
  `
}

export const HOME_DATA_QUERY = ({ pollPages, executivesPages }) => gql`
  query getHomeData($voters: Int!) {
    ${getAllEvents(getExecutivesData, 'timestamp', executivesPages)}
    ${getAllEvents(getPollsData, 'startDate', pollPages)}
    voters: actions(where: { type: VOTER }, first: $voters) {
      ...actionsDetail
    }
    ${getAllEvents(getHomeData)}
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
