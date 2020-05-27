import { GraphQLClient } from 'graphql-request'

const MKR_GOV_DB_URI = process.env.REACT_APP_GOV_DB_HTTP || ''

const client = new GraphQLClient(MKR_GOV_DB_URI)

const POLL_QUERY = /* GraphQL */ `
  query GetPoll($pollId: Int) {
    activePolls(filter: { pollId: { equalTo: $pollId } }) {
      nodes {
        startDate
        endDate
      }
    }
  }
`

export async function getPollDates(pollId) {
  const data = await client.request(POLL_QUERY, { pollId: Number(pollId) })

  return data.activePolls.nodes[0]
}
