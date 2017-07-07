import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, CardText } from "material-ui/Card";
import _ from "lodash";

import { updateBrackette } from "../actions/bracketteActions";
import CurrentMatchDisplay from "./CurrentMatchDisplay";

const EmptyCard = () => {
  return (
    <Card containerStyle={{ textAlign: "center", height: "250px" }}>
      <CardText style={{ padding: "90px" }}>
        <h1>Waiting for a match...</h1>
      </CardText>
    </Card>
  );
};

class ClientView extends Component {
  componentDidMount() {
    const { socket } = this.props;
    const self = this;
    socket.on("receive match details", currentMatch => {
      const tempBrackette = _.cloneDeep(self.props.brackette);
      tempBrackette.inprogress = true;
      tempBrackette.currentMatch = currentMatch;
      // emit...we do this because something change in the client side that needs to be shown to everyone.(aka host)
      socket.emit("add brackette", tempBrackette);
    });
    socket.on("remove current match", () => {
      const tempBrackette = _.cloneDeep(self.props.brackette);
      tempBrackette.inprogress = false;
      tempBrackette.currentMatch = {};
      socket.emit("add brackette", tempBrackette);
    });
  }
  render() {
    const matchDisplay =
      Object.keys(this.props.brackette.currentMatch).length === 0
        ? <EmptyCard />
        : <CurrentMatchDisplay
            currentMatch={this.props.brackette.currentMatch}
            socket={this.props.socket}
          />;
    return (
      <div className="bracketteCenter">
        {matchDisplay}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ClientView);
