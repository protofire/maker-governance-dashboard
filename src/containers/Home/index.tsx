import React, { useState, useEffect } from 'react'
import lscache from 'lscache'
import HomeDetail from '../../components/Home/HomeDetail'
import { getMKRResponsiveness } from '../../components/Home/helpers'

import { DEFAULT_FETCH_ROWS } from '../../constants'
import { FullLoading } from '../../components/common'
import { useQuery } from '@apollo/react-hooks'
import { ACTIONS_QUERY, GOVERNANCE_INFO_QUERY } from './queries'
import { DEFAULT_CACHE_TTL } from '../../constants'

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
  const cachedDataExecutivesResponsiveness = lscache.get('executives-responsiveness') || []

  const [executivesResponsiveness, setExecutivesResponsiveness] = useState<any>(cachedDataExecutivesResponsiveness)
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const homeData = useQuery(ACTIONS_QUERY, { variables: resultVariables })

  useEffect(() => {
    if (homeData.data && homeData.data.executives) {
      if (cachedDataExecutivesResponsiveness.length === 0)
        setExecutivesResponsiveness(getMKRResponsiveness(homeData.data.executives))
    }
  }, [homeData, cachedDataExecutivesResponsiveness.length])

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    lscache.set('executives-responsiveness', executivesResponsiveness, DEFAULT_CACHE_TTL)
  }, [executivesResponsiveness])

  if (homeData.loading || gResult.loading || executivesResponsiveness.length === 0) return <FullLoading />
  if (homeData.error || gResult.error) return <Error />

  return (
    <>
      <HomeDetail executivesResponsiveness={executivesResponsiveness} gData={gData} data={homeData.data} />
    </>
  )
}

export default MakerGovernanceInfo
