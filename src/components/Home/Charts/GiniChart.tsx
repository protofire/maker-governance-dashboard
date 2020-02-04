import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = `This tile shows the Gini coefficient (a measure of distribution inequality) of MKR locked in the DSChief governance contract. This allows governance to judge how ‘equal’ the distribution of voting tokens is in the MKR governance ecosystem. <br> For each unique address the total MKR locked into the DSChief is calculated for each date period using the Lock and Free events emitted by the DSChief contract. Then the Gini coefficient is calculated using the distribution of MKR across addresses for each of those date periods. <br> <strong>Note that the Gini coefficient in this metric is calculated on MKR held within DSChief only, not the total distribution.</strong>`
const links = [
  {
    title: 'MakerDAO Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Lock%20and%20Free%20Actions',
  },
]

const GiniChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps}>
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
