import React from 'react';
import AppBar from 'material-ui/AppBar';
import SettingsModal from './SettingsModal';

const Nav = ({ socket, name }) => {
  return (<div>
    <AppBar
      title={name}
      style={{ boxShadow: 'none', backgroundColor: '#FFEB3B' }}
      iconElementRight={<SettingsModal socket={socket} />}
      titleStyle={{ color: 'black' }}
      iconStyleLeft={{ color: 'black' }}
    />
  </div>
  );

};

export default Nav;
