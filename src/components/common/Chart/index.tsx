import React from 'react'
import styled from 'styled-components'
import { ComposedChart, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, Separator, Versus, ChartTitleContainer } from '../styled'

type Props = {
  data: Array<any>
  children: React.ReactNode
  width: Number
  height: Number
  modalStyles?: Object
  xLabel?: string
}

const SelectContainer = styled(Select)`
  color: #00ba9c;
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

export const ChartTitle = props => {
  const { content, versus, children } = props
  return (
    <ChartTitleContainer>
      <div>
        <span>{content}</span>
        {versus && <Versus>vs</Versus>}
        {versus && <span>{versus}</span>}
        <Separator>&middot;</Separator>
      </div>
      {children}
    </ChartTitleContainer>
  )
}

const ChartContainer = styled(ResponsiveContainer)`
  font-size: 14px;
  ${Legend} {
    ul {
      font-size: 10px;
      font-weight: 600;
      color: #666666;
    }
  }
`
const ChartComponent = React.memo(function Chart(props: any) {
  const { data, width, height, children, modalStyles, xLabel, showXaxis, legend } = props
  return (
    <>
      <ChartContainer {...modalStyles}>
        <ComposedChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            interval={showXaxis ? showXaxis : 'preserveEnd'}
            tick={{ fill: '#cccccc', fontSize: 10 }}
            dataKey={xLabel || 'label'}
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
