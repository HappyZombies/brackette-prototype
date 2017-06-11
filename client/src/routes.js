import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Setup from './pages/Setup'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ChangeLog from './pages/ChangeLog'

const Routes = (setup) => (
  <Switch>
    <Route exact path='/' component={Home} />
    <Route exact path='/setup' component={() => <Setup setup={setup} />} /> { /* Do we even want this as a route ? */}
    <Route exact path='/change-log' component={ChangeLog} /> { /* Do we even want this as a route ? */}
    <Route exact path='*' component={NotFound} />
  </Switch>
)

export default Routes
