import moment from 'moment'

export const Pollcolumns = () => [
  {
    Header: 'Poll creator',
    accessor: row => shortenAccount(row.creator),
  },
  {
    Header: 'Time Left',
    accessor: row => timeLeft(row.endDate),
  },
]

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
