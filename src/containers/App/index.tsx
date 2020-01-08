import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Switch, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import GlobalStyle, { theme } from '../../theme/globalStyle'

// Pages
import Home from '../Home'
import Polls from '../Polls'
import Executive from '../Executive'
import Vote from '../Vote'
import Poll from '../Poll'
// import VotingHistory from '../VotingHistory'

import Footer from '../../components/common/Footer'
import MainWrapper from '../../components/common/MainWrapper'
import MainScroll from '../../components/common/MainScroll'
import Header from '../../components/common/Header'

// Queries
import { GOVERNANCE_INFO_QUERY } from './queries'

const items = [
  { to: '/', label: 'DASHBOARD' },
  { to: '/executive', label: 'EXECUTIVE VOTES' },
  { to: '/polls', label: 'POLLS' },
  //{ to: '/voting-history', label: 'VOTING HISTORY' },
]

function App() {
  const { data, ...result } = useQuery(GOVERNANCE_INFO_QUERY)

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <MainWrapper>
          <Header lastSynced={result.loading || !data ? undefined : data.governanceInfo.lastSynced} items={items} />
          <MainScroll>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/executive" component={Executive} />
              <Route exact path="/executive/:id" component={Vote} />
              <Route exact path="/polls" component={Polls} />
              <Route exact path="/poll/:id" component={Poll} />
              {/*<Route exact path="/voting-history" component={VotingHistory} />*/}
            </Switch>
            <Footer />
          </MainScroll>
        </MainWrapper>
      </>
    </ThemeProvider>
  )
}

export default App
