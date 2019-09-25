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
