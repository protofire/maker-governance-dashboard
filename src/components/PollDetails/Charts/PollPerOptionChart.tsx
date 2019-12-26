import React from 'react'
import { Bar, XAxis, YAxis, Cell } from 'recharts'
import { Chart, ChartWrapper, LegendLi } from '../../common'
import { CustomSvg } from '../../common/Icon'
import { defaultColors } from './'

const PollPerOptionChart = props => {
  const { wrapperProps, modalProps, isVoter, colors } = props
  const chartColors = [...defaultColors, ...colors]

  const info = !isVoter
    ? 'Shows the current or final distribution of voting addresses across the options available in this poll. This gives an intuitive visual depiction of the current or final vote results in terms of addresses.'
    : ' Shows the current or final distribution of MKR voting across the options available in this poll. This gives an intuitive visual depiction of the current or final vote results in terms of MKR.'
  const links = !isVoter
    ? [
        { title: 'MKR Registry', uri: 'asdasd' },
        { title: 'MakerDao Governance', uri: 'asdasd' },
      ]
    : [
        { title: 'MKR Registry', uri: 'asdasd' },
        { title: 'MakerDao Governance', uri: 'asdasd' },
      ]

  const renderLegend = props => {
    const { data } = props
    return (
      <ul className="recharts-default-legend" style={{ listStyleType: 'none' }}>
        {data.map((entry, index) => (
          <LegendLi key={`item-${index}`}>
            <CustomSvg color={chartColors[index]} />
            <span>{entry.label}</span>
          </LegendLi>
        ))}
      </ul>
    )
  }

  return (
    <ChartWrapper info={info} links={links} hideFilters {...wrapperProps}>
      <Chart {...modalProps} legend={renderLegend}>
        {isVoter && <YAxis yAxisId="0" datakey="voter" />}
        {!isVoter && <YAxis yAxisId="1" datakey="mkr" />}
        <XAxis dataKey="label" />
        {isVoter && (
          <Bar
            isAnimationActive={modalProps.data ? false : true}
            name={'Voters'}
            yAxisId="0"
            fill="#61b6b0"
            dataKey="voter"
          >
            {modalProps.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index]} />
            ))}
          </Bar>
        )}
        {!isVoter && (
          <Bar
            isAnimationActive={modalProps.data ? false : true}
            name={'MKR Staked Per Option'}
            yAxisId="1"
            dataKey="mkr"
            stackId="a"
          >
            {modalProps.data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index]} />
            ))}
          </Bar>
        )}
      </Chart>
    </ChartWrapper>
  )
}

export default PollPerOptionChart
