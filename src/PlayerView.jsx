import React from 'react';

const PlayerView = ({ player }) => {
  return (
    <div className="player-name">
      {player.FirstName} "{player.Username}" {player.LastName}
    </div>
  );
};

export default PlayerView;
