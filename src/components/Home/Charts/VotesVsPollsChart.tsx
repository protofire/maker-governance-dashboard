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
          dataKey="countVotes"
          dot={false}
          isAnimationActive={modalProps.data ? false : true}
          name={'Executive Votes'}
          stroke="#9227a0"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="countPolls"
          dot={false}
          isAnimationActive={modalProps.data ? false : true}
          name={'Polls'}
          stroke="#a06d27"
          strokeWidth={2}
          type="monotone"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotesVsPollsChart
