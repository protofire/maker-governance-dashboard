import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const GiniChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper {...wrapperProps}>
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
