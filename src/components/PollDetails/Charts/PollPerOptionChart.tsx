import React, { useState } from 'react'
import { Bar, YAxis } from 'recharts'
import { Chart, ChartWrapper, LegendLi } from '../../common'
import { CustomSvg } from '../../common/Icon'
import { defaultColors } from './'

const PollPerOptionChart = props => {
  const [selectedLines, setSelectedLine] = useState<any>([])
  const [opacities, setOpacities] = useState({})
  const getOpacities = opacities => setOpacities(opacities)
  const selectLine = e => {
    let selected = selectedLines.includes(e.value)
      ? selectedLines.filter(line => line !== e.value)
      : [...selectedLines, e.value.trim()]
    setSelectedLine(selected)
  }
  const { wrapperProps, modalProps, colors, options } = props
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
    <ChartWrapper hideFilters {...wrapperProps}>
      <Chart {...modalProps} legend={renderLegend} setOpacity={getOpacities} handleLegend={selectLine}>
        <YAxis />
        {options.map((entry, index) => (
          <Bar
            strokeOpacity={opacities[`${entry}`]}
            isAnimationActive={modalProps.data ? false : true}
            key={entry}
            name={`${entry}`}
            fill={chartColors[index]}
            dataKey={selectedLines.length === 0 || !selectedLines.includes(`${entry}`) ? `${entry}` : ''}
          />
        ))}
      </Chart>
    </ChartWrapper>
  )
}

export default PollPerOptionChart
