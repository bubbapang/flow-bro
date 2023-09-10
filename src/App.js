import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [workTime, setWorkTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [workActive, setWorkActive] = useState(false);
  const [playActive, setPlayActive] = useState(false);
  const [ratio, setRatio] = useState(10); // For every 10 seconds of work, you get 1 second of play

  // Create a new Audio object
  const alertSound = new Audio(`${process.env.PUBLIC_URL}/alert-sound.mp3`);

  useEffect(() => {
    let workInterval, playInterval;

    if (workActive) {
      workInterval = setInterval(() => {
        setWorkTime((prev) => prev + 1);
        setPlayTime((prev) => prev + 1 / ratio);  // use the ratio here
      }, 1000);
    }

    if (playActive) {
      playInterval = setInterval(() => {
        setPlayTime((prev) => {
          if (prev <= 0) {
            // Play the alert sound when playTime is up
            alertSound.play();
            setPlayActive(false); // Stop the play timer
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(workInterval);
      clearInterval(playInterval);
    };
  }, [workActive, playActive, ratio]);

  const toggleWork = () => {
    setWorkActive(!workActive);
    setPlayActive(false);
  };

  const togglePlay = () => {
    if (playTime > 0) {
      setPlayActive(!playActive);
      setWorkActive(false);
    }
  };

  return (
    <div className="App">
      <div>
        <h1>Work Time: {workTime}s</h1>
        <button onClick={toggleWork}>{workActive ? "Pause" : "Start"}</button>
      </div>
      <div>
        <h1>Play Time: {Math.floor(playTime)}s</h1> {/* Math.floor to avoid decimal points */}
        <button onClick={togglePlay}>{playActive ? "Pause" : "Start"}</button>
      </div>
      <div>
        <h2>Work-to-Play Ratio</h2>
        <input
          type="number"
          value={ratio}
          onChange={(e) => setRatio(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default App;
