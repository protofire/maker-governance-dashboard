import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyle from '../../theme/globalStyle'

import Home from '../Home'
import Breadcrumb from '../../components/Breadcrumb'
import Header from '../../components/Header'

const items = [{ to: '/', label: 'Dashboard' }]

const AppWrapper = styled.div`
  background-color: #fafafa;
`

function App() {
  return (
    <Fragment>
      <GlobalStyle />
      <AppWrapper>
        <Breadcrumb>
          <Header items={items} />
        </Breadcrumb>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </AppWrapper>
    </Fragment>
  )
}

export default App
