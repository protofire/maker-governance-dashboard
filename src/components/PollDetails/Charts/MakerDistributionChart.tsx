import React, { useState } from 'react'
import { Line, YAxis } from 'recharts'
import { defaultColors } from './'
import { Chart, ChartWrapper, LegendLi } from '../../common'
import { CustomSvg } from '../../common/Icon'

const info =
  'Shows the historical amount of MKR voting for each option in this poll. This helps track swings in opinion over time, as well as allowing comparison between the ‘Vote Count By Option’ metric.'
const links = [
  {
    title: 'MKR Registry Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
  },
  {
    title: 'MakerDao Governance Graph',
    uri: 'https://thegraph.com/explorer/subgraph/protofire/mkr-registry?query=Account%20balances',
  },
]

const MakerDistributionChart = props => {
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
    <ChartWrapper info={info} links={links} {...wrapperProps} hideFilters>
      <Chart legend={renderLegend} getOpacity={getOpacities} handleLegend={selectLine} scale="point" {...modalProps}>
        <YAxis type="number" domain={[0, 'dataMax']} />
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

export default MakerDistributionChart
