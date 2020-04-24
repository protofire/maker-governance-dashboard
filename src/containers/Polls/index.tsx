import React, { useState, useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import BigNumber from 'bignumber.js'
import List from '../../components/List'
import { getPollData, getPollsBalances, mergeEventPages } from '../../utils'
import { Pollcolumns } from '../../components/List/helpers'
import { DEFAULT_FETCH_ROWS } from '../../constants'
import { FullLoading, PageTitle } from '../../components/common'
import { GOVERNANCE_INFO_QUERY, POLLS_FIRST_QUERY } from './queries'
import { getPollsMetaData, getMKRSupply } from '../../utils/makerdao'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
  }
}

const ErrorEl = () => <div>ERROR: There was an error trying to fetch the data. </div>

function PollsInfo(props) {
  const [data, setData] = useState<any[]>([])
  const [mkrSupply, setMkrSupply] = useState<BigNumber | undefined>(undefined)
  const pollcolumns = useMemo(() => Pollcolumns(), [])
  const initialSort = useMemo(() => [{ id: 'date', desc: true }], [])

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const { data: pollsData, loading, error } = useQuery(POLLS_FIRST_QUERY, {
    variables: gData && getHomeVariables(gData),
    skip: !gData,
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
      .dp(4)
      .toString()
  }

  useEffect(() => {
    if (!mkrSupply) getMKRSupply().then(supply => setMkrSupply(supply))
  }, [mkrSupply])

  useEffect(() => {
    const mergedPolls = pollsData ? [...mergeEventPages(pollsData).polls] : []
    if (pollsData && mergedPolls.length && mkrSupply) {
      getPollsBalances(mergedPolls).then(votersSnapshots => {
        // TODO - improve function naming (snapshots of acctual voting addresses)
        getPollsMetaData(mergedPolls).then(polls => {
          Promise.all(
            polls.map(poll => {
              return getPollData(poll, votersSnapshots).then(pollData => {
                return {
                  ...poll,
                  plurality: setPlurality(pollData),
                  participation: getParticipation(pollData, mkrSupply),
                }
              })
            }),
          ).then(pollsWithPluralityAndParticipation => {
            setData(pollsWithPluralityAndParticipation)
          })
        })
      })
    }
  }, [pollsData, mkrSupply])

  if (loading || gResult.loading || data.length === 0) return <FullLoading />
  if (error || gResult.error) return <ErrorEl />

  return (
    <>
      <PageTitle>Polls</PageTitle>
      <List handleRow={getPoll} data={data} columns={pollcolumns} sortBy={initialSort} />
    </>
  )
}

export default PollsInfo
