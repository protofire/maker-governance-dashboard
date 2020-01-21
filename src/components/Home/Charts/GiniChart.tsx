import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info =
  'Allows us to keep track of how ‘fair’ the distribution of voting tokens is in the MKR governance ecosystem.'
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Lock%20and%20Free%20Actions',
  },
]

const GiniChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper info={info} links={links} {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis />
        <Line
          isAnimationActive={modalProps.data ? false : true}
          dot={false}
          name={'Gini Coefficient'}
          stroke="#ffc353"
          strokeWidth={2}
          type="monotone"
          dataKey="gini"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default GiniChart
