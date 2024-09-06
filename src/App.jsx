import { useState, useEffect } from 'react';
import PlayerView from './PlayerView';
import MetaPicker from './MetaPicker';
import Player from './Player';
import './App.scss';

function App() {
  const [playersList, setPlayersList] = useState(null); // Store file content
  const [isFileUploaded, setIsFileUploaded] = useState(false); // Control visibility of file upload UI

  // Check local storage when the component mounts
  useEffect(() => {
    const storedPlayers = localStorage.getItem('playersList');

    if (storedPlayers) {
      const parsedPlayers = JSON.parse(storedPlayers);
      setPlayersList(JSON.parse(storedPlayers));
      setIsFileUploaded(true);
    }
  }, []);

  // Handle file upload and read the JSON content
  const handlePlayerJsonUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);

          const players = json.map(
            (playerData) =>
              new Player(
                playerData.Username,
                playerData.FirstName,
                playerData.LastName,
                playerData.PlayerName,
                playerData.Colors
              )
          );

          setPlayersList(players);
          setIsFileUploaded(true);
          localStorage.setItem('playersList', JSON.stringify(players));
        } catch (error) {
          console.error('Invalid JSON file');
        }
      };

      reader.readAsText(file);
    }
  };

  // Clear the playersList and reset the upload state
  const clearPlayersList = () => {
    setPlayersList(null);
    setIsFileUploaded(false);
    localStorage.removeItem('playersList'); // Clear from local storage
  };

  // Callback function to handle value changes from the child
  const handleColorChange = (newColor, player) => {
    // console.log('Set new color to player', newColor, player);
    playersList.find((p) => p.Username === player.Username).Colors = newColor;
    localStorage.setItem('playersList', JSON.stringify(playersList));
  };

  // Function to handle downloading the localStorage attribute as a JSON file
  const downloadLocalStorage = () => {
    const rawData = localStorage.getItem('playersList'); // Replace 'yourAttributeKey' with your actual key
    if (rawData) {
      const jsonData = JSON.parse(rawData); // Parse the raw data to a JavaScript object
      const prettyJsonData = JSON.stringify(jsonData, null, 2); // Convert to a pretty-printed JSON string

      const blob = new Blob([prettyJsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'playersListWithColors.json'; // File name for the download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the URL object
    } else {
      console.error('No data found in localStorage.');
    }
  };

  return (
    <>
      <h1>Lorcana Tournament Meta Breakdown</h1>

      <div className="FileUpload">
        {!isFileUploaded && (
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handlePlayerJsonUpload}
            />
          </div>
        )}
        {isFileUploaded && (
          <div>
            <div className="player-list">
              {playersList.map((player, index) => (
                <div className="player">
                  <PlayerView key={index} player={player} />
                  <MetaPicker
                    playedColors={player.Colors}
                    onColorChange={(color) => handleColorChange(color, player)}
                  />
                </div>
              ))}
            </div>
            <div>
              <button onClick={downloadLocalStorage}>Download Data</button>
              <button onClick={clearPlayersList}>Clear Player List</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
