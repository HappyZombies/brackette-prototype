import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import { updateBrackette } from '../actions/bracketteActions';
import OpenMatchesList from './OpenMatchesList';
import _ from 'lodash';
import '../brackette.css';

class HostView extends Component {

  componentDidMount() {
    const { socket } = this.props;
    const self = this;
    socket.on('receive matches', (allOpenMatches) => {
      let tempBrackette = _.cloneDeep(self.props.brackette);
      tempBrackette.allOpenMatches = allOpenMatches;
      self.props.updateBrackette(tempBrackette);
    });
  }

  render() {
    const challongeURL = this.props.brackette.subdomain
      ? `http://${this.props.brackette.subdomain}.challonge.com/${this.props.brackette.tournamentId}/module`
      : `http://challonge.com/${this.props.brackette.tournamentId}/module`;
    return (
      <Tabs tabItemContainerStyle={{ backgroundColor: '#FFEB3B' }} inkBarStyle={{ backgroundColor: '#00E6FF' }}>
        <Tab label="Matches" style={{ color: 'black' }}>
          <OpenMatchesList socket={this.props.socket} />
        </Tab>
        <Tab label="Brackets" style={{ color: 'black' }}>
          <iframe title="challonge-tab" src={challongeURL} width="100%" height="500" frameBorder="0" scrolling="auto" allowTransparency="true" />
        </Tab>
        <Tab label="Results" disabled style={{ color: 'black' }}>
          <div className="bracketteCenter">
            <p>History of Results coming soon....</p>
          </div>
        </Tab>
      </Tabs>
    );
  }

}

const mapStateToProps = state => ({
  brackette: state.brackette
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBrackette
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HostView);
