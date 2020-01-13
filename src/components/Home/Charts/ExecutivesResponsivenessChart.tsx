import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info =
  'The more responsive MKR tokens are, the safer the system is. It gives a good ballpark estimate for how much MKR we can expect to see voting in executive votes and how quickly that MKR will vote.'
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20votes',
  },
]

const ExecutivesResponsivenessChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper info={info} links={links} {...wrapperProps} hideFilters>
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
