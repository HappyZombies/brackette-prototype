import React, { Component } from 'react'
import { Modal, Input, Button, Row } from 'react-materialize'

import * as utils from '../util'

class SetupModal extends Component {

  constructor(props) {
    super(props)
    this.brackette = utils.getBracketteObj() // why not state ? Good question...TODO: Update to state instead of local ?
  }

  componentDidMount() {
    if (!this.brackette.isSetup) {
      global.$('#setupModal').modal('open')
    }
  }
  render() {
    return (
      <Modal
        header='Setup'
        id='setupModal'
        actions={<Button waves='light' modal='close' flat>Submit</Button>}
        modalOptions={{
          dismissible: false,
          complete: (modal, trigger) => {
            // Validate form... have to use jquery...
            const name = global.$('#setupName').val()
            const role = global.$('input[name=role]:checked').val()
            if (name && role) {
              // great, now update the brackette object :)
              this.brackette.name = name
              this.brackette.role = role
              this.brackette.isSetup = true
              this.props.handleBracketteChange(this.brackette)
            } else {
              // person tried to exit out without filling out form.
              global.$('#setupModal').modal('open')
            }
          }
        }}
      >
        {this.modalForm()}
      </Modal>
    )
  }

  modalForm() {
    // This is mainly to simplify and cut down on the render()
    return (<div>
      <p>Before you continue, please specify your name and role.</p>
      <Row>
        <Input s={6} label='Name' id='setupName' />
      </Row>
      <p>Your Role </p>
      <Input name='role' type='radio' value='host' label='Host' />
      <Input name='role' type='radio' value='client' label='Client' />
    </div>)
  }

}

export default SetupModal
