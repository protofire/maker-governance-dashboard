import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info =
  'Being able to see the rate of change of votes and polls over time lets us judge the demand on governance over time.'
const links = [
  { title: 'MKR Registry', uri: 'asdasd' },
  { title: 'MakerDao Governance', uri: 'asdasd' },
]

const VotesVsPollsChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper info={info} links={links} {...wrapperProps}>
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
