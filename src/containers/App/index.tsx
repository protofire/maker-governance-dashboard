import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyle from '../../theme/globalStyle'

import Home from '../Home'
import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'

const items = [{ to: '/', label: 'DASHBOARD' }]

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
  return (
    <Fragment>
      <GlobalStyle />
      <Breadcrumb>
        <Header items={items} />
      </Breadcrumb>
      <AppWrapper>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </AppWrapper>
      <Footer>
        <span>
          Built by <img alt="protofire" src="./protofire.png" />
        </span>
      </Footer>
    </Fragment>
  )
}

export default App
