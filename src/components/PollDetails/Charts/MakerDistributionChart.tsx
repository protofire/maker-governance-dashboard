import React from 'react'
import { Line, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const MakerDistributionChart = props => {
  const { wrapperProps, modalProps, options, colors } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax + 1000']} />
        {options.map((option, i) => (
          <Line
            key={option}
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={`${option}`}
            stroke={colors[i]}
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
