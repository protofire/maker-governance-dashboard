import React, { useState } from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const info = `This tile shows participation in MKR governance over time. This gives governance a general overview of the state of the system in terms of both MKR and address engagement.<br> Total MKR Staked is calculated by summing the MKR locked in the DSChief governance contract (denoted by the emitted Lock event) and subtracting the MKR unlocked from the DSChief governance contract (denoted by the emitted Free event.) <br> Number of voters is calculated by summing all uniques voting addresses in DSChief and displaying the summed value at each date on the graph. <br> <strong>Note that this tile does not track decreases as voting addresses withdraw their MKR from DSChief.</strong>`
const links = [
  {
    title: 'MKR Registry Graph',
    uri:
      'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Lock%2C%20Free%20and%20Voters%20Actions',
  },
]

const VotersVsMkrChart = props => {
  const [opacities, setOpacities] = useState({ count: 1, mkr: 1 })
  const { wrapperProps, modalProps } = props
  const getOpacities = opacities => setOpacities(opacities)
  return (
    <ChartWrapper markdown info={info} links={links} {...wrapperProps}>
      <Chart getOpacity={getOpacities} {...modalProps}>
        <YAxis yAxisId="0" datakey="count" />
        <YAxis yAxisId="1" datakey="mkr" orientation="right" />
        <Line
          strokeOpacity={opacities.count}
          dataKey="count"
          dot={false}
          isAnimationActive={modalProps.data ? false : true}
          name={'Number of Voters'}
          stroke="#2730a0"
          strokeWidth={2}
          type="monotone"
          yAxisId="0"
        />
        <Line
          dataKey="mkr"
          strokeOpacity={opacities.mkr}
          dot={false}
          isAnimationActive={modalProps.data ? false : true}
          name={'Total MKR Staked'}
          stroke="#27a02c"
          strokeWidth={2}
          type="monotone"
          yAxisId="1"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotersVsMkrChart
