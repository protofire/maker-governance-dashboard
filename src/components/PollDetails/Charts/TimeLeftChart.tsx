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

const DaysContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  right: 10px;
`

const MinutesHoursContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    flex: 1;
    align-items: center;
    flex-direction: column;
    margin-right: 1rem;
    justify-content: space-between;
  }
`

const ValueContainer = styled.div`
  position: absolute;
  top: ${props => (props.ended ? '50%' : '40%')};
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  left: ${props => (props.ended ? '9.3rem' : '7.6rem')};
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
  return (
    <ChartWrapper hideIcon hideFilters styles={customStyles} {...wrapperProps}>
      <ValueContainer ended={data[0].text === 'Ended'}>
        {data[0].text === 'Ended' ? (
          <span style={{ fontSize: 16 }}>{data[0].text}</span>
        ) : (
          <>
            <DaysContainer>
              {data[0].time.days >= 0 && (
                <>
                  <span>{data[0].time.days}</span>
                  <span>{data[0].time.days === 1 ? 'DAY' : 'DAYS'}</span>
                </>
              )}
            </DaysContainer>
            <MinutesHoursContainer>
              <div>
                {data[0].time.hours >= 0 && (
                  <>
                    <span>{data[0].time.hours}</span>
                    <span>{data[0].time.hours === 1 ? 'HOUR' : 'HOURS'}</span>
                  </>
                )}
              </div>
              <div>
                {data[0].time.minutes >= 0 && (
                  <>
                    <span>{data[0].time.minutes}</span>
                    <span>{data[0].time.minutes === 1 ? 'MINUTE' : 'MINUTES'}</span>
                  </>
                )}
              </div>
            </MinutesHoursContainer>
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
