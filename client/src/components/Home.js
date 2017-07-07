// npm modules
import React, { Component } from "react";
import { connect } from "react-redux";

import SetupModal from "./SetupModal";
import ViewContainer from "./ViewContainer";

class Home extends Component {
  // while pending, it is null, have conditional render.
  render() {
    return (
      this.props.brackette &&
      <div>
        <SetupModal {...this.props} />
        {this.props.brackette.isSetup ? <ViewContainer /> : <div />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  brackette: state.brackette
});

export default connect(mapStateToProps)(Home);
