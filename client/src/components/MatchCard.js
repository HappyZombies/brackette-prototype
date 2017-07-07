import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove';
import { IconButton } from 'material-ui';

const styles = {
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  }
};

const MatchCard = ({ playerName, score, handleIncrease, handleDecrease }) => {
  return (
    <Card containerStyle={{ textAlign: 'center', height: '250px' }}>
      <CardTitle title={playerName} />
      <h1 style={{ fontSize: '46px', margin: 0 }}>{score}</h1>
      <IconButton style={styles.medium} iconStyle={styles.mediumIcon} onTouchTap={handleDecrease} >
        <Remove />
      </ IconButton>
      <IconButton style={styles.medium} iconStyle={styles.mediumIcon} onTouchTap={handleIncrease} >
        <Add />
      </ IconButton>
    </Card>
  );
}

export default MatchCard;
