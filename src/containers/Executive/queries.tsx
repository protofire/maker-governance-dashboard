import gql from 'graphql-tag'

const executivesDetailFragment = gql`
  fragment executivesDetailPage on Spell {
    id
    timestamp
    casted
    castedWith
    lifted
    liftedWith
    approvals
  }
`

export const GOVERNANCE_INFO_QUERY = gql`
  query GetExecutiveVotesInfo {
    governanceInfo(id: "0x0") {
      countSpells
    }
  }
`

export const VOTES_FIRST_QUERY = gql`
  query GetExecutivesVotesData($executives: Int!) {
    spells(first: $executives) {
      ...executivesDetailPage
    }
  }
  ${executivesDetailFragment}
`
