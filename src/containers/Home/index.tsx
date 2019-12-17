import React, { useState, useEffect, useMemo } from 'react'
import lscache from 'lscache'
import HomeDetail from '../../components/Home/HomeDetail'
import { getMKRResponsiveness } from '../../components/Home/helpers'

import { DEFAULT_FETCH_ROWS } from '../../constants'
import { FullLoading } from '../../components/common'
import { useQuery } from '@apollo/react-hooks'
import { HOME_DATA_QUERY, GOVERNANCE_INFO_QUERY } from './queries'
import { DEFAULT_CACHE_TTL } from '../../constants'
import { getMkrBurnEvents, getMkrMintEvents, mergeEventPages } from '../../utils'

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    voters: Number(governance.countProxies) + Number(governance.countAddresses) || DEFAULT_FETCH_ROWS,
    polls: Number(governance.countPolls) || DEFAULT_FETCH_ROWS,
    executives: Number(governance.countSpells) || DEFAULT_FETCH_ROWS,
  }
}

const Error = () => <div>ERROR: There was an error trying to fetch the data.</div>

function MakerGovernanceInfo() {
  const cachedDataExecutivesResponsiveness = lscache.get('executives-responsiveness') || []

  const [executivesResponsiveness, setExecutivesResponsiveness] = useState<any>(cachedDataExecutivesResponsiveness)
  const [resultVariables, setResultVariables] = useState(getHomeVariables({ governanceInfo: {} }))

  const { data: gData, ...gResult } = useQuery(GOVERNANCE_INFO_QUERY)

  const { data: homeData, loading, error } = useQuery(HOME_DATA_QUERY, { variables: resultVariables })

  const [mkrEvents, setMkrEvents] = useState({})
  const [mkrError, setMkrError] = useState(null)
  const [loadingMkrEvent, setLoadingMkrEvents] = useState(false)

  const data = useMemo(() => {
    if (homeData) {
      return mergeEventPages(homeData)
    }
  }, [homeData])

  console.log(data)

  useEffect(() => {
    if (data && data.executives) {
      if (cachedDataExecutivesResponsiveness.length === 0) {
        setExecutivesResponsiveness(getMKRResponsiveness(data.executives))
      }
    }
  }, [data, cachedDataExecutivesResponsiveness.length])

  useEffect(() => {
    if (gData) setResultVariables(getHomeVariables(gData))
  }, [gData])

  useEffect(() => {
    lscache.set('executives-responsiveness', executivesResponsiveness, DEFAULT_CACHE_TTL)
  }, [executivesResponsiveness])

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

  if (loading || gResult.loading || loadingMkrEvent || executivesResponsiveness.length === 0) {
    return <FullLoading />
  }

  if (error || gResult.error || mkrError) {
    return <Error />
  }

  return (
    <>
      <HomeDetail executivesResponsiveness={executivesResponsiveness} gData={gData} data={{ ...data, ...mkrEvents }} />
    </>
  )
}

export default MakerGovernanceInfo
