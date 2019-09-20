import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotesVsPollsChart = props => {
  const { wrapperProps, modalProps, currentVotes, currentPolls } = props
  return (
    <ChartWrapper {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis datakey="countPolls" />

        <Line
          dot={false}
          name={`Executive Votes - Current ${currentVotes}`}
          stroke="#9227a0"
          strokeWidth={2}
          type="monotone"
          dataKey="countVotes"
        />
        <Line
          dot={false}
          name={`Polls - Current ${currentPolls}`}
          stroke="#a06d27"
          strokeWidth={2}
          type="monotone"
          dataKey="countPolls"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotesVsPollsChart
