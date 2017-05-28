import React, {Component} from 'react'

import {Modal, Input, Button, Row} from 'react-materialize'
import * as utils from '../util'

class SettingsModal extends Component {

  render () {
    return (
      <Modal
        header='Settings'
        actions={<Button waves='light' modal='close' flat>Submit</Button>}
        trigger={this.props.triggerComp}
        modalOptions={{
          ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            if (utils.isHost()) {
              global.$('#settingsRoleHost').prop('checked', true)
            } else {
              global.$('#settingsRoleClient').prop('checked', true)
            }
          },
          complete: (modal, trigger) => {
            // Validate form... have to use jquery...
            // TODO: This will always update no matter the value...maybe that could change...
            const name = global.$('#settingsName').val()
            const tournamentId = global.$('#tournamentId').val()
            const role = global.$('input[name=settingsRole]:checked').val()
            const tempBrackette = this.props.brackette
            tempBrackette.name = name
            tempBrackette.role = role
            tempBrackette.currentTournamentId = role === 'host' && tournamentId ? tournamentId : '' // needs to be null.
            // utils.removeOpenMatchesObj() // again...we should check so we aren't always doing this...
            this.props.handleBracketteChange(tempBrackette)
            this.props.socket.emit('add brackette', tempBrackette)
            // better way ? ...i don't like this at all.
            // the reason is that add brackette will emit an 'update' event to tell everyon we have updated our object.
            // i guess this does work ...
          }
        }}>
        {this.settingsForm()}
      </Modal>
    )
  }

  settingsForm () {
    // ... How do I break this up... ? TODO: Break This up using ternary
    if (utils.isHost()) {
      return (
        <div>
          <Row>
            <Input s={6} label='Name' id='settingsName' defaultValue={this.props.brackette.name} key={`settingsName:${this.props.brackette.name || ''}`} />
            {/* See defect: https://github.com/facebook/react/issues/4101 for why we use key. */}
            <Input label='Tournament Id' id='tournamentId' defaultValue={this.props.brackette.currentTournamentId} key={`tournamentId:${this.props.brackette.currentTournamentId || ''}`} />
            <Input label='Subdomain' id='subdomain' disabled defaultValue={this.props.brackette.subdomain} key={`subdomain:${this.props.brackette.subdomain || ''}`} />
          </Row>
          <p>Role</p>
          <Input name='settingsRole' type='radio' value='host' label='Host' id='settingsRoleHost' />
          <Input name='settingsRole' type='radio' value='client' label='Client' id='settingsRoleClient' />
        </div>
      )
    }
    // else they are a client...
    return (<div>
      <Row>
        <Input s={6} label='Name' id='settingsName' defaultValue={this.props.brackette.name} key={`settingsName:${this.props.brackette.name || ''}`} />
      </Row>
      <p>Role</p>
      <Input name='settingsRole' type='radio' value='host' label='Host' id='settingsRoleHost' />
      <Input name='settingsRole' type='radio' value='client' label='Client' id='settingsRoleClient' />
    </div>)
  }
}

export default SettingsModal
