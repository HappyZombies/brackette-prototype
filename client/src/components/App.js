import React, { Component } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Setup from '../pages/Setup'
import { Preloader } from 'react-materialize'
import { isAppSetup } from '../util'
import { IS_APP_SETUP } from '../util/localStorageNames'

import Routes from '../routes'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = { setup: isAppSetup(), done: isAppSetup() } // assume done = false first...
    this.handleSetupChange = this.handleSetupChange.bind(this)
  }

  componentDidMount() {
    if (!isAppSetup()) {
      // if null or false, grab the actual value from our config and set it to that...
      fetch('/setup/setup-config')
        .then((responseJson) => {
          if (responseJson.ok) {
            responseJson.json().then(json => {
              // we set our state and our local storage
              // that way we know we are setup and do not need to make a request to this express end point again, unless the local storage is gone or false.
              this.setState({
                setup: json.setup,
                done: true
              })
              localStorage.setItem(IS_APP_SETUP, json.setup)
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      // app is setup, just set our done state ...
      this.setState({ done: true })
    }
    // carry on...
  }
  render() {
    if (this.state.done && !this.state.setup) {
      // setup is false, we gotta Setup!.
      return <Setup handleSetupChange={this.handleSetupChange} />
    } else if (this.state.done && this.state.setup) {
      // we are good to go, render our Routes
      // TODO: If this will end up being only one page...do we even need routes ?
      return (
        <BrowserRouter>
          <Switch>
            <Routes setup={this.state.setup} />
          </Switch>
        </BrowserRouter>
      )
    }
    // we are waiting for done to be set...aka waiting for our fetch(), just show a loading screen.
    return <div className='container center-align'><Preloader flashing /></div>
  }

  handleSetupChange(data) {
    this.setState({
      setup: data
    })
  }

}

export default App
