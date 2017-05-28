import React, {Component} from 'react'
import _ from 'lodash'
import * as utils from '../util'

import HostDisplay from './HostDisplay'
import ClientDisplay from './ClientDisplay'

class HomeDisplayContainer extends Component {

  componentDidMount () {
    console.log('Home Display mounted.')
    const {socket, brackette, handleBracketteChange} = this.props
    socket.emit('add brackette', brackette)
    socket.on('update brackettes', (allBrackettes) => {
      let tempBrackette = brackette
      tempBrackette.allBrackettes = allBrackettes
      tempBrackette.socketId = _.find(tempBrackette.allBrackettes, function (obj) {
        return obj.id === tempBrackette.id
      }).socketId // get our socketId based on unique id ...
      // delete ourselve from allBrackettes...
      delete tempBrackette.allBrackettes[tempBrackette.socketId]
      handleBracketteChange(tempBrackette)
    })
  }

  render () {
    console.log('rendering home display container...')
    const {brackette} = this.props
    // const connectedPeople = Object.keys(brackette.allBrackettes).map((theKey) => {
    //   return (<li key={theKey}>{brackette.allBrackettes[theKey].name}</li>)
    // })
    const appropiateDisplay = (utils.isHost()) ? <HostDisplay {...this.props} /> : <ClientDisplay {...this.props} />
    return (
      <div>
        <p>Hello {brackette.name}</p>
        {appropiateDisplay}
      </div>
    )
  }

}

export default HomeDisplayContainer
