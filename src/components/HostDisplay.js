import React, {Component} from 'react'
import OpenMatchesDisplay from './OpenMatchesDisplay'

class HostDisplay extends Component {

  componentDidMount () {
    // Host needs...matches...and players name...
    const {socket, brackette, handleBracketteChange} = this.props
    socket.on('receive matches', (allOpenMatches) => {
      let tempBrackette = brackette
      tempBrackette.allOpenMatches = allOpenMatches
      handleBracketteChange(tempBrackette)
    })
  }

  render () {
    return (
      <div>
        <OpenMatchesDisplay {...this.props} />
      </div>
    )
  }

}

export default HostDisplay
