import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _ from "lodash";
import {
  FlatButton,
  Dialog,
  TextField,
  RadioButton,
  RadioButtonGroup
} from "material-ui";
import { updateBrackette } from "../actions/bracketteActions";

class SetupModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      role: null
    };
  }
  handleClose() {
    const { name, role } = this.state;
    if (name && role) {
      let newBrackette = _.cloneDeep(this.props.brackette);
      newBrackette.name = name;
      newBrackette.role = role;
      newBrackette.isSetup = true;
      this.props.updateBrackette(newBrackette);
    }
  }
  handleTextChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  handleRadioChange(e) {
    this.setState({
      role: e.target.value
    });
  }
  render() {
    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />
    ];
    return (
      <Dialog
        title="User Setup"
        actions={actions}
        open={!this.props.brackette.isSetup}
        contentStyle={{ height: 1000 }}
      >
        <p>Before you continue, please specify your name and role.</p>
        <div>
          <TextField
            floatingLabelText="Name"
            id="Name"
            onChange={this.handleTextChange.bind(this)}
          />
          <RadioButtonGroup
            name="role"
            onChange={this.handleRadioChange.bind(this)}
          >
            <RadioButton value="host" label="TO" />
            <RadioButton value="client" label="Setup" />
          </RadioButtonGroup>
        </div>
      </Dialog>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateBrackette
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(SetupModal);
