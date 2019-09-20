import gql from 'graphql-tag'

const executivesDetailFragment = gql`
  fragment executivesDetail on Spell {
    id
    timestamp
    casted
    castedWith
    lifted
    liftedWith
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
      ...executivesDetail
    }
  }
  ${executivesDetailFragment}
`
