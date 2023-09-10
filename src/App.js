import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [workStartTime, setWorkStartTime] = useState(null);
  const [playStartTime, setPlayStartTime] = useState(null);
  const [workTime, setWorkTime] = useState(0);
  const [playTime, setPlayTime] = useState(0);
  const [workActive, setWorkActive] = useState(false);
  const [playActive, setPlayActive] = useState(false);
  const [ratio, setRatio] = useState(5);
  const [totalWorkTime, setTotalWorkTime] = useState(0);

  const alertSound = useRef(new Audio(`${process.env.PUBLIC_URL}/alert-sound.mp3`));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();

      if (workActive) {
        const elapsed = Math.floor((currentTime - workStartTime) / 1000);
        const newWorkTime = elapsed;
        setWorkTime(newWorkTime);
        setTotalWorkTime(newWorkTime);
        setPlayTime(newWorkTime / ratio);
      }

      if (playActive) {
        const elapsed = Math.floor((currentTime - playStartTime) / 1000);
        const newPlayTime = playTime - elapsed;
        let newWorkTime = totalWorkTime - elapsed * ratio;

        if (newPlayTime <= 0) {
          alertSound.current.play();
          setPlayActive(false);
          setPlayTime(0); // Reset to 0 if it goes below
        } else {
          setPlayTime(newPlayTime);
        }

        if (newWorkTime <= 0) {
          setWorkTime(0); // Reset to 0 if it goes below
          setTotalWorkTime(0);
        } else {
          setWorkTime(newWorkTime);
          setTotalWorkTime(newWorkTime);
        }

        setPlayStartTime(currentTime); // Update playStartTime to the current time
      }

    }, 1000);

    return () => {
      clearInterval(interval);
    };

  }, [workActive, playActive, workStartTime, playStartTime, workTime, playTime, ratio, totalWorkTime]);

  useEffect(() => {
    setPlayTime(totalWorkTime / ratio);
  }, [ratio, totalWorkTime]);

  const toggleWork = () => {
    setWorkStartTime(new Date().getTime() - workTime * 1000);
    setWorkActive(!workActive);
    setPlayActive(false);
  };

  const togglePlay = () => {
    if (playTime > 0) {
      setPlayStartTime(new Date().getTime());
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
        <h1>Play Time: {Math.floor(playTime)}s</h1>
        <button onClick={togglePlay}>{playActive ? "Pause" : "Start"}</button>
      </div>
      <div>
        <h2>Work-to-Play Ratio</h2>
        <input
          type="number"
          value={ratio}
          onChange={(e) => {
            const newRatio = Number(e.target.value);
            if (newRatio > 0) {
              setRatio(newRatio);
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
