// npm modules
import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import { bindActionCreators } from "redux";
import { updateBrackette, deleteBrackette } from "../actions/bracketteActions";
import SettingsIcon from "material-ui/svg-icons/action/settings";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import RadioButton from "material-ui/RadioButton";
import RadioButtonGroup from "material-ui/RadioButton/RadioButtonGroup";

class SettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      name: this.props.brackette.name,
      role: this.props.brackette.role,
      tournamentId: this.props.brackette.tournamentId,
      subdomain: this.props.brackette.subdomain
    };
  }
  modal() {
    return (
      <Dialog
        title="User Settings"
        actions={[
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.handleClose.bind(this)}
          />,
          <FlatButton
            label="Submit"
            primary={true}
            onTouchTap={e => {
              e.preventDefault();
              this.handleSubmit();
            }}
          />
        ]}
        open={this.state.modalOpen}
        contentStyle={{ height: 1000 }}
      >
        <p>Update your settings here</p>
        <div>
          <TextField
            floatingLabelText="Name"
            id="settingsname"
            onChange={this.handleNameChange.bind(this)}
            value={this.state.name}
          />
          {(() => {
            if (this.props.brackette.role === "host") {
              return (
                <div>
                  <TextField
                    floatingLabelText="Tournament Id"
                    id="tournamentid"
                    onChange={this.handleTournamentIdChange.bind(this)}
                    value={this.state.tournamentId}
                  />
                  <TextField
                    floatingLabelText="Subdomain"
                    id="sudbomain-settings"
                    onChange={this.handleSubdomainChange.bind(this)}
                    value={this.state.subdomain}
                  />
                  <FlatButton
                    label="Refresh Match"
                    onTouchTap={e => {
                      e.preventDefault();
                      this.handleRefreshDevice(e);
                    }}
                  />
                </div>
              );
            }
            return (
              <FlatButton
                label="Reset Match"
                onTouchTap={e => {
                  e.preventDefault();
                  this.handleResetMatchTouch();
                }}
              />
            );
          })()}
          <FlatButton
            label="Reset Device"
            onTouchTap={e => {
              e.preventDefault();
              this.handleResetDevice(e);
            }}
          />
          <RadioButtonGroup
            name="role"
            onChange={this.handleRadioChange.bind(this)}
            defaultSelected={this.state.role}
          >
            <RadioButton value="host" label="Host" />
            <RadioButton value="client" label="Client" />
          </RadioButtonGroup>
        </div>
      </Dialog>
    );
  }
  handleTouchTap(e) {
    e.preventDefault();
    this.setState({
      modalOpen: true
    });
  }
  handleClose() {
    this.setState({
      modalOpen: false
    });
  }
  handleResetMatchTouch() {
    const { brackette, socket } = this.props;
    if (!brackette.inprogress) {
      // don't bother updating state if there is no match
      return;
    }
    if (window.confirm("Are you sure ? This will remove your current match.")) {
      const tempBrackette = _.cloneDeep(brackette);
      tempBrackette.inprogress = false;
      tempBrackette.currentMatch = {};
      socket.emit("add brackette", tempBrackette);
      this.handleClose();
    }
  }
  handleSubmit() {
    //TODO: If nothing change, don't update state! Useless re-render
    let tempBrackette = _.cloneDeep(this.props.brackette);
    // it is imperative to deep clone !
    tempBrackette.name = this.state.name;
    tempBrackette.subdomain = this.state.subdomain;
    tempBrackette.role = this.state.role;
    tempBrackette.tournamentId = this.state.tournamentId;
    tempBrackette.error = null;
    //^reset error...
    this.props.socket.emit("add brackette", tempBrackette);
    // consider putting sockets in redux so we don't have to pass it all the time ? well this is fine...
    this.handleClose();
  }
  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  handleTournamentIdChange(e) {
    this.setState({
      tournamentId: e.target.value
    });
  }
  handleSubdomainChange(e) {
    this.setState({
      subdomain: e.target.value
    });
  }
  handleRadioChange(e) {
    this.setState({
      role: e.target.value
    });
  }
  handleResetDevice(e) {
    const { deleteBrackette } = this.props;
    if (window.confirm("Are you sure ? This will reset your device.")) {
      deleteBrackette(this.props.brackette.id);
    }
  }

  handleRefreshDevice(e) {
    const {socket} = this.props;
    socket.emit("refresh match");
    this.handleClose();
  }

  render() {
    return (
      <div>
        <IconButton
          onTouchTap={e => {
            e.preventDefault();
            this.handleTouchTap(e);
          }}
        >
          <SettingsIcon />
        </IconButton>
        {this.modal()}
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
      updateBrackette,
      deleteBrackette
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);
