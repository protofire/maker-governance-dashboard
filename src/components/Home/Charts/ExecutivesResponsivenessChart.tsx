import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = `This tile shows how much MKR reacts within the first x days of an executive proposal going live on-chain. The more responsive MKR tokens are, the safer the system is. It gives a good ballpark estimate for how much MKR we can expect to see voting in executive proposal and how quickly that MKR will vote. <br><br> This metric is calculated by collecting all the MKR that voted for each executive and grouping it by the amount of time passed from the creation of the executive proposal and the vote action. Any MKR locked into DSChief by an address that is actively voting is counted separately in the appropriate bucket based on the time elapsed between the lock and the proposal going live. The sum of each bucket is divided by the number of executive proposals to create an average. These averages are displayed for each bucket. <br><br> To give an example, a value of 20,000 MKR in the 0-1 day bucket should be read as ‘on average, 20,000 MKR can be expected to vote in the first 24 hours after an executive proposal’s creation’. <br><br> <strong>Note that this metric does not filter out MKR moving between different wallets and voting twice from different addresses. This is expected to have only a limited effect on the accuracy of these averages.</strong>`
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
  },
]

const ExecutivesResponsivenessChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'MKR Responsiveness'}
          dataKey="mkr"
          fill="#61b6b0"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default ExecutivesResponsivenessChart
