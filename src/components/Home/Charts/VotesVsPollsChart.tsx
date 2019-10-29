import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotesVsPollsChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis datakey="countPolls" />

        <Line
          isAnimationActive={modalProps.data ? false : true}
          dot={false}
          name={'Executive Votes'}
          stroke="#9227a0"
          strokeWidth={2}
          type="monotone"
          dataKey="countVotes"
        />
        <Line
          isAnimationActive={modalProps.data ? false : true}
          dot={false}
          name={'Polls'}
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
