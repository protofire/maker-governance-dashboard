import React from 'react'
import { Line, YAxis } from 'recharts'
import randomColor from 'randomcolor'
import { Chart, ChartWrapper } from '../../common'

const VotersDistributionChart = props => {
  const { wrapperProps, modalProps, options } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis />
        {options.map(option => (
          <Line
            key={option}
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={`${option}`}
            stroke={randomColor()}
            strokeWidth={2}
            type="monotone"
            dataKey={`${option}`}
          />
        ))}
      </Chart>
    </ChartWrapper>
  )
}

export default VotersDistributionChart
