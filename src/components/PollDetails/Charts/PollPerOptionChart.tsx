import React from 'react'
import { Bar, XAxis, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const PollPerOptionChart = props => {
  const { wrapperProps, modalProps, currentVoters, currentMkr } = props
  return (
    <ChartWrapper hideFilters {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis yAxisId="0" datakey="voter" />
        <YAxis yAxisId="1" datakey="mkr" orientation="right" />
        <XAxis dataKey="label" />
        <Bar name={`Voters - Current ${currentVoters}`} yAxisId="0" dataKey="voter" stackId="a" fill="#61b6b0" />
        <Bar
          name={`MKR Staked Per Option - Current ${currentMkr}`}
          yAxisId="1"
          dataKey="mkr"
          stackId="a"
          fill="#ededed"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default PollPerOptionChart
