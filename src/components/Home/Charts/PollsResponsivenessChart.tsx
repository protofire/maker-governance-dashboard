import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const PollsResponsivenessChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'MKR Responsiveness'}
          dataKey="mkr"
          fill="#a04827"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default PollsResponsivenessChart
