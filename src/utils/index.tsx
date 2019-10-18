import React from 'react'
import { IconContainer, CloseIcon } from '../components/common'

import {
  startOfMonth,
  endOfMonth,
  subMonths,
  getUnixTime,
  fromUnixTime,
  format,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
  endOfHour,
  startOfHour,
  subHours,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns'
import { LAST_YEAR, LAST_MONTH, LAST_WEEK, LAST_DAY } from '../constants'

export const shortenAccount = (account: string): string =>
  account.slice(0, 6) + '...' + account.slice(account.length - 4)

export const toNiceDate = timestamp => {
  return format(fromUnixTime(timestamp), 'PPp')
}

export const getModalContainer = Content => <Content />

export const timeLeft = (end): string => {
  const today = new Date()
  const end_date = fromUnixTime(end)
  if (differenceInSeconds(end_date, today) <= 0) return 'Ended'

  const minsDiff = differenceInMinutes(end_date, today)
  const hoursDiff = differenceInHours(end_date, today)
  const daysDiff = differenceInDays(end_date, today)
  const weeksDiff = differenceInWeeks(end_date, today)
  const monthsDiff = differenceInMonths(end_date, today)
  const yearsDiff = differenceInYears(end_date, today)

  if (yearsDiff > 0) return yearsDiff === 1 ? `${yearsDiff} year` : `${yearsDiff} year`
  if (monthsDiff > 0) return monthsDiff === 1 ? `${monthsDiff} month` : `${monthsDiff} months`
  if (weeksDiff > 0) return weeksDiff === 1 ? `${daysDiff} week` : `${daysDiff} week`
  if (daysDiff > 0) return daysDiff === 1 ? `${daysDiff} day` : `${daysDiff} days`
  if (hoursDiff > 0) return hoursDiff === 1 ? `${daysDiff} hour` : `${hoursDiff} hours`
  return minsDiff === 1 ? `${minsDiff} minute` : `${minsDiff} minutes`
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

export const getDailyFromTo = (from, to) => {
  const start = startOfDay(fromUnixTime(from))
  const end = endOfDay(fromUnixTime(to))
  const getDaysDifference = differenceInDays(end, start)

  const periods = Array.from({ length: getDaysDifference + 1 }, (v, i) => i).map(num => {
    const from = startOfDay(addDays(start, num))
    const to = endOfDay(addDays(start, num))
    return {
      from: getUnixTime(from),
      to: getUnixTime(to),
      label: format(from, 'dd MMM').toUpperCase(),
    }
  })
  return periods
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

export const filters = [
  { label: 'Last year', value: LAST_YEAR },
  { label: 'Last month', value: LAST_MONTH },
  { label: 'Last week', value: LAST_WEEK },
  { label: 'Last day', value: LAST_DAY },
]

export const getIconContainer = (Component, cb, isModalOpen = false) => (
  <IconContainer onClick={cb}>{isModalOpen ? <CloseIcon /> : <Component />}</IconContainer>
)
