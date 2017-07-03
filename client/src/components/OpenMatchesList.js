import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateBrackette } from '../actions/bracketteActions';
import _ from 'lodash';
import { Paper } from 'material-ui';
import Send from 'material-ui/svg-icons/content/send';
import ConnectedClientsModal from './ConnectedClientsModal';
import ConnectedClients from './ConnectedClients';
import '../brackette.css';

const OpenMatchesHTML = ({ openMatches, brackette, displayAllClientsModal }) => {
  if (_.isEmpty(openMatches)) {
    return null;
  }
  const html = Object.keys(openMatches).map((theKey) => {
    const matchTitle = openMatches[theKey].match.player1Name + ' vs ' + openMatches[theKey].match.player2Name;
    const matchRound = (openMatches[theKey].match.round < 0)
      ? `Losers Round ${Math.abs(openMatches[theKey].match.round)}`
      : `Winners Round ${openMatches[theKey].match.round}`;
    // Determine if the match is in progress if a brackette user has a current match that matches the list of open matches.
    let inprogress = _.find(brackette.allBrackettes, (otherBrackette) => {
      if (otherBrackette.inprogress) {
        // they are in progress (aka a client is) so get their match.
        const currentMatchWeAreIn = openMatches[theKey].match;
        return currentMatchWeAreIn.id === otherBrackette.currentMatch.id;
      }
    });
    inprogress = inprogress ? true : false;
    // this is so dumb...it's cuz _.find returns us an object, and we don't want that.
    return (
      <Paper key={theKey} style={{ height: '125px' }}>
        <h1>{matchTitle}</h1>
        <i>{matchRound} - </i>
        {inprogress ? <i>In Progress</i> : <i><strong>Ready</strong></i>}
        <div onClick={displayAllClientsModal.bind(null, 'match_' + theKey)} style={{ cursor: 'pointer', float: 'right' }}>
          <Send />
        </div>
      </Paper>
    );
  });
  return <div>Upcoming matches:{html}</div>;
};

class OpenMatchesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openMatches: {},
      openClientsModal: false,
      matchToSend: {},
      matchPos: -1
    };

  }

  componentDidMount() {
    const { socket, updateBrackette } = this.props;
    const self = this;
    socket.on('receive players names', (allPlayersNames) => {
      // we have received the players name. update our local storage
      let tempBrackette = _.cloneDeep(self.props.brackette);
      for (const key in tempBrackette.allOpenMatches) {
        tempBrackette.allOpenMatches[key].match.player1Name = _.clone(allPlayersNames[tempBrackette.allOpenMatches[key].match.player1Id]);
        tempBrackette.allOpenMatches[key].match.player2Name = _.clone(allPlayersNames[tempBrackette.allOpenMatches[key].match.player2Id]);
      }
      tempBrackette.allChallongePlayersName = _.cloneDeep(allPlayersNames);

      this.setState({ openMatches: tempBrackette.allOpenMatches });
      socket.emit('add brackette', tempBrackette);
    });
    socket.on('matches updated', (newOpenMatches) => {
      let tempBrackette = _.cloneDeep(self.props.brackette);
      // this newOpenMatches no longer has the names of the players. Get it from the brackette object.
      for (const key in newOpenMatches) {
        newOpenMatches[key].match.player1Name = tempBrackette.allChallongePlayersName[newOpenMatches[key].match.player1Id];
        newOpenMatches[key].match.player2Name = tempBrackette.allChallongePlayersName[newOpenMatches[key].match.player2Id];
      }
      tempBrackette.allOpenMatches = newOpenMatches;
      updateBrackette(tempBrackette);
      this.setState({ openMatches: newOpenMatches });
    });
    socket.on('brackette error', (err) => {
      // Woops, make sure we set everyting back to nothing...
      this.setState({ openMatches: {} });
    });
    if (_.isEmpty(this.state.openMatches) && !_.isEmpty(this.props.brackette.allOpenMatches)) {
      // determine if we need to set the state or not (only set state on the first time)
      // if state of open matches is empty AND the brackette object has matches, set the state for this component.
      this.setState({ openMatches: this.props.brackette.allOpenMatches });
    }
  }
  displayAllClientsModal(matchPosition, e) {
    const matchPos = matchPosition.replace(/\D/g, '');
    const match = this.state.openMatches[matchPos].match;
    this.setState({ openClientsModal: true, matchToSend: match, matchPos: matchPos });
  }
  handleThisOpenMatchesState(data) {
    this.setState({ openMatches: data });
  }
  closeClientModal(e) {
    this.setState({ openClientsModal: false, matchToSend: {}, matchPos: -1 });
  }
  render() {
    return (
      <div className="bracketteCenter">
        <ConnectedClients />
        <hr />
        <ConnectedClientsModal
          openModal={this.state.openClientsModal}
          handleThisOpenMatches={this.handleThisOpenMatchesState}
          closeClientModal={this.closeClientModal.bind(this)}
          matchPosition={this.state.matchPos}
          specificMatch={this.state.matchToSend}
          socket={this.props.socket}
        />
        <OpenMatchesHTML openMatches={this.state.openMatches} brackette={this.props.brackette} displayAllClientsModal={this.displayAllClientsModal.bind(this)} />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  brackette: state.brackette
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBrackette
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OpenMatchesList);
