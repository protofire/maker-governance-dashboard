import React from 'react'
import { Bar, Cell, YAxis } from 'recharts'
import { Chart, ChartWrapper } from '../../common'
import { CustomSvg } from '../../common/Icon'

const renderLegend = props => {
  const { payload } = props
  return (
    <ul style={{ listStyleType: 'none' }}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`}>
          <CustomSvg color="#a04827" />
          <span>{entry.value}</span>
        </li>
      ))}
      <li key="item-hat">
        <CustomSvg color="#000000" />
        <span>Current Hat</span>
      </li>
    </ul>
  )
}

const MkrDistributionPerExecutiveChart = props => {
  const { wrapperProps, modalProps } = props
  const maxValue = Math.max(...modalProps.data.map(o => o.mkr), 0)
  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart {...modalProps} showXaxis={3} legend={renderLegend}>
        <YAxis style={{ fontSize: '12px' }} type="number" domain={[0, maxValue]} />
        <Bar isAnimationActive={modalProps.data ? false : true} name={'Executive vote'} dataKey="mkr">
          {modalProps.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.isHat ? '#000000' : '#a04827'} />
          ))}
        </Bar>
      </Chart>
    </ChartWrapper>
  )
}

export default MkrDistributionPerExecutiveChart
