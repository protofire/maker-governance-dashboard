import styled from 'styled-components'
import { fromUnixTime, differenceInSeconds, format, formatDistanceToNow } from 'date-fns'

import { shortenAccount } from '../../utils'
import { Card, TitleContainer } from '../common/styled'
import { LAST_YEAR } from '../../constants'

export const getVoteTableData = vote => [
  { value: shortenAccount(vote.source), label: 'Source' },
  { value: format(new Date(vote.date), 'P'), label: 'Started' },
  { value: vote.govVote ? 'Yes' : 'No', label: 'Voted' },
  { value: differenceInSeconds(fromUnixTime(vote.end_timestamp), new Date()) > 0 ? 'No' : 'Yes', label: 'Ended' },
  { value: vote.active ? 'Active' : 'Closed', label: 'Status' },
  { value: formatDistanceToNow(new Date(vote.date), { addSuffix: false }), label: 'Time opened' },
  { value: vote.end_approvals, label: 'MKR in support' },
  { value: vote.verified ? 'Yes' : 'No', label: 'Executed' },
]

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

export const defaultFilters = {
  votersVsMkr: LAST_YEAR,
}
