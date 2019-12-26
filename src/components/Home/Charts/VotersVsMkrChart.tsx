import React, { useState } from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = 'Gives a general overview of the state of the system in terms of both token and address engagement.'
const links = [
  { title: 'MKR Registry', uri: 'asdasd' },
  { title: 'MakerDao Governance', uri: 'asdasd' },
]

const VotersVsMkrChart = props => {
  const [opacities, setOpacities] = useState({ count: 1, mkr: 1 })
  const { wrapperProps, modalProps } = props
  const getOpacities = opacities => setOpacities(opacities)
  return (
    <ChartWrapper info={info} links={links} {...wrapperProps}>
      <Chart getOpacity={getOpacities} {...modalProps}>
        <YAxis yAxisId="0" datakey="count" />
        <YAxis yAxisId="1" datakey="mkr" orientation="right" />
        <Line
          strokeOpacity={opacities.count}
          dataKey="count"
          dot={false}
          isAnimationActive={modalProps.data ? false : true}
          name={'Number of Voters'}
          stroke="#2730a0"
          strokeWidth={2}
          type="monotone"
          yAxisId="0"
        />
        <Line
          dataKey="mkr"
          strokeOpacity={opacities.mkr}
          dot={false}
          isAnimationActive={modalProps.data ? false : true}
          name={'Total MKR Staked'}
          stroke="#27a02c"
          strokeWidth={2}
          type="monotone"
          yAxisId="1"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotersVsMkrChart
