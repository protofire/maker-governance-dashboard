import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../Home'

import './index.css'

function App() {
  return (
    <div className="App">
      <p>Maker Governance Dashboard</p>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  )
}

export default App
