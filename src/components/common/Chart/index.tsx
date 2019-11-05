import React from 'react'
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
  font-size: 14px;

  ${Legend} {
    ul {
      font-size: 10px;
      font-weight: 600;
      color: #666;
    }
  }
`
const ChartComponent = React.memo(function Chart(props: any) {
  const { data, width, height, children, modalStyles, xLabel, showXaxis, legend, scale } = props
  return (
    <>
      <ChartContainer {...modalStyles}>
        <ComposedChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xLabel || 'label'}
            interval={showXaxis >= 0 ? showXaxis : 'preserveEnd'}
            scale={scale || 'auto'}
            tick={{ fill: '#cccccc', fontSize: 10 }}
          />
          <Tooltip />
          <Legend data={data} content={legend} iconType="rect" align="left" verticalAlign="bottom" />
          {children}
        </ComposedChart>
      </ChartContainer>
    </>
  )
})

export default ChartComponent
