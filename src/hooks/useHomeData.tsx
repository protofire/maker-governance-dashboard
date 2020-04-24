import { useState, useEffect } from 'react'
import { HOME_DATA_QUERY } from './queries'
import { useQuery } from '@apollo/react-hooks'
import store from '../utils/cache'
import { addMinutes, isBefore } from 'date-fns'
import { mergeEventPages } from '../utils'

const REACT_APP_HOME_DATA_TTL = Number(process.env.REACT_APP_LAST_CACHE_UPDATE) || 5

const getHomeVariables = data => {
  const governance = data.governanceInfo
  return {
    voters: Number(governance.countProxies) + Number(governance.countAddresses) || 1000,
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

export function useHomeData(governanceInfo: Maybe<any>): any {
  const [skipQuery, setSkipQuery] = useState(true)
  const [results, setResults] = useState<Maybe<null>>(null)
  const [loading, setLoading] = useState(true)
  const { data, error } = useQuery(HOME_DATA_QUERY(getPages(governanceInfo)), {
    variables: governanceInfo && getHomeVariables(governanceInfo),
    skip: skipQuery,
  })

  useEffect(() => {
    let isCancelled = false

    if (data) {
      const mergedData = mergeEventPages(data)
      const cache = {
        lastUpdate: Date.now(),
        data: mergedData,
      }

      store.setItem('home-data', cache).then(() => {
        if (!isCancelled) {
          setResults(mergedData)
        }
      })
    }

    return () => {
      isCancelled = true
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  useEffect(() => {
    if (results) {
      setLoading(false)
    }
  }, [results])

  useEffect(() => {
    let isCancelled = false

    if (governanceInfo) {
      store.getItem('home-data').then((cache: any) => {
        if (!isCancelled) {
          const { lastUpdate, data: cachedData } = cache || {}
          // Do not update for REACT_APP_HOME_DATA_TTL min, 5 by default
          if (!cache || isBefore(addMinutes(lastUpdate, REACT_APP_HOME_DATA_TTL), Date.now())) {
            setSkipQuery(false)
          } else {
            setResults(cachedData)
          }
        }
      })
    }

    return () => {
      isCancelled = true
    }
  }, [governanceInfo])

  return { data: results, loading, error }
}

export default useHomeData
