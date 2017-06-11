import React, { Component } from 'react'
import { Navbar, NavItem, Icon } from 'react-materialize'
import SettingsModal from '../components/SettingsModal'
import '../css/Nav.css'

class Nav extends Component {

  render() {
    return (
      <Navbar brand='Brackette' right className='transparent'>
        <SettingsModal
          triggerComp={<NavItem><Icon>settings</Icon></NavItem>}
          {...this.props}
        />
      </Navbar>
    )
  }

}

export default Nav
