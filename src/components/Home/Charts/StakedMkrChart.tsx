import React from 'react'
import { Line, YAxis } from 'recharts'

import { Chart, ChartWrapper } from '../../common'

const StakedMkrChart = ({ wrapperProps, modalProps }) => {
  return (
    <ChartWrapper {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis yAxisId="0" datakey="totalSupply" />

        <Line
          name="Total MKR Supply"
          dataKey="totalSupply"
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#387908"
          strokeWidth={2}
          type="monotone"
          yAxisId="0"
        />

        <Line
          name="Staked MKR "
          dataKey="totalStaked"
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#8889dd"
          strokeWidth={2}
          type="monotone"
          yAxisId="0"
        />

        <Line
          name="Voting MKR"
          dataKey="votingMkr"
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#ff7300"
          strokeWidth={2}
          type="monotone"
          yAxisId="0"
        />

        <Line
          name="Non-Voting MKR"
          dataKey="nonVotingMkr"
          dot={false}
          isAnimationActive={!modalProps.data}
          stroke="#a5d297"
          strokeWidth={2}
          type="monotone"
          yAxisId="0"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default StakedMkrChart
