import React, { useState } from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotersVsMkrChart = props => {
  const [opacities, setOpacities] = useState({ count: 1, mkr: 1 })
  const { wrapperProps, modalProps } = props
  const getOpacities = opacities => setOpacities(opacities)
  return (
    <ChartWrapper {...wrapperProps}>
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
