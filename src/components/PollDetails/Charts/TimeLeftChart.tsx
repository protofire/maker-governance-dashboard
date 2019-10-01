import React from 'react'
import styled from 'styled-components'

import { Pie, PieChart, Cell } from 'recharts'
import { ChartWrapper } from '../../common'

const customStyles = {
  padding: 0,
  position: 'relative',
  bottom: '6px',
}
const COLORS = ['#61b6b0', '#ededed']

const ValueContainer = styled.div`
  position: absolute;
  top: 50%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  left: 9.6rem;
  span:first-child {
    color: #000000;
    font-size: 26px;
    font-weight: 600;
  }
  span:nth-child(2) {
    color: #999999;
    font-size: 12px;
  }
`

const TimeLeftChart = props => {
  const { wrapperProps, data } = props
  const number = data ? data[0].text.split(' ')[0] : 0
  const unit = data ? data[0].text.split(' ')[1] : 'days'
  return (
    <ChartWrapper styles={customStyles} {...wrapperProps}>
      {console.log(data)}
      <ValueContainer>
        {data[0].text === 'Ended' ? (
          <span style={{ fontSize: 16 }}>{data[0].text}</span>
        ) : (
          <>
            <span>{number}</span>
            <span>{unit.toUpperCase()}</span>
          </>
        )}
      </ValueContainer>
      <PieChart width={300} height={300}>
        <Pie data={data} innerRadius={100} dataKey="value">
          <text textAnchor="middle" fill={'red'}>
            {'jefucho'}
          </text>

          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartWrapper>
  )
}

export default TimeLeftChart
