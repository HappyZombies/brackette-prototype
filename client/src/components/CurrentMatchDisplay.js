import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { GridList, FloatingActionButton } from 'material-ui';
import Send from 'material-ui/svg-icons/content/send';
import _ from 'lodash';
import { updateBrackette } from '../actions/bracketteActions';
import MatchCard from './MatchCard';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    height: 450,
    overflowY: 'auto',
    margin: '0 auto'
  },
};
class CurrentMatchDisplay extends Component {
  constructor() {
    super();
    this.state = {
      player1score: 0,
      player2score: 0
    };
  }
  onPlayer1ScoreIncrease() {
    // this.setState({ player1score: this.state.player1score++ });  ????
    const updateScore = this.state.player1score + 1;
    this.setState({ player1score: updateScore });
  }
  onPlayer1ScoreDecrease() {
    const updateScore = this.state.player1score - 1;
    if (updateScore < 0) {
      return;
    }
    this.setState({ player1score: updateScore });
  }
  onPlayer2ScoreIncrease() {
    const updateScore = this.state.player2score + 1;
    this.setState({ player2score: updateScore });
  }
  onPlayer2ScoreDecrease() {
    const updateScore = this.state.player2score - 1;
    if (updateScore < 0) {
      return;
    }
    this.setState({ player2score: updateScore });
  }
  submitResult(e) {
    const { currentMatch, socket } = this.props;
    let player1Score = this.state.player1score;
    let player2Score = this.state.player2score;
    if (isNaN(player1Score) || isNaN(player2Score)) {
      alert('The values you entered are not numbers!');
      return;
    }

    player1Score = parseInt(player1Score, 10);
    player2Score = parseInt(player2Score, 10);

    if (player1Score < 0 || player2Score < 0) {
      alert('Scores cannot be negative.');
      return;
    }
    if (player1Score === player2Score) {
      alert('The values you entered are should not equal each other!');
      return;
    }
    const winnerId = player1Score < player2Score ? currentMatch.player2Id : currentMatch.player1Id;
    if (window.confirm('Are these results correct') && winnerId) {
      const matchRes = {
        match: {
          matchId: currentMatch.id,
          winnerId: winnerId,
          score: player1Score + '-' + player2Score
        }
      };
      socket.emit('send match results', matchRes);
      const tempBrackette = _.cloneDeep(this.props.brackette);
      tempBrackette.inprogress = false;
      tempBrackette.currentMatch = {};
      socket.emit('add brackette', tempBrackette);
    }
  }
  componentDidMount() {
    // -___-
    document.getElementsByClassName('stupidcssfix')[0].parentElement.style.width = "auto";
    document.getElementsByClassName('stupidcssfix')[0].parentElement.style.margin = "0 auto";
  }
  render() {
    const { currentMatch } = this.props;
    return (
      <div>
        <GridList cellHeight={180} style={styles.gridList} >
          <MatchCard
            playerName={currentMatch.player1Name}
            score={this.state.player1score}
            handleIncrease={this.onPlayer1ScoreIncrease.bind(this)}
            handleDecrease={this.onPlayer1ScoreDecrease.bind(this)}
          />
          <MatchCard
            playerName={currentMatch.player2Name}
            score={this.state.player2score}
            handleIncrease={this.onPlayer2ScoreIncrease.bind(this)}
            handleDecrease={this.onPlayer2ScoreDecrease.bind(this)}
          />
          <FloatingActionButton onTouchTap={(e) => { e.preventDefault(); this.submitResult(e); }} className="stupidcssfix">
            <Send />
          </FloatingActionButton>
        </GridList>
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
export default connect(mapStateToProps, mapDispatchToProps)(CurrentMatchDisplay);
