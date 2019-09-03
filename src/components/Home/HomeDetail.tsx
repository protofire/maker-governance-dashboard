import React, { useEffect } from 'react'
import { mockedData } from '../../utils' //This is only for testing
import { GetGovernanceInfo_governanceInfo } from '../../types/generatedGQL'
import { Card } from '../common/styled'
import Chart from '../common/Chart'

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
    <Card style={{ height: 300 }}>
      <h2>This is the chart title</h2>

      <Chart width={500} height={400} data={mockedData} />
    </Card>
  )
}

export default HomeDetail
