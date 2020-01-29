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
  const { wrapperProps, modalProps, colors, options, isVoter } = props
  const chartColors = [...defaultColors, ...colors]

  const info = isVoter
    ? 'Shows the current or final distribution of voting addresses across the options available in this poll. This gives an intuitive visual depiction of the current or final vote results in terms of addresses.'
    : ' Shows the current or final distribution of MKR voting across the options available in this poll. This gives an intuitive visual depiction of the current or final vote results in terms of MKR.'
  const links = !isVoter
    ? [
        {
          title: 'MakerDAO Governance Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
        },
        {
          title: 'MKR Registry Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/mkr-registry?query=Account%20balances',
        },
      ]
    : [
        {
          title: 'MakerDAO Governance Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/makerdao-governance?query=Polls',
        },
        {
          title: 'MKR Registry Graph',
          uri: 'https://thegraph.com/explorer/subgraph/protofire/mkr-registry?query=Account%20balances',
        },
      ]

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
    <ChartWrapper info={info} links={links} hideFilters {...wrapperProps}>
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
