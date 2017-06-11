import React, { Component } from 'react'
import '../css/OpenMatchesDisplay.css'
import { Button, Card } from 'react-materialize'
import * as utils from '../util'
import _ from 'lodash'

import ConnectedClientsModal from './ConnectedClientsModal'

class OpenMatchesDisplay extends Component {

  constructor(props) {
    super(props)
    this.state = {
      openMatches: {},
      openClientsModal: false,
      matchIdToSend: {},
      matchPos: -1
    }
    this.allPlayersNames = null
    this.displayAllClientsModal = this.displayAllClientsModal.bind(this)
    this.hideAllCleintsModal = this.hideAllCleintsModal.bind(this)
    this.handleThisOpenMatchesState = this.handleThisOpenMatchesState.bind(this)
  }

  componentDidMount() {
    // first time we mount ... map player names based on their id
    // we dont care for brackette here, only for open matches !
    const { socket, brackette, handleBracketteChange } = this.props
    // do we need to listen for this...or do we already have our open matches ?
    socket.on('receive players names', (allPlayersNames) => {
      let tempBrackette = brackette // temp for state later....
      tempBrackette.allChallongePlayersName = allPlayersNames
      this.allPlayersNames = allPlayersNames
      for (const key in brackette.allOpenMatches) {
        tempBrackette.allOpenMatches[key].match.player1Name = tempBrackette.allChallongePlayersName[tempBrackette.allOpenMatches[key].match.player1Id]
        tempBrackette.allOpenMatches[key].match.player2Name = tempBrackette.allChallongePlayersName[tempBrackette.allOpenMatches[key].match.player2Id]
      }
      utils.setOpenMatchesObj(tempBrackette.allOpenMatches)
      // just update our state!
      this.setState({ openMatches: utils.getOpenMatchesObj() })
    })
    if (utils.isOpenMatchesSet()) {
      this.setState({ openMatches: utils.getOpenMatchesObj() })
    }
    socket.on('update matches', (allOpenMatches) => {
      let tempBrackette = brackette
      tempBrackette.allOpenMatches = allOpenMatches
      for (const key in allOpenMatches) {
        allOpenMatches[key].match.player1Name = this.allPlayersNames[allOpenMatches[key].match.player1Id]
        allOpenMatches[key].match.player2Name = this.allPlayersNames[allOpenMatches[key].match.player2Id]
      }
      utils.setOpenMatchesObj(allOpenMatches)
      // just update our state!
      handleBracketteChange(tempBrackette)
      this.setState({ openMatches: utils.getOpenMatchesObj() })
    })
  }

  render() {
    let openMatches = this.state.openMatches
    // but what if the client has an open match and we don't have that data ?
    // do this !

    const openMatchesHtml = Object.keys(openMatches).map((theKey) => {
      const matchTitle = openMatches[theKey].match.player1Name + ' vs ' + openMatches[theKey].match.player2Name
      // determine if we have a current match based on all brackettes.
      openMatches[theKey].match.inprogress = _.find(this.props.brackette.allBrackettes, (otherBrackette) => {
        if (Object.keys(otherBrackette.currentMatch).length !== 0) {
          // this brackette dude has a current match.
          const currentMatchWeAreIn = openMatches[theKey].match
          return currentMatchWeAreIn.id === otherBrackette.currentMatch.match.id
        }
      })
      openMatches[theKey].match.inprogress = openMatches[theKey].match.inprogress ? true : false // this is so dumb...it's cuz _.find returns us an object, and we don't want that.
      return (
        <Card key={theKey} title={matchTitle} id={'match_' + theKey} actions={[<Button key={theKey} id={'match_btn_' + theKey} disabled={openMatches[theKey].match.inprogress || false} className='sendMatchBtn' onClick={this.displayAllClientsModal}>Send Match</Button>]}>
          <i>{openMatches[theKey].match.inprogress ? 'In Progress' : 'Ready'}</i>
        </Card>
      )
    })
    return (
      <div>
        {this.state.openClientsModal && <ConnectedClientsModal handleThisOpenMatchesState={this.handleThisOpenMatchesState} hideAllCleintsModal={this.hideAllCleintsModal} matchPos={this.state.matchPos} specificMatch={this.state.matchToSend} {...this.props} />}
        {openMatchesHtml}
      </div>
    )
  }
  displayAllClientsModal(e) {
    const matchPos = e.target.id.replace(/\D/g, '')
    const match = this.state.openMatches[matchPos]
    this.setState({ openClientsModal: true, matchToSend: match, matchPos: matchPos })
  }

  hideAllCleintsModal(e) {
    this.setState({ openClientsModal: false, matchToSend: {}, matchPos: -1 })
  }

  handleThisOpenMatchesState(data) {
    utils.setOpenMatchesObj(data)
    this.setState({ openMatches: data })
  }
}

export default OpenMatchesDisplay
