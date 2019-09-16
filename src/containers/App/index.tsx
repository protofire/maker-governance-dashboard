import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyle from '../../theme/globalStyle'

// Pages
import Home from '../Home'
import Polls from '../Polls'
import Executive from '../Executive'

import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'

//Queries
import { GOVERNANCE_INFO_QUERY } from './queries'

const items = [
  { to: '/', label: 'DASHBOARD' },
  { to: '/executive', label: 'EXECUTIVE VOTES' },
  { to: '/polling', label: 'POLLING' },
]

const AppWrapper = styled.div`
  min-height: 400px;
  max-width:1100px
  margin: 0 auto;
  flex:1;
  padding: 0px 16px;
`
const Footer = styled.div`
  margin-top: 5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  span {
    display: flex;
    flex-direction: row;
    font-size: 10px;
    font-weight: 600;
    color: #303b3e;
    img {
      position: relative;
      bottom: 2px;
      left: 8px;
    }
  }
`

function App() {
  const { data, ...result } = useQuery(GOVERNANCE_INFO_QUERY)

  return (
    <>
      <GlobalStyle />
      <Breadcrumb>
        {console.log(data)}
        <Header lastSynced={result.loading || !data ? undefined : data.governanceInfo.lastSynced} items={items} />
      </Breadcrumb>
      <AppWrapper>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/executive" component={Executive} />
          <Route exact path="/polling" component={Polls} />
        </Switch>
      </AppWrapper>
      <Footer>
        <span>
          Built by <img alt="protofire" src="./protofire.png" />
        </span>
      </Footer>
    </>
  )
}

export default App
