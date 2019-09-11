import moment from 'moment'
import React from 'react'
import { Link } from '../components/common'
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  getUnixTime,
  format,
  differenceInDays,
  subDays,
  startOfDay,
  endOfDay,
  endOfHour,
  startOfHour,
  subHours,
} from 'date-fns'

export const Pollcolumns = (isModalOpen: boolean) => {
  const getValue = value => {
    return isModalOpen ? value : shortenAccount(value)
  }
  return [
    {
      Header: 'Poll creator',
      accessor: 'creator',
      Cell: ({ row }) => <Link href={row.original.url}>{getValue(row.original.creator)}</Link>,
    },
    {
      Header: 'Time Left',
      accessor: row => timeLeft(row.endDate),
    },
  ]
}
const shortenAccount = (account: string): string => account.slice(0, 6) + '...' + account.slice(account.length - 4)

const timeLeft = (end): string => {
  const today = moment()
  const end_date = moment.unix(end)

  if (end_date.diff(today) <= 0) return 'Ended'

  const minsDiff = end_date.diff(today, 'minutes')
  const hoursDiff = end_date.diff(today, 'hours')
  const daysDiff = end_date.diff(today, 'days')
  const weeksDiff = end_date.diff(today, 'weeks')
  const monthsDiff = end_date.diff(today, 'months')

  if (monthsDiff > 0) return `${monthsDiff} months`
  if (weeksDiff > 0) return `${weeksDiff} weeks`
  if (daysDiff > 0) return `${daysDiff} days`
  if (hoursDiff > 0) return `${hoursDiff} hours`
  return `${minsDiff} minutes`
}

export const getLastYear = () => {
  const today = new Date()
  const periods = Array.from({ length: 13 }, (v, i) => i).map(num => {
    const from = startOfMonth(subMonths(today, num))
    const to = endOfMonth(subMonths(today, num))
    return {
      from: getUnixTime(from),
      to: getUnixTime(to),
      label: format(from, 'MMM yy').toUpperCase(),
    }
  })
  return periods.reverse()
}

export const getLastMonth = () => {
  const today = new Date()
  const lastMonthDate = subMonths(today, 1)
  const getDaysDifference = differenceInDays(today, lastMonthDate)

  const periods = Array.from({ length: getDaysDifference + 1 }, (v, i) => i).map(num => {
    const from = startOfDay(subDays(today, num))
    const to = endOfDay(subDays(today, num))
    return {
      from: getUnixTime(from),
      to: getUnixTime(to),
      label: format(from, 'dd MMM').toUpperCase(),
    }
  })
  return periods.reverse()
}

export const getLastWeek = () => {
  const today = new Date()

  const periods = Array.from({ length: 8 }, (v, i) => i).map(num => {
    const from = startOfDay(subDays(today, num))
    const to = endOfDay(subDays(today, num))
    return {
      from: getUnixTime(from),
      to: getUnixTime(to),
      label: format(from, 'dd MMM').toUpperCase(),
    }
  })
  return periods.reverse()
}

export const getLastDay = () => {
  const today = new Date()

  const periods = Array.from({ length: 25 }, (v, i) => i).map(num => {
    const from = startOfHour(subHours(today, num))
    const to = endOfHour(subHours(today, num))
    return {
      from: getUnixTime(from),
      to: getUnixTime(to),
      label: format(from, 'HH') + 'hs',
    }
  })
  return periods.reverse()
}

export const mockedData: Array<any> = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
]
