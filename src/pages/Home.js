import React, {Component} from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import SetupModal from '../components/SetupModal'
import HomeDisplayContainer from '../components/HomeDisplayContainer'
import io from 'socket.io-client'

import * as utils from '../util'
import '../css/Home.css'

import Brackette from '../Brackette'

const socket = io()

class Home extends Component {
  constructor () {
    super()
    if (!utils.isBracketteSet()) {
      // This user does not have a Brackette object set yet, let's make them one.
      console.log('localStorage brackette is not present. creating it now')
      this.brackette = new Brackette()
      utils.updateBracketteObj(this.brackette) // add an empty Brackette object to local storage
    } else {
      // brackette object is already present, so set this.brackette to that value.
      console.log('localstorage brackette object is present, retrieve it now')
      this.brackette = utils.getBracketteObj()
    }
    this.state = {brackette: this.brackette} // add brackette object to state.
    this.handleBracketteChange = this.handleBracketteChange.bind(this) // bind our methods
    socket.on('brackette error', (err) => {
      alert(err.message) // TODO: Handle this better...
      // this.setState({error: true})
    })
  }

  render () {
    // Do not show HomeDisplay if we are not setup yet...
    const homeDisplay = this.state.brackette.isSetup ? <HomeDisplayContainer brackette={this.state.brackette} handleBracketteChange={this.handleBracketteChange} socket={socket} /> : <div />
    return (
      <div>
        {this.error}
        <Nav brackette={this.state.brackette} handleBracketteChange={this.handleBracketteChange} socket={socket} />
        <SetupModal handleBracketteChange={this.handleBracketteChange} />
        <div className='container brackette-container'>
          {homeDisplay}
        </div>
        <Footer />
      </div>
    )
  }

  handleBracketteChange (brackette) {
    // this should only be called when you change the value / update a value inside the brackette object.
    // we will update local storage and this state...
    utils.updateBracketteObj(brackette)
    this.setState({brackette})
  }

}

export default Home
