import React, { Component } from 'react'
import OpenMatchesDisplay from './OpenMatchesDisplay'
import { Tabs, Tab } from 'react-materialize'

class HostDisplay extends Component {

  componentDidMount() {
    // Host needs...matches...and players name...
    const { socket, brackette, handleBracketteChange } = this.props
    socket.on('receive matches', (allOpenMatches) => {
      let tempBrackette = brackette
      tempBrackette.allOpenMatches = allOpenMatches
      handleBracketteChange(tempBrackette)
    })
  }

  render() {
    return (
      <Tabs>
        <Tab title="Open Matches" active><OpenMatchesDisplay {...this.props} /></Tab>
        <Tab title="Challonge"><iframe title="challonge-tab" src={"http://challonge.com/" + this.props.brackette.currentTournamentId + "/module"} width="100%" height="500" frameBorder="0" scrolling="auto" allowTransparency="true"></iframe></Tab>
      </Tabs>
    )
  }

}

export default HostDisplay
