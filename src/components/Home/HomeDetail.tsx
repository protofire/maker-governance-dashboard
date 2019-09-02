import React, { useEffect } from 'react'

import { GetGovernanceInfo_governanceInfo } from '../../types/generatedGQL'

type Props = {
  data: GetGovernanceInfo_governanceInfo
  subscribeToChanges: () => void
}

function HomeDetail(props: Props) {
  const { data, subscribeToChanges } = props

  useEffect(() => {
    subscribeToChanges()
  })

  return (
    <div className="home-governance--container">
      <p>Total voters: {data.countVoters}</p>
      <p>Total MKR locked: {Number(data.locked).toFixed(2)}</p>
      <p>Last block: {data.lastBlock}</p>
    </div>
  )
}

export default HomeDetail
