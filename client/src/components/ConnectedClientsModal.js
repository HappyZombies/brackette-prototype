import React, { Component } from 'react';
import { FlatButton, Dialog, RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateBrackette } from '../actions/bracketteActions';

const ListOfClients = ({ allBrackettes, sendMatch }) => {
  const allClients = Object.keys(allBrackettes).map((theKey) => {
    return (
      allBrackettes[theKey].role === 'client' ?
        <RaisedButton
          onTouchTap={(e) => { e.preventDefault(); sendMatch(e, allBrackettes[theKey].socketId); }}
          key={theKey}
          id={allBrackettes[theKey].socketId}
          disabled={allBrackettes[theKey].inprogress}
          style={{ marginRight: '20px' }}
        >
          {allBrackettes[theKey].name}
        </RaisedButton>
        : null
    );
  });
  return (<div>Send this match to a client.<br />{allClients}</div>);
};

class ConnectedClientsModal extends Component {

  sendMatch(e, socketId) {
    const { specificMatch } = this.props;
    const messageToClient = {
      specificMatch: specificMatch,
      socketId: socketId
    };
    this.props.socket.emit('send private match details', messageToClient);
    this.props.closeClientModal();
  }
  render() {
    const { closeClientModal, openModal, brackette } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={(e) => { e.preventDefault(); closeClientModal(); }}
      />,
    ];
    const self = this;
    return (
      <Dialog
        title="Send Match to Client"
        actions={actions}
        open={openModal}
        contentStyle={{ height: 1000 }}>
        <ListOfClients allBrackettes={brackette.allBrackettes} sendMatch={self.sendMatch.bind(self)} />
      </Dialog>
    );
  }
}
const mapStateToProps = state => ({
  brackette: state.brackette
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateBrackette
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedClientsModal);
