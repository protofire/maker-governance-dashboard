import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import lscache from 'lscache'
import BigNumber from 'bignumber.js'
import List from '../../components/List'
import { getPollData, getPollsBalances, mergeEventPages } from '../../utils'
import { Pollcolumns } from '../../components/List/helpers'
import { DEFAULT_FETCH_ROWS, DEFAULT_CACHE_TTL } from '../../constants'
import { FullLoading, PageTitle } from '../../components/common'
import { GOVERNANCE_INFO_QUERY, POLLS_FIRST_QUERY } from './queries'
import { getPollsData, getMKRSupply } from '../../utils/makerdao'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
  }
}

const ErrorEl = () => <div>ERROR: There was an error trying to fetch the data. </div>

function PollsInfo(props) {
  const [cachedData, setCachedData] = useState<any>(lscache.get('polls') || [])
  const [dataFetched, setDataFetched] = useState(false)
  const [data, setData] = useState<any[]>(cachedData)
  const [pollsBalances, setBalances] = useState<any>({})

  const [mkrSupply, setMkrSupply] = useState<BigNumber | undefined>(undefined)
  const pollcolumns = React.useMemo(() => Pollcolumns(), [])
  const initialSort = React.useMemo(() => [{ id: 'date', desc: true }], [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const pollsData = useQuery(POLLS_FIRST_QUERY, {
    variables: gData && getHomeVariables(gData),
    skip: !gData || cachedData.length > 0,
  })
  const getPoll = row => {
    if (row.id) props.history.push(`/poll/${row.id}`)
  }

  const setPlurality = plurality => {
    const totalMkr = plurality.reduce((acc, value) => Number(acc) + Number(value.mkr), 0)
    const winnerOption = plurality.reduce(
      (prev, current) => (Number(prev.mkr) > Number(current.mkr) ? prev : current),
      0,
    )
    return {
      option: winnerOption,
      totalMkr: totalMkr.toFixed(2),
      mkr: totalMkr ? Number((winnerOption.mkr * 100) / totalMkr).toFixed(2) : '0',
    }
  }
  const getParticipation = (data, mkrSupply) => {
    const totalMkr: BigNumber = data.reduce((acc, value) => acc.plus(new BigNumber(value.mkr)), new BigNumber('0'))
    return totalMkr
      .times(100)
      .div(mkrSupply)
      .toString()
  }

  useEffect(() => {
    if (pollsData.data) {
      setData([...mergeEventPages(pollsData.data).polls])
    }
  }, [pollsData.data])

  useEffect(() => {
    if (cachedData.length === 0) getPollsBalances(data).then(balances => setBalances(balances))
  }, [data, cachedData.length])

  useEffect(() => {
    if (!mkrSupply) getMKRSupply().then(supply => setMkrSupply(supply))
  }, [mkrSupply])

  useEffect(() => {
    lscache.set('polls', data, DEFAULT_CACHE_TTL)
    setCachedData(data)
  }, [data])

  useEffect(() => {
    if (data.length > 0 && mkrSupply && !dataFetched) {
      setDataFetched(true)
      getPollsData(data).then(result => {
        const polls = result.filter(Boolean)
        Promise.all(
          polls.map((poll: any) => {
            if (poll.plurality && poll.participation) {
              return Promise.resolve(poll)
            }
            return getPollData(poll, pollsBalances).then(data => {
              return { ...poll, plurality: setPlurality(data), participation: getParticipation(data, mkrSupply) }
            })
          }),
        ).then(pollsWithPluralityAndParticipation => {
          setData(pollsWithPluralityAndParticipation)
        })
      })
    }
  }, [data, mkrSupply, pollsBalances])
  if (pollsData.loading || gResult.loading || data.length === 0) return <FullLoading />
  if (pollsData.error || gResult.error) return <ErrorEl />

  return (
    <>
      <PageTitle>Polls</PageTitle>
      <List handleRow={getPoll} data={data} columns={pollcolumns} sortBy={initialSort} />
    </>
  )
}

export default PollsInfo
