import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Switch, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import GlobalStyle, { theme } from '../../theme/globalStyle'
import store from '../../utils/cache'

// Pages
import Home from '../Home'
import Polls from '../Polls'
import Executive from '../Executive'
import Vote from '../Vote'
import Poll from '../Poll'
import VoterHistory from '../VoterHistory'
import VotingHistory from '../VotingHistory'

import Footer from '../../components/common/Footer'
import MainWrapper from '../../components/common/MainWrapper'
import MainScroll from '../../components/common/MainScroll'
import Header from '../../components/common/Header'

// Queries
import { GOVERNANCE_INFO_QUERY } from './queries'
import { fromUnixTime } from 'date-fns'
import { isBefore } from 'date-fns/esm'
import { FullLoading } from '../../components/common'

const items = [
  { to: '/', label: 'DASHBOARD' },
  { to: '/executive', label: 'EXECUTIVE VOTES' },
  { to: '/polls', label: 'POLLS' },
  { to: '/voting-history', label: 'VOTING HISTORY' },
]

const LAST_CACHE_UPDATE = process.env.REACT_APP_LAST_CACHE_UPDATE || 0

function App() {
  const [cacheInitialized, setCacheInitialized] = useState(false)
  const { data, ...result } = useQuery(GOVERNANCE_INFO_QUERY)

  useEffect(() => {
    store.getItem<any>('last-update').then(value => {
      if (!value || isBefore(fromUnixTime(value), fromUnixTime(Number(LAST_CACHE_UPDATE)))) {
        console.log('ENTRANDO')
        import(`../../data/maker-governance-${LAST_CACHE_UPDATE}.json`).then(data => {
          Promise.all(
            Object.keys(data.default).map(key => {
              return store.setItem(key, data.default[key])
            }),
          ).then(() => {
            store.setItem('last-update', (Date.now() / 1000).toFixed(0))
            setCacheInitialized(true)
          })
        })
      } else {
        console.log('ELSE')
        setCacheInitialized(true)
      }
    })
  }, [])

  console.log('cacheInitialized', cacheInitialized)

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <MainWrapper>
          <Header lastSynced={result.loading || !data ? undefined : data.governanceInfo.lastSynced} items={items} />
          <MainScroll>
            {cacheInitialized ? (
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/executive" component={Executive} />
                <Route exact path="/executive/:id" component={Vote} />
                <Route exact path="/polls" component={Polls} />
                <Route exact path="/poll/:id" component={Poll} />
                <Route exact path="/voter/:id" component={VoterHistory} />
                <Route exact path="/voting-history" component={VotingHistory} />
              </Switch>
            ) : (
              <FullLoading />
            )}
            <Footer />
          </MainScroll>
        </MainWrapper>
      </>
    </ThemeProvider>
  )
}

export default App
