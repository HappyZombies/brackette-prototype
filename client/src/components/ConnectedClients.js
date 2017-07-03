import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RaisedButton, Card, CardTitle, CardHeader, CardActions } from 'material-ui';
import { updateBrackette } from '../actions/bracketteActions';
import _ from 'lodash';
import '../simple-grid.css';

const BracketteCard = ({ bracketteUser, retrieveMatch }) => {
  console.dir(bracketteUser);
  const matchTitle = bracketteUser.currentMatch.player1Name + ' vs ' + bracketteUser.currentMatch.player2Name;
  return (
    <Card className="col-4" >
      <CardHeader title={matchTitle} subtitle={bracketteUser.name} />
      <CardActions>
        <RaisedButton label="Cancel" onTouchTap={retrieveMatch.bind(null, bracketteUser.socketId)} />
        <RaisedButton label="Manual Input" disabled />
      </CardActions>
    </Card>
  );
};

const ListOfClients = ({ allBrackettes, retrieveMatch }) => {
  const allClients = Object.keys(allBrackettes).map((theKey) => {
    return (
      allBrackettes[theKey].role === 'client'
        ? allBrackettes[theKey].inprogress ? <BracketteCard key={theKey} bracketteUser={allBrackettes[theKey]} retrieveMatch={retrieveMatch} /> : <div>Not in progress</div>
        : null
    );
  });
  return (<div className="row">{allClients}</div>);
};

class ConnectedClients extends Component {
  constructor(){
    super();
    this.retrieveMatch = this.retrieveMatch.bind(this);
  }
  retrieveMatch(bracketteSocketId){
    console.log('i have the socket id -> ', bracketteSocketId);
    // let tempBrackette = _.cloneDeep(this.props.brackette);
    // tempBrackette.allBrackettes[bracketteSocketId].currentMatch = {};
    // tempBrackette.allBrackettes[bracketteSocketId].inprogress = {};
    // // send an emit to the client that will remove their current match.
    // updateBrackette(tempBrackette);
  }
  render() {
    const { brackette } = this.props;
    return (
      <ListOfClients allBrackettes={brackette.allBrackettes} retrieveMatch={this.retrieveMatch}/>
    );
  }
}
const mapStateToProps = state => ({
  brackette: state.brackette
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBrackette
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedClients);
