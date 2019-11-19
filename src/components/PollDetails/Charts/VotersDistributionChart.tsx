import React, { useState } from 'react'
import { Line, YAxis } from 'recharts'
import { defaultColors } from './'
import { Chart, ChartWrapper, LegendLi } from '../../common'
import { CustomSvg } from '../../common/Icon'

const VotersDistributionChart = props => {
  const [selectedLines, setSelectedLine] = useState<any>([])
  const [opacities, setOpacities] = useState({})
  const getOpacities = opacities => setOpacities(opacities)
  const selectLine = e => {
    let selected = selectedLines.includes(e.value)
      ? selectedLines.filter(line => line !== e.value)
      : [...selectedLines, e.value.trim()]
    setSelectedLine(selected)
  }
  const { wrapperProps, modalProps, options, colors } = props
  const chartColors = [...defaultColors, ...colors]

  const renderLegend = props => {
    const { payload, onMouseEnter, onMouseLeave, onClick } = props
    return (
      <ul className="recharts-default-legend" style={{ listStyleType: 'none' }}>
        {payload.map((entry, index) => (
          <LegendLi
            onMouseEnter={() => onMouseEnter(entry)}
            onMouseLeave={() => onMouseLeave(entry)}
            onClick={() => onClick(entry)}
            disabledValue={selectedLines.includes(entry.value)}
            className={`recharts-legend-item legend-item-${index}`}
            key={`item-${index}`}
          >
            <CustomSvg color={entry.color} />
            <span>{entry.value}</span>
          </LegendLi>
        ))}
      </ul>
    )
  }

  return (
    <ChartWrapper {...wrapperProps} hideFilters>
      <Chart legend={renderLegend} getOpacity={getOpacities} handleLegend={selectLine} scale="point" {...modalProps}>
        <YAxis />
        {options.map((option, i) => (
          <Line
            strokeOpacity={opacities[`${option}`]}
            dataKey={selectedLines.length === 0 || !selectedLines.includes(`${option}`) ? `${option}` : ''}
            key={option}
            isAnimationActive={modalProps.data ? false : true}
            dot={false}
            name={`${option}`}
            stroke={chartColors[i]}
            strokeWidth={2}
            type="monotone"
          />
        ))}
      </Chart>
    </ChartWrapper>
  )
}

export default VotersDistributionChart
