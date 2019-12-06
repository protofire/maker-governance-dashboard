import React from 'react'
import { fromUnixTime, format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import BigNumber from 'bignumber.js'
import { shortenAccount, getHourlyFromTo, getTimeOpened } from '../../utils'
import { AddressNav } from '../common'
import {
  LAST_YEAR,
  VOTING_ACTION_FREE,
  VOTING_ACTION_LOCK,
  VOTING_ACTION_ADD,
  VOTING_ACTION_REMOVE,
} from '../../constants'

export const getVoteTableData = vote => {
  const startDate = vote.timestamp
    ? utcToZonedTime(fromUnixTime(vote.timestamp), Intl.DateTimeFormat().resolvedOptions().timeZone)
    : new Date(vote.date)
  const mkr_approvals = vote.approvals ? Number(vote.approvals).toFixed(2) : vote.end_approvals
  return [
    {
      value: (
        <AddressNav address={vote.id}>
          {' '}
          <span>{shortenAccount(vote.id)}</span>
        </AddressNav>
      ),
      label: 'Spell Address',
    },
    { value: format(startDate, 'P'), label: 'Start Date' },
    { value: vote.casted ? 'Passed' : 'Open', label: 'Status' },
    {
      value: vote.casted ? getTimeOpened(startDate, fromUnixTime(vote.casted)) : getTimeOpened(startDate, Date.now()),
      label: 'Time opened',
    },
    { value: mkr_approvals, label: 'MKR in support' },
    { value: vote.casted ? 'Yes' : 'No', label: 'Executed' },
  ]
}

export const getTopSupportersTableData = (supporters, vote) => {
  const total = vote.approvals ? Number(vote.approvals).toFixed(2) : vote.end_approvals
  const data = Object.entries(supporters).map((el: any) => ({
    sender: <AddressNav address={el[0]}>{shortenAccount(el[0])}</AddressNav>,
    supports: ((el[1].mkr * 100) / total).toFixed(1),
  }))

  return data.sort((a: any, b: any) => b.supports - a.supports)
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

export const defaultFilters = {
  votersVsMkr: LAST_YEAR,
}

const initializeMkr = (el, data, prev: BigNumber) => {
  return data
    .filter(d => d.timestamp < el)
    .reduce((acum, value) => {
      if (value.type === VOTING_ACTION_FREE || value.type === VOTING_ACTION_REMOVE) {
        return acum.minus(value.type === VOTING_ACTION_FREE ? new BigNumber(value.wad) : new BigNumber(value.locked))
      } else {
        return acum.plus(value.type === VOTING_ACTION_LOCK ? new BigNumber(value.wad) : new BigNumber(value.locked))
      }
    }, prev)
}

const formatMkrData = (el, data, prev: BigNumber, timestampGetter = t => t) => {
  return data
    .filter(d => timestampGetter(d.timestamp) >= el.from && timestampGetter(d.timestamp) <= el.to)
    .reduce((acum, value) => {
      if (value.type === VOTING_ACTION_FREE || value.type === VOTING_ACTION_REMOVE) {
        return acum.minus(value.type === VOTING_ACTION_FREE ? new BigNumber(value.wad) : new BigNumber(value.locked))
      } else {
        return acum.plus(value.type === VOTING_ACTION_LOCK ? new BigNumber(value.wad) : new BigNumber(value.locked))
      }
    }, prev)
}

export const getVotersVsMkrData = (data: Array<any>, vote: any): Array<any> => {
  if (!vote || !vote.timestamp) {
    return []
  }
  const from = vote.timestamp
  const periods = getHourlyFromTo(from)
  const countData = data.filter(el => el.type === VOTING_ACTION_ADD || el.type === VOTING_ACTION_REMOVE)

  let count = 0
  let mkr = initializeMkr(from, data, new BigNumber(0))
  return periods.map(el => {
    mkr = formatMkrData(el, data, mkr)
    count = countData
      .filter(d => d.timestamp >= el.from && d.timestamp <= el.to)
      .reduce((acc, d) => (d.type === VOTING_ACTION_ADD ? ++acc : --acc), count)
    return {
      ...el,
      count,
      mkr: Number(mkr.toNumber().toFixed(2)),
    }
  })
}

const getSupporterMkr = (acum, value) => {
  if (value.type === VOTING_ACTION_FREE || value.type === VOTING_ACTION_REMOVE) {
    return acum.minus(value.type === VOTING_ACTION_FREE ? new BigNumber(value.wad) : new BigNumber(value.locked))
  } else {
    return acum.plus(value.type === VOTING_ACTION_LOCK ? new BigNumber(value.wad) : new BigNumber(value.locked))
  }
}

export const getTopSupporters = (data: Array<any>): Array<any> => {
  return data.reduce((acum, value) => {
    let mkr = acum[value.sender] ? acum[value.sender].original : new BigNumber(0)
    mkr = getSupporterMkr(mkr, value)
    return {
      ...acum,
      [value.sender]: { mkr: mkr.toNumber().toFixed(2), original: mkr },
    }
  }, {})
}

export const getApprovalsByAddress = (votingActions: Array<any>): Array<any> => {
  const buckets = Array.from({ length: 6 }, (v, i) => Math.pow(10, i)).map((num, index, array) => {
    let from = index === 0 ? 0 : array[index - 1]
    return {
      from,
      to: num,
      label: `<${num}`,
      count: 0,
    }
  })

  const data = getTopSupporters(votingActions)

  return Object.keys(data).reduce((acc, vote) => {
    const address = data[vote]
    return acc.map(bucket => {
      return {
        ...bucket,
        count: address.mkr >= bucket.from && address.mkr < bucket.to ? bucket.count + 1 : bucket.count,
      }
    })
  }, buckets)
}
