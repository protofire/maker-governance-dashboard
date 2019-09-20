import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotersVsMkrChart = props => {
  const { wrapperProps, modalProps, currentVoters, currentMkr } = props
  return (
    <ChartWrapper {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis yAxisId="0" datakey="count" />
        <YAxis yAxisId="1" datakey="mkr" orientation="right" />

        <Line
          dot={false}
          name={`Number of voters - Current ${currentVoters}`}
          stroke="#2730a0"
          strokeWidth={2}
          type="monotone"
          dataKey="count"
          yAxisId="0"
        />
        <Line
          dot={false}
          name={`Total MKR stacked - Current ${currentMkr}`}
          stroke="#27a02c"
          strokeWidth={2}
          type="monotone"
          dataKey="mkr"
          yAxisId="1"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotersVsMkrChart
