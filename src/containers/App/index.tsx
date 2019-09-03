import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyle from '../../theme/globalStyle'

import Home from '../Home'
import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'

const items = [{ to: '/', label: 'Dashboard' }]

const AppWrapper = styled.div`
  min-height: 400px;
  padding: 0px 16px;
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
    </Fragment>
  )
}

export default App
