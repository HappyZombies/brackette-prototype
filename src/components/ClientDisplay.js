import React, {Component} from 'react'
import * as utils from '../util'
import {Row, Input, Button} from 'react-materialize'
import _ from 'lodash'

class ClientDisplay extends Component {
  constructor () {
    super()
    this.state = {currentMatch: {}, hostBrackette: {}}
    this.submitResult = this.submitResult.bind(this)
  }
  componentDidMount () {
    console.log('Host Display mounted.')
    const {brackette, socket, handleBracketteChange} = this.props
    socket.on('receive match details', (currentMatch) => {
      console.log('yo someone sent us a message')
      console.dir(currentMatch)
      const tempBrackette = brackette
      tempBrackette.inprogress = true
      tempBrackette.currentMatch = currentMatch
      this.setState({currentMatch: currentMatch})
      utils.setCurrentMatchObj(currentMatch)
      socket.emit('add brackette', tempBrackette) // :/ .... dont like this... but it's to update the inprogress for this brackette object.
      handleBracketteChange(tempBrackette)
      this.setState({hostBrackette: _.find(brackette.allBrackettes, function (brack) {
        return brack.role === 'host'
      })})
    })
    if (utils.isCurrentMatchSet()) {
      this.setState({currentMatch: utils.getCurrentMatchObj()})
    }
    this.setState({hostBrackette: _.find(brackette.allBrackettes, function (brack) {
      return brack.role === 'host'
    })})
  }

  render () {
    const matchDisplay = Object.keys(this.state.currentMatch).length === 0 ? <div>Waiting for a match...</div> : this.currentMatchDisplay()
    return (
      <div>Hello from ClientDisplay
        {matchDisplay}
      </div>
    )
  }

  currentMatchDisplay () {
    return (
      <Row>
        <Input s={6} label={this.state.currentMatch.match.player1Name + ' score'} type='number' id='player1score' defaultValue='0' />
        <Input s={6} label={this.state.currentMatch.match.player2Name + ' score'} type='number' id='player2score' defaultValue='0' />
        <p>Winner</p>
        <Input s={6} label={this.state.currentMatch.match.player1Name} type='radio' name='theWinner' value={this.state.currentMatch.match.player1Id} />
        <Input s={6} label={this.state.currentMatch.match.player2Name} type='radio' name='theWinner' value={this.state.currentMatch.match.player2Id} />
        {/* <Button onClick={this.submitResult}>Send to { (this.state.hostBrackette ? this.state.hostBrackette.name : "Host"}</Button> */}
        <Button onClick={this.submitResult}>Send to Host</Button>
      </Row>
    )
  }

  submitResult () {
    console.log('we submitted')
    // so sorry.
    const winnerId = global.$('input[name=theWinner]:checked').val()
    if (window.confirm('Are these results correct') && winnerId) {
      const matchRes = {
        match: {
          matchId: this.state.currentMatch.match.id,
          winnerId: winnerId,
          score: global.$('#player1score').val() + '-' + global.$('#player2score').val()
        },
        hostToSend: this.state.hostBrackette
      }

      this.props.socket.emit('send match results', matchRes)
      // match was sent...now update our brackette stuff
      this.setState({currentMatch: {}})
      const tempBrackette = this.props.brackette
      tempBrackette.inprogress = false
      // this.props.handleBracketteChange(tempBrackette)
      utils.removeCurrentMatchObj()
      this.props.socket.emit('add brackette', tempBrackette)
    } else {
      console.log('do nothing...they cancelled...')
    }
  }

}

export default ClientDisplay
