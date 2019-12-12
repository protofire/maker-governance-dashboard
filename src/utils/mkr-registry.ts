import { GraphQLClient } from 'graphql-request'

const MKR_API_URI = process.env.REACT_APP_MKR_GRAPH_HTTP || ''
const TOKEN_ADDRESS = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'

const client = new GraphQLClient(MKR_API_URI)

const EVENT_COUNT_QUERY = `
{
  data: token(id: "${TOKEN_ADDRESS}") {
    eventCount
    burnEventCount
    mintEventCount
    transferEventCount
  }
}
`

const BURN_EVENT_QUERY = `
{
  burnEvents(first: $pageSize, skip: $offset) {
    timestamp
    amount
  }
}
`

const MINT_EVENT_QUERY = `
{
  mintEvents(first: $pageSize, skip: $offset) {
    timestamp
    amount
  }
}
`

export async function getMkrBurnEvents(pageSize = 1000) {
  const { data } = await client.request(EVENT_COUNT_QUERY)
  const pages = Math.ceil(data.burnEventCount / pageSize)
  const events = await fetchPages(BURN_EVENT_QUERY, pages, pageSize)

  return events.reduce((result, { mintEvents }) => [...result, ...mintEvents], [])
}

export async function getMkrMintEvents(pageSize = 1000) {
  const { data } = await client.request(EVENT_COUNT_QUERY)
  const pages = Math.ceil(data.mintEventCount / pageSize)
  const events = await fetchPages(MINT_EVENT_QUERY, pages, pageSize)

  return events.reduce((result, { mintEvents }) => [...result, ...mintEvents], [])
}

async function fetchPages(query: string, pages: number, pageSize: number) {
  return Promise.all(
    Array.from(Array(pages).keys()).map(page => client.request(query, { pageSize, offset: page * pageSize })),
  )
}
