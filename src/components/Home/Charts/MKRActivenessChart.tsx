import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const MKRActivenessChart = props => {
  const { wrapperProps, modalProps } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Line
          isAnimationActive={modalProps.data ? false : true}
          name={'MKR Activeness'}
          dataKey="activeness"
          strokeWidth={2}
          dot={false}
          type="monotone"
          stroke="#61b6b0"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default MKRActivenessChart
