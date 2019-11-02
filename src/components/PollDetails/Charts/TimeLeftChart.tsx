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

const ValueTitleWrapper = styled.div`
  margin: 0 22px 0 0;

  &:last-child {
    margin-right: 0;
  }
`

const ValueRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  margin: 0 0 11px;

  &:last-child {
    margin-bottom: 0;
  }
`

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
  flex-direction: column;
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
  const isEnded: boolean = data[0].text === 'Ended'
  const value = isEnded ? 100 : data[0].value

  return (
    <>
      <span>
        <CardTitle content="Time Left" />
      </span>
      <OuterWrapper>
        <ProgressCircle borderWidth={40} dimensions={250} progress={value}>
          <ValuesWrapper>
            {isEnded ? (
              <MainTitle>{data[0].text}</MainTitle>
            ) : (
              <>
                {data[0].time.days >= 0 && (
                  <ValueRow>
                    <ValueTitleWrapper>
                      <Value>{data[0].time.days}</Value>
                      <Title>{data[0].time.days === 1 ? 'DAY' : 'DAYS'}</Title>
                    </ValueTitleWrapper>
                  </ValueRow>
                )}
                <ValueRow>
                  <>
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
                </ValueRow>
              </>
            )}
          </ValuesWrapper>
        </ProgressCircle>
      </OuterWrapper>
    </>
  )
}

export default TimeLeftChart
