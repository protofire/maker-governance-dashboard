import React from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const TimeTakenChart = props => {
  const { wrapperProps, modalProps } = props

  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={'Executive Vote Count'}
          dataKey="count"
          fill="#61b6b0"
        />
      </Chart>
    </ChartWrapper>
  )
}

export default TimeTakenChart
