import React, { useState } from 'react';
import Scene1_Intro from './components/Scene1_Intro';
import Scene2_Void from './components/Scene2_Void'; // Import the new component

function App() {
  // We start at Scene 1 (The Blink and Zoom)
  const [currentScene, setCurrentScene] = useState(1);

  // This is called by Scene 1 after the 14.1s timer
  const handleIntroComplete = () => {
    setCurrentScene(2);
  };

  return (
    <div className="App">
      {currentScene === 1 ? (
        <Scene1_Intro onComplete={handleIntroComplete} />
      ) : (
        /* Scene 2 starts with Wezza's back for 2 seconds, then shows "Whistle" */
        <Scene2_Void />
      )}
    </div>
  );
}

export default App;