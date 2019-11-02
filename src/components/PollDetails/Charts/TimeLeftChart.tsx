import React from 'react'
import styled from 'styled-components'
import { CardTitle } from '../../common'
import ProgressCircle from '../../common/ProgressCircle'

const Value = styled.p`
  color: #000;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.18;
  margin: 0;
  text-align: center;
`

const Title = styled.h4`
  color: #999;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.18;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
`

const ValueTitleWrapper = styled.div``

const OuterWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  margin-top: auto;
`

const ValuesWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
  z-index: 10;
`

const MainTitle = styled.h2`
  color: #000;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
`

const TimeLeftChart = props => {
  const { data } = props

  console.log(data[0])
  console.log('xxxxx')
  console.log(+data.value)

  return (
    <>
      <span>
        <CardTitle content="Time Left" />
      </span>
      <OuterWrapper>
        <ProgressCircle borderWidth={40} dimensions={250} progress={+data.value}>
          <ValuesWrapper>
            {data[0].text === 'Ended' ? (
              <MainTitle>{data[0].text}</MainTitle>
            ) : (
              <>
                {data[0].time.days >= 0 && (
                  <ValueTitleWrapper>
                    <Value>{data[0].time.days}</Value>
                    <Title>{data[0].time.days === 1 ? 'DAY' : 'DAYS'}</Title>
                  </ValueTitleWrapper>
                )}
                {data[0].time.hours >= 0 && (
                  <ValueTitleWrapper>
                    <Value>{data[0].time.hours}</Value>
                    <Title>{data[0].time.hours === 1 ? 'HOUR' : 'HOURS'}</Title>
                  </ValueTitleWrapper>
                )}
                {data[0].time.minutes >= 0 && (
                  <ValueTitleWrapper>
                    <Value>{data[0].time.minutes}</Value>
                    <Title>{data[0].time.minutes === 1 ? 'MINUTE' : 'MINUTES'}</Title>
                  </ValueTitleWrapper>
                )}
              </>
            )}
          </ValuesWrapper>
        </ProgressCircle>
      </OuterWrapper>
    </>
  )
}

export default TimeLeftChart
