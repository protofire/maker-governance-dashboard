import {
  fromUnixTime,
  getUnixTime,
  format,
  differenceInDays,
  addHours,
  startOfHour,
  endOfHour,
  differenceInHours,
  isAfter,
} from 'date-fns'
import { shortenAccount, timeLeft, getVoterBalances, getVotersBalance, getPollData } from '../../utils'
import { getVoterAddresses, getPollDataWithoutBalances } from './data'
import { LAST_YEAR } from '../../constants'

export const defaultFilters = {
  votersVsMkr: LAST_YEAR,
}
export const getTopVoters = async poll => {
  const balancesLookup = await getAllBalances(poll)
  return await getVotersBalance(poll, balancesLookup)
}

const getTimeOpened = (from, to) => {
  const diffDays = differenceInDays(to, from)
  const diffHours = differenceInHours(to, from) % 24
  if (diffDays > 0 && diffHours > 0) {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`
  } else if (diffDays <= 0) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`
  else return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`
}

const getKeysWithHighestValue = (o, n) => {
  var keys = Object.keys(o)
  keys.sort(function(a, b) {
    return o[b] - o[a]
  })
  return keys.slice(0, n)
}

const getTimeLeftText = time => {
  if (time[0].time.days > 0 && time[0].time.hours > 0) {
    return `${time[0].time.days} ${time[0].time.days === 1 ? 'day' : 'days'} ${time[0].time.hours} ${
      time[0].time.hours === 1 ? 'hour' : 'hours'
    }`
  } else if (time[0].time.days <= 0) return `${time[0].time.hours} ${time[0].time.hours === 1 ? 'hour' : 'hours'}`
  else return `${time[0].time.days} ${time[0].time.days === 1 ? 'day' : 'days'}`
}

export const getPollTableData = (poll, mkrDistributionData) => {
  const lastDistValue = mkrDistributionData[mkrDistributionData.length - 1]
  const { Abstein, endDate, from, to, label, ...rest } = lastDistValue
  const winOption = getKeysWithHighestValue(rest, 1)[0]
  const time = getTimeLeftData(poll.startDate, poll.endDate)
  return [
    { value: shortenAccount(poll.source.toLowerCase()), label: 'Poll Address' },
    { value: format(fromUnixTime(poll.startDate), 'P'), label: 'Start Date' },
    { value: timeLeft(poll.endDate) === 'Ended' ? 'Closed' : 'Open', label: 'Status' },
    {
      value:
        time[0].text === 'Ended'
          ? getTimeOpened(fromUnixTime(poll.startDate), fromUnixTime(poll.endDate))
          : getTimeOpened(fromUnixTime(poll.startDate), Date.now()),
      label: 'Time opened',
    },
    {
      value: time[0].text === 'Ended' ? 'Ended' : getTimeLeftText(time),
      label: 'Time Remaining',
    },
    {
      value: winOption,
      label: 'Winning Option',
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

const getAllBalances = async poll => {
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
  return allBalances.flat().reduce((lookup, snapshot: any) => {
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

  const balancesLookup = await getAllBalances(poll)

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

export const getTopVotersTableData = topVoters => {
  const total: any = Object.values(topVoters).reduce((a: any, b: any) => Number(a) + Number(b), 0)
  const data = Object.entries(topVoters).map((el: any) => ({
    sender: shortenAccount(el[0]),
    supports: ((Number(el[1]) * 100) / total).toFixed(1),
  }))

  return data.sort((a: any, b: any) => b.supports - a.supports)
}
