import React, { useState, useEffect } from 'react'
import HomeDetail from '../../components/Home/HomeDetail'

import { DEFAULT_FETCH_ROWS } from '../../constants'
import { FullLoading } from '../../components/common'
import { useQuery } from '@apollo/react-hooks'
import { GOVERNANCE_INFO_QUERY } from './queries'
import { getMkrBurnEvents, getMkrMintEvents } from '../../utils'
import { getMKRSupply } from '../../utils/makerdao'
import useAsyncMemo from '../../hooks/useAsyncMemo'
import useHomeData from '../../hooks/useHomeData'
import BigNumber from 'bignumber.js'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    voters: Number(governance.countProxies) + Number(governance.countAddresses) || DEFAULT_FETCH_ROWS,
  }
}

const getPages = gData => {
  if (!gData) {
    return {
      pollPages: 2,
      executivesPages: 2,
    }
  }

  const { governanceInfo } = gData
  return {
    pollPages: Math.ceil(Number(governanceInfo.countPolls) / 1000),
    executivesPages: Math.ceil(Number(governanceInfo.countSpells) / 1000),
  }
}

const Error = () => <div>ERROR: There was an error trying to fetch the data.</div>

function MakerGovernanceInfo() {
  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)
  const { data, loading, error } = useHomeData(gData)

  const [mkrEvents, setMkrEvents] = useState({})
  const [mkrError, setMkrError] = useState(null)
  const [loadingMkrEvent, setLoadingMkrEvents] = useState(false)

  const mkrSupply = useAsyncMemo(async () => getMKRSupply(), new BigNumber(0), [])

  useEffect(() => {
    setLoadingMkrEvents(true)

    Promise.all([getMkrMintEvents(), getMkrBurnEvents()])
      .then(([mint, burn]) => {
        setMkrEvents({ mint, burn })
        setMkrError(null)
      })
      .catch(error => {
        setMkrError(error)
      })
      .finally(() => {
        setLoadingMkrEvents(false)
      })
  }, [setMkrEvents])

  if (loading || gResult.loading || loadingMkrEvent || !mkrSupply || mkrSupply.eq(0)) {
    return <FullLoading />
  }

  if (error || gResult.error) {
    return <Error />
  }

  return (
    <>
      <HomeDetail gData={gData} data={{ ...data, ...mkrEvents, mkrSupply }} />
    </>
  )
}

export default MakerGovernanceInfo
