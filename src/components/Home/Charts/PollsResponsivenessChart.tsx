import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = `This tile shows how much MKR reacts within the first x days of a poll going live on-chain. The more responsive MKR tokens are, the safer the system is. It gives a good ballpark estimate for how much MKR we can expect to see voting in polls and how quickly that MKR will vote. <br> This metric is calculated by collecting all the MKR that voted for each poll and grouping it by the amount of time passed from the creation of the poll and the vote action. These values are divided by the number of polls to create an average. These averages are displayed in buckets of one day and displayed. <br> To give an example, a value of 20,000 MKR in the 0-1 day bucket should be read as ‘on average, 20,000 MKR can be expected to vote in the first 24 hours after a poll’s creation’.`
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
  },
  {
    title: 'MKR Registry Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/mkr-registry?query=Account%20balances',
  },
]

const PollsResponsivenessChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'MKR Responsiveness'}
          dataKey="mkr"
          fill="#a04827"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default PollsResponsivenessChart
