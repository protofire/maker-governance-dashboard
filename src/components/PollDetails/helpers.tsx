import styled from 'styled-components'
import {
  fromUnixTime,
  format,
  formatDistance,
  formatDistanceToNow,
  addDays,
  addHours,
  startOfDay,
  startOfHour,
  endOfDay,
  endOfHour,
  differenceInDays,
  differenceInHours,
  isAfter,
} from 'date-fns'
import { Card, TitleContainer } from '../common/styled'

import { shortenAccount, timeLeft } from '../../utils'

import { getPollData, getPollData2, getVoterAddresses } from './data'

import { LAST_YEAR } from '../../constants'
import { getUnixTime } from 'date-fns/esm'

import { request } from 'graphql-request'

const GOVERNANCE_API_URI = process.env.REACT_APP_GRAPH_HTTP

const fetchQuery = (url, query, variables) => request(url, query, variables)

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
    { value: Number(poll.votesCount) === 0 ? 'No' : 'Yes', label: 'Voted' },
    { value: timeLeft(poll.endDate) === 'Ended' ? 'Yes' : 'No', label: 'Ended' },
    { value: timeLeft(poll.endDate) === 'Ended' ? 'Closed' : 'Active', label: 'Status' },
    {
      value:
        timeLeft(poll.endDate) === 'Ended'
          ? formatDistance(fromUnixTime(poll.startDate), fromUnixTime(poll.endDate), { addSuffix: false })
          : formatDistanceToNow(fromUnixTime(poll.startDate), { addSuffix: false }),
      label: 'Time opened',
    },
  ]
}

export const getTimeLeftData = (start, end): Array<any> => {
  const isEnded = timeLeft(end) === 'Ended'
  const today = getUnixTime(new Date())
  const seconds = Math.floor(end - today)
  let minutes = Math.floor(seconds / 60)
  let hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  hours = hours - days * 24
  minutes = minutes - days * 24 * 60 - hours * 60

  if (isEnded) return [{ value: today, text: 'Ended' }, { value: 0 }]

  return [{ time: { days, hours, minutes }, value: today / 1000 }, { value: seconds }]
}

export const getPollPerOptionData = poll => getPollData(poll)

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

const getPollPeriods = poll => {
  const start = fromUnixTime(poll.startDate)

  const endPoll = fromUnixTime(poll.endDate)
  const now = new Date()
  const end = isAfter(endPoll, now) ? now : endPoll

  const long = differenceInHours(end, start)

  const periods = Array.from({ length: long + 1 }, (v, i) => {
    let period = addHours(start, i)
    let from = startOfHour(period)
    let to = endOfHour(period)

    return {
      label: format(from, 'dd MMM Ho'),
      from,
      to,
      endDate: getUnixTime(to),
    }
  })

  periods[periods.length - 1].endDate = poll.endDate

  return periods
}

export const getPollVotersHistogramData = poll => {
  const periods = getPollPeriods(poll)

  const pollOptions = ['Abstein', ...poll.options]
  const options = pollOptions.reduce((acc, el) => {
    return {
      ...acc,
      [el]: 0,
    }
  }, {})

  const voters = getVoterAddresses(poll).reduce((acc, voter) => {
    return {
      ...acc,
      [voter]: 0,
    }
  }, {})

  return periods.map(period => {
    poll.timeLine.forEach(el => {
      if (
        el.type === 'VotePollAction' &&
        el.timestamp >= getUnixTime(period.from) &&
        el.timestamp <= getUnixTime(period.to)
      ) {
        const prevVote = voters[el.sender]
        const option = pollOptions[el.option]

        options[option] += 1
        voters[el.sender] = option

        if (prevVote) options[prevVote] -= 1
      }
    })

    return {
      ...period,
      ...options,
    }
  })
}

export const getPollMakerHistogramData = async poll => {
  const periods = getPollPeriods(poll)

  const pollOptions = ['Abstein', ...poll.options]
  const options = pollOptions.reduce((acc, el) => {
    return {
      ...acc,
      [el]: new Set(),
    }
  }, {})

  const voters = getVoterAddresses(poll).reduce((acc, voter) => {
    return {
      ...acc,
      [voter]: 0,
    }
  }, {})

  const endPoll = fromUnixTime(poll.endDate)
  const now = new Date()
  const end = isAfter(endPoll, now) ? now : endPoll
  const allVoters = Array.from(
    new Set(
      poll.timeLine.reduce((voters, tl) => {
        if (tl.type === 'VotePollAction' && tl.timestamp <= getUnixTime(end)) {
          return [...voters, tl.sender]
        }

        return voters
      }, []),
    ),
  )

  const allBalances = await Promise.all(allVoters.map(addr => getVoterBalances(addr, getUnixTime(end))))
  const balancesLookup = allBalances.flat().reduce((lookup, snapshot: any) => {
    const account = snapshot.account.address
    const balances = lookup[account] || []
    const newBalances = [
      ...balances,
      {
        amount: snapshot.amount,
        timestamp: snapshot.timestamp,
      },
    ]

    return {
      ...lookup,
      [account]: newBalances,
    }
  }, {})

  const votersPerPeriod = periods.map(period => {
    poll.timeLine.forEach(el => {
      if (
        el.type === 'VotePollAction' &&
        el.timestamp >= getUnixTime(period.from) &&
        el.timestamp <= getUnixTime(period.to)
      ) {
        const prevVote = voters[el.sender]
        const option = pollOptions[el.option]

        options[option] = new Set([...Array.from(options[option])]).add(el.sender)
        voters[el.sender] = option

        if (prevVote) options[prevVote] = options[prevVote].delete(el.sender)
      }
    })
    return {
      ...period,
      ...options,
    }
  })

  return Promise.all(
    votersPerPeriod.map(async period => {
      const manualPoll = {
        endDate: period.endDate,
        votes: poll.options.flatMap(pop =>
          Array.from(period[pop]).map(voter => ({ option: poll.options.indexOf(pop) + 1, voter })),
        ),
        options: poll.options,
      }
      const pollData = await getPollData2(manualPoll, balancesLookup)
      // const pollData = await getPollData(manualPoll)

      return pollData.reduce(
        (acc, el) => {
          return {
            ...acc,
            [el.label]: el.mkr,
          }
        },
        { ...period },
      )
    }),
  )
}

const getVoterBalances = async (address, endDate) => {
  // Query
  const query = `
    query getAccountBalances($voter: Bytes!, $endDate: BigInt!, $skip: Int = 0 ) {
      accountBalanceSnapshots(
        first: 1000,
        skip: $skip,
        where:{
          account: $voter,
          timestamp_lte: $endDate
        },
        orderBy: timestamp, orderDirection: desc
      ) {
        account {
          address
        }
        amount
        timestamp
      }
    }
  `

  let skip = 0
  let more = true
  let result = []
  while (more) {
    const partial: any = await fetchQuery(GOVERNANCE_API_URI, query, {
      voter: address,
      endDate,
      skip,
    })

    result = result.concat(partial.accountBalanceSnapshots)
    more = !(partial.accountBalanceSnapshots.length < 1000)
    skip += 1000
  }

  return result
}
