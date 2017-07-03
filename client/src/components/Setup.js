// npm modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// material ui modules
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { yellow600 } from 'material-ui/styles/colors';

// our modudles
import { updateSetupStatus } from '../actions/setupStatusActions';

const styles = {
  underlineStyle: {
    borderColor: yellow600,
  },
};

class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apikey: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(e) {
    this.setState({
      apikey: e.target.value
    });
  }

  handleClick(e) {
    this.props.updateSetupStatus(this.state.apikey);
  }

  render() {
    return (
      <div>
        <TextField
          floatingLabelText="Challonge API Key"
          underlineFocusStyle={styles.underlineStyle}
          onChange={this.handleChange}
          errorText={this.props.error}
        />
        <br />
        <RaisedButton label="Submit" primary={true} onTouchTap={this.handleClick} />
      </div>
    );

  }
}

const mapStateToProps = state => ({
  error: state.setupStatus.error
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateSetupStatus
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Setup);
