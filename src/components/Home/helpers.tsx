import React from 'react'
import styled from 'styled-components'
import { IconContainer, TitleContainer, CloseIcon, TableTitle, ChartTitle, Card } from '../common'

import { getLastYear, getLastWeek, getLastMonth, getLastDay } from '../../utils'
import { LAST_YEAR, LAST_MONTH, LAST_WEEK, LAST_DAY } from '../../constants'

const periodsMap = {
  [LAST_YEAR]: getLastYear,
  [LAST_MONTH]: getLastMonth,
  [LAST_WEEK]: getLastWeek,
  [LAST_DAY]: getLastDay,
}

export const filters = [
  { label: 'Last year', value: LAST_YEAR },
  { label: 'Last month', value: LAST_MONTH },
  { label: 'Last week', value: LAST_WEEK },
  { label: 'Last day', value: LAST_DAY },
]

export const getIconContainer = (Component, data, cb, isChart = false) => {
  return (
    <IconContainer onClick={() => cb(data, isChart)}>
      <Component />
    </IconContainer>
  )
}

export const getModalContainer = (type, Content, title, props, closeCallback) => {
  const Title = type === 'table' ? TableTitle : ChartTitle
  return (
    <>
      <TitleContainer>
        <Title>{title}</Title>
        <IconContainer onClick={() => closeCallback(false)}>
          <CloseIcon />
        </IconContainer>
      </TitleContainer>
      <Content {...props} />
    </>
  )
}

export const getGraphData1 = (data: Array<any>, time: string): Array<any> => {
  const periods = periodsMap[time]
  return periods().map(el => {
    return {
      ...el,
      count: data.filter(d => {
        return d.timestamp >= el.from && d.timestamp <= el.to
      }).length,
      mkr: 0,
    }
  })
}

export const defaultFilters = {
  chart1: LAST_YEAR,
}

export const ViewAll = styled.span`
  font-size: 12px;
  color: #00ba9c;
`

export const WrappedContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  ${Card} {
    width: 25%;
  }
  @media (max-width: 768px) {
    ${Card} {
      width: 40%;
    }
  }
  @media (max-width: 580px) {
    ${Card} {
      width: 100% !important;
    }
  }
`
