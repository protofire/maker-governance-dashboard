import React from 'react'
import styled from 'styled-components'
import { ComposedChart, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select } from '../styled'

type Props = {
  data: Array<any>
  children: React.ReactNode
  width: Number
  height: Number
  modalStyles?: Object
  xLabel?: string
}

const ChartTitleContainer = styled.div`
  display: flex;
  font-size: 14px;
  flex-direction: row;
  flex: 1;
  span {
    margin-right: 5px;
  }
`
const Versus = styled.span`
  color: #bbbbbb;
`

const Separator = styled(Versus)`
  margin-right: 0;
`

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
      <span>{content}</span>
      {versus && <Versus>vs</Versus>}
      {versus && <span>{versus}</span>}
      <Separator>&middot;</Separator>
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
function Chart(props: Props) {
  const { data, width, height, children, modalStyles, xLabel } = props

  return (
    <>
      <ChartContainer {...modalStyles}>
        <ComposedChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis tick={{ fill: '#cccccc', fontSize: 10 }} dataKey={xLabel || 'label'} />
          <Tooltip />
          <Legend iconType="rect" align="left" verticalAlign="bottom" />
          {children}
        </ComposedChart>
      </ChartContainer>
    </>
  )
}

export default Chart
