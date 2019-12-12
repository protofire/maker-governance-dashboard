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

// Since TG returns a maximum of 1000 results per collection then it's necessary to paginate to get all events
// Note: the max number of events per type supported with this configuration is 10000. Increase pageCount parameter
// if we need to support more that that value.
const getAllEvents = (pageCount = 10, pageSize = 1000) => {
  const pages = Array.from(Array(pageCount).keys()).reverse()

  const ordering = 'orderBy: timestamp, orderDirection: desc'

  return pages.map(pageIndex => {
    const offset = pageSize * pageIndex

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
  })
}

export const mergeEventPages = (data: object) => {
  const merged: any = {}

  Object.keys(data).forEach(key => {
    if (key.includes('_')) {
      const [name] = key.split('_')

      merged[name] = [...(merged[name] || []), ...data[key].reverse()]
    } else {
      merged[key] = data[key]
    }
  })

  return merged
}

export const HOME_DATA_QUERY = gql`
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
    ${getAllEvents()}
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
