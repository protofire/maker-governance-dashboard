import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotersVsMkrChart = props => {
  const { wrapperProps, modalProps, voters } = props

  return (
    <ChartWrapper hideFilters {...wrapperProps}>
      <Chart {...modalProps}>
        {voters ? <YAxis yAxisId="0" datakey="count" /> : <YAxis yAxisId="1" datakey="mkr" orientation="right" />}
        {voters ? (
          <Line
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={'Number of Voters'}
            stroke="#2730a0"
            strokeWidth={2}
            type="monotone"
            dataKey="count"
            yAxisId="0"
          />
        ) : (
          <Line
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={'Total MKR Staked'}
            stroke="#27a02c"
            strokeWidth={2}
            type="monotone"
            dataKey="mkr"
            yAxisId="1"
          />
        )}
      </Chart>
    </ChartWrapper>
  )
}

export default VotersVsMkrChart
