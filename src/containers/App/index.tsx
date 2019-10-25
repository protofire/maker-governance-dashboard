import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyle from '../../theme/globalStyle'

// Pages
import Home from '../Home'
import Polls from '../Polls'
import Executive from '../Executive'
import Vote from '../Vote'
import Poll from '../Poll'

import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'

//Queries
import { GOVERNANCE_INFO_QUERY } from './queries'

const items = [
  { to: '/', label: 'DASHBOARD' },
  { to: '/executive', label: 'EXECUTIVE VOTES' },
  { to: '/polls', label: 'POLLS' },
]

const AppWrapper = styled.div`
  flex: 1;
  margin: 0 auto;
  max-width: 1100px;
  min-height: 400px;
  padding: 0px 16px;
`
const Footer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  margin-top: 5rem;

  span {
    color: #303b3e;
    display: flex;
    flex-direction: row;
    font-size: 10px;
    font-weight: 600;

    img {
      bottom: 2px;
      left: 8px;
      position: relative;
    }
  }
`

function App() {
  const { data, ...result } = useQuery(GOVERNANCE_INFO_QUERY)

  return (
    <>
      <GlobalStyle />
      <Breadcrumb>
        <Header lastSynced={result.loading || !data ? undefined : data.governanceInfo.lastSynced} items={items} />
      </Breadcrumb>
      <AppWrapper>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/executive" component={Executive} />
          <Route exact path="/executive/:id" component={Vote} />
          <Route exact path="/polls" component={Polls} />
          <Route exact path="/poll/:id" component={Poll} />
        </Switch>
      </AppWrapper>
      <Footer>
        <span>
          Built by <img alt="protofire" src="/protofire.png" />
        </span>
      </Footer>
    </>
  )
}

export default App
