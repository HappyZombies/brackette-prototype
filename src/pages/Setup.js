import React, {Component} from 'react'
import {Row, Input, Button} from 'react-materialize'

// This page is straightforward

class Setup extends Component {

  constructor (props) {
    super(props)
    this.state = {apikey: ''}

    // Recall that the this is lost! So bind the methods.
    this.handleApiChange = this.handleApiChange.bind(this)
    this.submitSetup = this.submitSetup.bind(this)
  }

  render () {
    if (this.props.setup) {
      return <p className='flow-text container'>You are already setup</p>
    }
    return (
      <div className='container'>
        <p className='flow-text'>Please enter your Challonge API Key to continue.</p>
        <i>See <a href='https://api.challonge.com/v1' target='_blank' rel='noopener noreferrer'>here</a> for how to get an API Key</i>
        <Row>
          <form className='col s12' >
            <Row>
              <Input s={12} label='API Key' validate name='apikey' onChange={this.handleApiChange} required />
            </Row>
            <br />
            <Row>
              <div className='col s12'>
                <Button waves='light' type='submit' onClick={this.submitSetup}>Submit</Button>
              </div>
            </Row>
          </form>
        </Row>
      </div>
    )
  }

  handleApiChange (e) {
    this.setState({apikey: e.target.value})
  }

  submitSetup (e) {
    e.preventDefault()
    fetch('/setup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        apikey: this.state.apikey
      })
    }).then((res) => {
      if (res.ok) { // this means that the actual url call was succesful :P
        res.json().then(json => {
          if (json.hasOwnProperty('error')) {
            alert('The API Key you entered is invalid') // TODO: Consider something else than this alert.
            return
          }
          // the api key is good !
          this.props.handleSetupChange(true) // update App.js
        })
      }
    }).catch((err) => {
      console.error(err)
    })
  }

}

export default Setup
