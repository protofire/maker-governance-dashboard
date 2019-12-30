import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const VotersVsMkrChart = props => {
  const { wrapperProps, modalProps, voters } = props

  const info = !voters
    ? 'Informs governance as to the current and historical amount of MKR staked on this executive vote.'
    : 'Informs governance as to the current and historical number of voting addresses on this executive vote.'
  const links = !voters
    ? [
        {
          title: 'MakerDao Governance Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20vote',
        },
      ]
    : [
        {
          title: 'MakerDao Governance Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Executive%20vote',
        },
      ]

  return (
    <ChartWrapper info={info} links={links} hideFilters {...wrapperProps}>
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
