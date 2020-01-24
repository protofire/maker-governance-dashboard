import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ComposedChart, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select } from '../styled'

const SelectContainer = styled(Select)`
  color: ${props => props.theme.colors.primary};
`

export const ChartSelect = props => {
  const { onChange, value, values } = props

  return (
    <SelectContainer value={value} onChange={onChange}>
      {values.map(el => (
        <option key={el.value} value={el.value}>
          {el.label}
        </option>
      ))}
    </SelectContainer>
  )
}

const ChartContainer = styled(ResponsiveContainer)`
  font-size: 12px;

  ${Legend} {
    ul {
      font-size: 10px;
      font-weight: 600;
      color: #666;
    }
  }
`

const ChartComponent = React.memo(function Chart(props: any) {
  const {
    data,
    width,
    height,
    children,
    modalStyles,
    xLabel,
    showXaxis,
    legend,
    scale,
    barGap,
    handleLegend,
    getOpacity,
  } = props

  const setInitialOpacity = legends => {
    const opacities = legends.reduce(
      (accum, legend) => ({
        ...accum,
        [legend]: 1,
      }),
      {},
    )
    getOpacity && getOpacity(opacities)
    return opacities
  }
  const legends = Object.keys(data[0])
  const [opacity, setOpacity] = useState(setInitialOpacity(legends))

  useEffect(() => {
    getOpacity && getOpacity(opacity)
  }, [opacity, getOpacity])
  const handleMouseEnter = o => {
    const { dataKey } = o
    setOpacity(current => ({ ...current, [dataKey]: 0.5 }))
  }

  const handleMouseLeave = o => {
    const { dataKey } = o
    setOpacity(current => ({ ...current, [dataKey]: 1 }))
  }
  return (
    <>
      {console.log('asepxia', barGap)}

      <ChartContainer {...modalStyles}>
        <ComposedChart barGap={barGap || -20} width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xLabel || 'label'}
            interval={showXaxis >= 0 ? showXaxis : 'preserveEnd'}
            scale={scale || 'auto'}
            tick={{ fill: '#cccccc', fontSize: 10 }}
          />
          <Tooltip />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleLegend}
            data={data}
            content={legend}
            iconType="rect"
            align="left"
            verticalAlign="bottom"
          />
          {children}
        </ComposedChart>
      </ChartContainer>
    </>
  )
})

export default ChartComponent
