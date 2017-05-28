import React, {Component} from 'react'
import {Modal, Button} from 'react-materialize'

class ConnectedClientsModal extends Component {

  constructor () {
    super()
    this.sendMatch = this.sendMatch.bind(this)
  }
  componentDidMount () {
    global.$('#allClientsModal').modal('open')
    console.dir('connected clients modall....')
  }
  render () {
    return (
      <Modal
        header='Setup'
        id='allClientsModal'
        actions={<Button waves='light' modal='close' flat>Cancel</Button>}
        modalOptions={{
          dismissible: false,
          complete: (modal, trigger) => {
            this.props.hideAllCleintsModal()
          }
        }}
        >
        {this.modalData()}
      </Modal>
    )
  }

  modalData () {
    // This is mainly to simplify and cut down on the render()
    const allClients = Object.keys(this.props.brackette.allBrackettes).map((theKey) => {
      return (<Button
        onClick={this.sendMatch}
        key={theKey}
        id={this.props.brackette.allBrackettes[theKey].socketId}
        disabled={this.props.brackette.allBrackettes[theKey].inprogress}
      >
        {this.props.brackette.allBrackettes[theKey].name}
      </Button>)
    })
    return (<p>Send this match to a client.<br />{allClients}</p>)
  }
  sendMatch (e) {
    console.log('send match', this.props.specificMatch)
    console.log('to...', e.target.id)
    const messageToClient = {
      specificMatch: this.props.specificMatch,
      socketId: e.target.id
    }
    let tempBrackette = this.props.brackette
    tempBrackette.allOpenMatches[this.props.matchPos].match.inprogress = true
    this.props.handleThisOpenMatchesState(tempBrackette.allOpenMatches) // update the state OpenMatchesDispaly!
    this.props.socket.emit('send private match details', messageToClient)
    global.$('#allClientsModal').modal('close')
  }
}

export default ConnectedClientsModal
