// npm modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// material ui modules
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';

// our modules
import { getSetupStatus } from '../actions/setupStatusActions';
import { fetchBrackette, addBrackette } from '../actions/bracketteActions';

import Setup from './Setup';
import Home from './Home';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.getSetupStatus();
  }

  render() {
    const { pending, setup } = this.props;
    return (
      <MuiThemeProvider >
        <div>
          {(() => {
            if (pending) {
              return <CircularProgress size={60} thickness={7} />;
            }
            if (!setup) {
              return <Setup />;
            }
            this.props.fetchBrackette();
            return <Home />;
          })()}
        </div>
      </MuiThemeProvider>
    );
  }

}

const mapStateToProps = state => ({
  setup: state.setupStatus.setup,
  pending: state.setupStatus.pending
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getSetupStatus,
  fetchBrackette,
  addBrackette
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
