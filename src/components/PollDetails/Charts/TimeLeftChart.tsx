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
  left: ${props => (props.ended ? '9.3rem' : '9.6rem')};
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
    <ChartWrapper hideIcon hideFilters styles={customStyles} {...wrapperProps}>
      <ValueContainer ended={data[0].text === 'Ended'}>
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
        <Pie isAnimationActive={data ? false : true} data={data} innerRadius={100} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartWrapper>
  )
}

export default TimeLeftChart
