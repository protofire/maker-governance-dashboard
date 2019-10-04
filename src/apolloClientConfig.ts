import { ApolloClient } from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

import introspectionQueryResultData from './fragmentTypes.json'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

// Create an http link:
const httpLinkApp = new HttpLink({
  uri: process.env.REACT_APP_GRAPH_HTTP,
})

// Create another http link:
const httpLinkTokenRegistry = new HttpLink({
  uri: process.env.REACT_APP_TOKEN_REGISTRY_GRAPH_HTTP,
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  operation => operation.getContext().clientName === 'tokenRegistry',
  httpLinkTokenRegistry,
  httpLinkApp,
)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({ fragmentMatcher }),
})
