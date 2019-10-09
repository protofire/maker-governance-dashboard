import React from 'react'
import { Bar, Cell, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'

const MkrDistributionPerExecutiveChart = props => {
  const { wrapperProps, modalProps, currentMkr } = props
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps} showXaxis={2}>
        <YAxis />
        <Bar
          isAnimationActive={modalProps.data ? false : true}
          name={`Executive vote - Current ${currentMkr}`}
          dataKey="mkr"
        >
          {modalProps.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isHat ? '#000000' : '#a04827'} />
          ))}
        </Bar>
      </Chart>
    </ChartWrapper>
  )
}

export default MkrDistributionPerExecutiveChart
