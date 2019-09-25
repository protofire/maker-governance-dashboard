import gql from 'graphql-tag'

export const EXECUTIVE_INFO_QUERY = gql`
  query GetSpell($id: ID!) {
    spell(id: $id) {
      id
      timestamp
      casted
      castedWith
      lifted
      liftedWith
      approvals
      timeLineCount
      totalVotes
    }
  }
`

export const VOTING_ACTIONS_QUERY = gql`
  query GetVotingActions($id: ID!, $timeLineCount: Int) {
    spell(id: $id) {
      id
      timeLine(first: $timeLineCount) {
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
  }
`
