import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotersVsMkrChart = props => {
  const { wrapperProps, modalProps, voters } = props

  const info = !voters
    ? `This tile shows the current and historical amount of MKR staked on this executive proposal. This allows governance to see how MKR has moved in and out of this executive proposal during its history. <br> This metric is generated using the Lock and Free events emitted by the DSChief governance contract which relate to this executive proposal. A running tally of the amount of MKR Locked into and Freed from this executive proposal is kept and the values are displayed with hourly resolution.`
    : 'This tile shows the current and historical number of addresses voting on this executive proposal. This allows governance to see how voters have voted for or against this executive proposal during its history. <br> This metric is generated using the Lock and Free events emitted by the DSChief governance contract which relate to this executive proposal. A running tally of the count of lock and free actions is kept and the values are displayed with hourly resolution.'
  const links = !voters
    ? [
        {
          title: 'MakerDAO Governance Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20vote',
        },
      ]
    : [
        {
          title: 'MakerDAO Governance Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20vote',
        },
      ]

  return (
    <ChartWrapper markdown info={info} links={links} hideFilters {...wrapperProps}>
      <Chart {...modalProps}>
        {voters ? <YAxis yAxisId="0" datakey="count" /> : <YAxis yAxisId="1" datakey="mkr" orientation="right" />}
        {voters ? (
          <Line
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={'Number of Voters'}
            stroke="#2730a0"
            strokeWidth={2}
            type="monotone"
            dataKey="count"
            yAxisId="0"
          />
        ) : (
          <Line
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={'Total MKR Staked'}
            stroke="#27a02c"
            strokeWidth={2}
            type="monotone"
            dataKey="mkr"
            yAxisId="1"
          />
        )}
      </Chart>
    </ChartWrapper>
  )
}

export default VotersVsMkrChart
