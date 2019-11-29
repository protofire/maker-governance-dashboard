import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const ExecutivesResponsivenessChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'MKR Responsiveness'}
          dataKey="mkr"
          fill="#61b6b0"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default ExecutivesResponsivenessChart
