import React from 'react'
import styled from 'styled-components'
import { Card, TitleContainer } from '../common/styled'

import { getLastYear, getLastWeek, getLastMonth, getLastDay } from '../../utils'
import { LAST_YEAR, LAST_MONTH, LAST_WEEK, LAST_DAY } from '../../constants'

const periodsMap = {
  [LAST_YEAR]: getLastYear,
  [LAST_MONTH]: getLastMonth,
  [LAST_WEEK]: getLastWeek,
  [LAST_DAY]: getLastDay,
}

export const getModalContainer = Content => <Content />

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

export const WrappedContainer = styled.div`
  ${TitleContainer} {
    span {
      font-size: 12px !important;
    }
  }
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  ${Card} {
    flex: 0 0 28%;
    width: 25%;
  }
  @media (max-width: 768px) {
    ${Card} {
      width: 40%;
      flex: unset;
    }
  }
  @media (max-width: 580px) {
    ${Card} {
      width: 100% !important;
      flex: unset;
    }
  }
`
