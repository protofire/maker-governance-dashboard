import React, { useEffect } from 'react'
import styled from 'styled-components'

import { GetGovernanceInfo_governanceInfo } from '../../types/generatedGQL'

type Props = {
  data: GetGovernanceInfo_governanceInfo
  subscribeToChanges: () => void
}
const HomeContainer = styled.div`
  margin: 20px;
`
function HomeDetail(props: Props) {
  const { data, subscribeToChanges } = props

  useEffect(() => {
    subscribeToChanges()
  })

  return (
    <HomeContainer>
      <h2>Dashboard</h2>
      <p>Total voters: {data.countVoters}</p>
      <p>Total MKR locked: {Number(data.locked).toFixed(2)}</p>
      <p>Last block: {data.lastBlock}</p>
    </HomeContainer>
  )
}

export default HomeDetail
