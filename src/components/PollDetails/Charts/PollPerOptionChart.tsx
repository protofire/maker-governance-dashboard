import React from 'react'
import { Bar, XAxis, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const PollPerOptionChart = props => {
  const { wrapperProps, modalProps, isVoter } = props
  return (
    <ChartWrapper hideFilters {...wrapperProps}>
      <Chart {...modalProps}>
        {isVoter && <YAxis yAxisId="0" datakey="voter" />}
        {!isVoter && <YAxis yAxisId="1" datakey="mkr" />}
        <XAxis dataKey="label" />
        {isVoter && (
          <Bar
            isAnimationActive={modalProps.data ? false : true}
            name={'Voters'}
            yAxisId="0"
            dataKey="voter"
            stackId="a"
            fill="#61b6b0"
          />
        )}
        {!isVoter && (
          <Bar
            isAnimationActive={modalProps.data ? false : true}
            name={'MKR Staked Per Option'}
            yAxisId="1"
            dataKey="mkr"
            stackId="a"
            fill="#999999"
          />
        )}
      </Chart>
    </ChartWrapper>
  )
}

export default PollPerOptionChart
