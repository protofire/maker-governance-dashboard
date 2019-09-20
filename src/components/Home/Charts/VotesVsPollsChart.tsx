import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotesVsPollsChart = props => {
  const { wrapperProps, modalProps, currentVotes, currentPolls } = props
  return (
    <ChartWrapper {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis yAxisId="0" datakey="countVotes" />
        <YAxis yAxisId="1" datakey="countPolls" orientation="right" />

        <Line
          dot={false}
          name={`Executive Votes - Current ${currentVotes}`}
          stroke="#9227a0"
          strokeWidth={2}
          type="monotone"
          dataKey="countVotes"
          yAxisId="0"
        />
        <Line
          dot={false}
          name={`Polls - Current ${currentPolls}`}
          stroke="#a06d27"
          strokeWidth={2}
          type="monotone"
          dataKey="countPolls"
          yAxisId="1"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotesVsPollsChart
