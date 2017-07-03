import React, { Component } from 'react';
import io from 'socket.io-client';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateBrackette } from '../actions/bracketteActions';
import HostView from '../components/HostView';
import ClientView from '../components/ClientView';
import Navbar from './Navbar';
import SnackBar from 'material-ui/Snackbar';

class ViewContainer extends Component {
  constructor(props) {
    super(props);
    this.socket = io();
    const self = this;
    this.socket.emit('add brackette', this.props.brackette); // now emit with an empty allBrackettes so no infinite loops occur.
    // this.socket.on('connected', () => {
    //   // we have connected for the first time ... we don't know if they refreshed or not...no matter, we must delete their all brackettes.
    //   let tempBrackette = _.cloneDeep(this.props.brackette);
    //   // this.socket.emit('add brackette', tempBrackette); // now emit with an empty allBrackettes so no infinite loops occur.
    // });
    this.socket.on('update brackettes', (allBrackettes) => {
      // get our brackette based on unique id ...
      let tempBrackette = _.find(allBrackettes, (obj) => {
        return obj.id === self.props.brackette.id;
      });
      tempBrackette.allBrackettes = allBrackettes;
      tempBrackette.error = null;
      // delete ourselve from allBrackettes...
      delete tempBrackette.allBrackettes[tempBrackette.socketId];
      this.props.updateBrackette(tempBrackette); // everytime add brackette is called, this emitter will be called. so update the brackette state.
      // NOTE: So everytime someone refresh, it cause everything (expect App) to re-render because the socket id has changed.
      // I wonder if there is any way to account for this ?
    });
    //^^ WTF ??? why doesn't this.props work on below but it works on above ?
    this.socket.on('brackette error', (err) => {
      alert(err.message);
      //TODO: DO not update state if we already have a brackette error present. Use local storage ?
      // let tempBrackette = _.cloneDeep(self.props.brackette);
      // tempBrackette.error = err.message;
      // this.props.updateBrackette(tempBrackette);
    });
  }

  render() {
    return (
      <div>
        <Navbar socket={this.socket} name={this.props.brackette.name} />
        {(this.props.brackette.role === 'host') ? <HostView socket={this.socket} /> : <ClientView socket={this.socket} />}
        <SnackBar
          open={this.props.brackette.error ? true : false}
          message={this.props.brackette.error ? <span><span style={{ color: 'red' }}>ERROR: </span>{this.props.brackette.error}</span> : ""}
          autoHideDuration={5000}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewContainer);
