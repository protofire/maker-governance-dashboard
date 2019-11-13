import {
  fromUnixTime,
  format,
  formatDistance,
  formatDistanceToNow,
  addHours,
  startOfHour,
  endOfHour,
  differenceInHours,
  isAfter,
} from 'date-fns'
import { shortenAccount, timeLeft, getVoterBalances, getPollData } from '../../utils'
import { getVoterAddresses, getPollDataWithoutBalances } from './data'
import { LAST_YEAR } from '../../constants'
import { getUnixTime } from 'date-fns/esm'

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
  const totalTime = end - start
  const now = today < start ? start : today // 'today' can be less than the starting date, so we correct that
  const leftTime = end - now
  const progress = (leftTime * 100) / totalTime
  const correctedProgress = progress < 0 ? 100 : progress // if 'now' is after the ending date we'll get a negative number, so we should address that too
  const value = 100 - correctedProgress

  hours = hours - days * 24
  minutes = minutes - days * 24 * 60 - hours * 60

  if (isEnded) return [{ value: value, text: 'Ended' }, { value: 0 }]

  return [{ time: { days, hours, minutes }, value: value }, { value: seconds }]
}

export const getPollPerOptionData = poll => getPollDataWithoutBalances(poll)

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
  const now = fromUnixTime(Date.now())
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
      const pollData = await getPollData(manualPoll, balancesLookup)

      return pollData.reduce(
        (acc, el) => {
          return {
            ...acc,
            [el.label]: Number(el.mkr),
          }
        },
        { ...period },
      )
    }),
  )
}
