import React, { useState, useEffect } from 'react'
import HomeDetail from '../../components/Home/HomeDetail'
import { DEFAULT_FETCH_ROWS } from '../../constants'
import { FullLoading } from '../../components/common'
import { useQuery } from '@apollo/react-hooks'
import { ACTIONS_QUERY, GOVERNANCE_INFO_QUERY } from './queries'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    voters: Number(governance.countProxies) + Number(governance.countAddresses) || DEFAULT_FETCH_ROWS,
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
    executives: Number(governance.countSpells) || DEFAULT_FETCH_ROWS,
    lock: Number(governance.countLock) || DEFAULT_FETCH_ROWS,
    free: Number(governance.countFree) || DEFAULT_FETCH_ROWS,
  }
}

const Error = () => <div>ERROR: There was an error trying to fetch the data. </div>

function MakerGovernanceInfo() {
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  const homeData = useQuery(ACTIONS_QUERY, { variables: resultVariables })
  if (homeData.loading || gResult.loading) return <FullLoading />
  if (homeData.error || gResult.error) return <Error />

  return (
    <>
      <HomeDetail gData={gData} data={homeData.data} />
    </>
  )
}

export default MakerGovernanceInfo
