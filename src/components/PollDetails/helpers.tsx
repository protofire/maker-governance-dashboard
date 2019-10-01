import styled from 'styled-components'
import { fromUnixTime, format, formatDistanceToNow, formatDistanceStrict } from 'date-fns'
import { Card, TitleContainer } from '../common/styled'

import { shortenAccount, timeLeft } from '../../utils'

import { LAST_YEAR } from '../../constants'

export const TableContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 12px;
`

export const Container = styled(TitleContainer)`
  flex: 0;
  padding-left: 1.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.5rem;
`

export const TableRow = styled.div`
  display: flex;
  flex: 1;
  padding: 0.25rem 1.5rem;
  align-items: center;
  justify-content: space-between;
  &:nth-child(odd) {
    background-color: #fafafa;
  }
`

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
export const defaultFilters = {
  votersVsMkr: LAST_YEAR,
}

export const getPollTableData = poll => {
  return [
    { value: shortenAccount(poll.source.toLowerCase()), label: 'Source' },
    { value: format(fromUnixTime(poll.startDate), 'P'), label: 'Started' },
    { value: !poll.active ? 'Yes' : 'No', label: 'Voted' },
    { value: !poll.active ? 'Yes' : 'No', label: 'Ended' },
    { value: !poll.active ? 'Closed' : 'Active', label: 'Status' },
    { value: formatDistanceToNow(fromUnixTime(poll.startDate), { addSuffix: false }), label: 'Time opened' },
  ]
}

export const getTimeLeftData = (start, end): Array<any> => {
  const ended = timeLeft(end) === 'Ended'
  const endedTotal = formatDistanceStrict(fromUnixTime(start), fromUnixTime(end), {
    unit: 'day',
  })
  const total = Number(endedTotal.split(' ')[0])
  const leftTime = formatDistanceStrict(new Date(), fromUnixTime(end))

  const number: any = leftTime.split(' ')[0]
  const unit = leftTime.split(' ')[1]

  const hasMinutes = unit.includes('minutes')
  const hasHours = unit.includes('hours')

  if (ended) return [{ value: total, text: 'Ended' }, { value: 0 }]
  if (hasMinutes) return [{ value: total - Number(number / (24 * 60)), text: leftTime }, { value: total }]
  if (hasHours) return [{ value: total - Number(number / 24), text: leftTime }, { value: total }]
  return [{ value: total - Number(number), text: leftTime }, { value: total }]
}

export const getComponentData = (
  type: string,
  component: string,
  content: string,
  expanded: boolean,
  versus = undefined,
) => {
  return {
    type,
    component,
    content,
    expanded,
    versus,
  }
}
