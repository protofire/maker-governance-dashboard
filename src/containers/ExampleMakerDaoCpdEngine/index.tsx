import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import CdpEngineDetail from './CdpEngineDetail'

const cdpEngineDetailFragment = gql`
  fragment CdpEngineDetail on CdpEngine {
    id
    cdpCount
    openCdpCount
    totalCollateral
    totalDebt
    lastBlock
    lastModifiedDate
    cdpOwners
  }
`

const CDP_ENGINE_QUERY = gql`
  query GetCdpEngine {
    cdpEngine(id: "0x0") {
      ...CdpEngineDetail
    }
  }
  ${cdpEngineDetailFragment}
`

const CDP_ENGINE_SUBSCRIPTION = gql`
  subscription CdpEngine {
    cdpEngine(id: "0x0") {
      ...CdpEngineDetail
    }
  }
  ${cdpEngineDetailFragment}
`
function MakerDaoCdpEngine() {
  const { subscribeToMore, ...result } = useQuery(CDP_ENGINE_QUERY)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>ERROR: There was an error trying to fetch data!</div>
  }

  return (
    <CdpEngineDetail
      data={result.data.cdpEngine}
      subscribeToChanges={() =>
        subscribeToMore({
          document: CDP_ENGINE_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => (subscriptionData.data ? subscriptionData.data : prev),
        })
      }
    />
  )
}

export default MakerDaoCdpEngine
