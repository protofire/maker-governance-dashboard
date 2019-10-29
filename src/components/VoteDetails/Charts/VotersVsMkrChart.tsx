import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const customStyles = {
  padding: 0,
  position: 'relative',
  bottom: '6px',
  paddingBottom: '5px',
}
const VotersVsMkrChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper hideFilters styles={customStyles} {...wrapperProps}>
      <Chart {...modalProps}>
        <YAxis yAxisId="0" datakey="count" />
        <YAxis yAxisId="1" datakey="mkr" orientation="right" />
        <Line
          isAnimationActive={modalProps.data ? false : true}
          dot={false}
          name={'Number of voters'}
          stroke="#2730a0"
          strokeWidth={2}
          type="monotone"
          dataKey="count"
          yAxisId="0"
        />
        <Line
          isAnimationActive={modalProps.data ? false : true}
          dot={false}
          name={'Total MKR staked'}
          stroke="#27a02c"
          strokeWidth={2}
          type="monotone"
          dataKey="mkr"
          yAxisId="1"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default VotersVsMkrChart
