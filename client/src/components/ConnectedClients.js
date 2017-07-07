import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { RaisedButton, Card, CardHeader, CardActions } from "material-ui";
import { updateBrackette } from "../actions/bracketteActions";
import "../simple-grid.css";

const BracketteCard = ({ bracketteUser, retrieveMatch, manualInput }) => {
  const matchTitle = `${bracketteUser.currentMatch
    .player1Name} vs ${bracketteUser.currentMatch.player2Name}`;
  return (
    <Card className="col-4">
      <CardHeader title={matchTitle} subtitle={bracketteUser.name} />
      <CardActions>
        <RaisedButton
          label="Cancel"
          onTouchTap={retrieveMatch.bind(null, bracketteUser.socketId)}
        />
        <RaisedButton
          label="Manual Input"
          disabled
          onTouchTap={manualInput.bind(null, {
            bracketteSocketId: bracketteUser.socketId,
            currentMatch: bracketteUser.currentMatch
          })}
        />
      </CardActions>
    </Card>
  );
};

const ListOfClients = ({ allBrackettes, retrieveMatch, manualInput }) => {
  const allClients = Object.keys(allBrackettes).map(theKey => {
    return allBrackettes[theKey].role === "client"
      ? allBrackettes[theKey].inprogress
        ? <BracketteCard
            key={theKey}
            bracketteUser={allBrackettes[theKey]}
            retrieveMatch={retrieveMatch}
            manualInput={manualInput}
          />
        : <div>No setup in progress.</div>
      : null;
  });
  return (
    <div className="row">
      {allClients}
    </div>
  );
};

class ConnectedClients extends Component {
  constructor() {
    super();
    this.retrieveMatch = this.retrieveMatch.bind(this);
    this.manualInput = this.manualInput.bind(this);
  }
  retrieveMatch(bracketteSocketId) {
    if (window.confirm("Are you sure ? This will remove the current match.")) {
      this.props.socket.emit(
        "send removal of current match",
        bracketteSocketId
      );
    }
  }
  manualInput({ bracketteSocketId, currentMatch }) {
    console.log("manual input");
    console.log(bracketteSocketId);
    console.log(currentMatch);
  }
  render() {
    const { brackette } = this.props;
    return (
      <ListOfClients
        allBrackettes={brackette.allBrackettes}
        retrieveMatch={this.retrieveMatch}
        manualInput={this.manualInput}
      />
    );
  }
}
const mapStateToProps = state => ({
  brackette: state.brackette
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateBrackette
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedClients);
