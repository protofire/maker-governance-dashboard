import React from 'react'
import { Line, YAxis } from 'recharts'
import { defaultColors } from './'
import { Chart, ChartWrapper } from '../../common'

const MakerDistributionChart = props => {
  const { wrapperProps, modalProps, options, colors } = props
  const chartColors = [...defaultColors, ...colors]
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart scale="point" {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
        {options.map((option, i) => (
          <Line
            key={option}
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={`${option}`}
            stroke={chartColors[i]}
            strokeWidth={2}
            type="monotone"
            dataKey={`${option}`}
          />
        ))}
      </Chart>
    </ChartWrapper>
  )
}

export default MakerDistributionChart
