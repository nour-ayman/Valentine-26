import React, { useState, useEffect, useMemo } from 'react';
import { useWhistle } from '../hooks/useWhistle';
import '../styles/animations.css';

const Scene2_Void = () => {
  const [activeCrowd, setActiveCrowd] = useState([]);
  const [finishedIds, setFinishedIds] = useState(new Set());
  const [frame, setFrame] = useState(0);
  const whistled = useWhistle(0.25);

  const [wezzaState, setWezzaState] = useState('back'); 
  const [isSequenceStarted, setIsSequenceStarted] = useState(false);
  const [isWhistleVisible, setIsWhistleVisible] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    const timer = setTimeout(() => setIsWhistleVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Preload remains important for the initial hit
  useEffect(() => {
    const imagesToPreload = [
      '/assets/images/wezza_happy.png',
      '/assets/images/wezza_happy_blink.png',
      '/assets/images/wezza_hold_sign.png',
      '/assets/images/wezza_hold_sign_blink.png',
      '/assets/images/wezza_back_shadow.png'
    ];
    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const playAnlatamam = () => {
    const audio = new Audio('/assets/sounds/Anlatamam.mp3');
    audio.currentTime = 15; 
    audio.volume = 1.0; 
    audio.loop = true;
    audio.play().catch(e => console.log("Audio blocked:", e));
  };

  const startValentineLoop = () => {
    const runStep = (step) => {
      switch(step) {
        case 1: setWezzaState('valentine'); setTimeout(() => runStep(2), 1000); break; 
        case 2: setWezzaState('valentine-blink'); setTimeout(() => runStep(3), 500); break; 
        case 3: setWezzaState('valentine'); setTimeout(() => runStep(4), 2000); break; 
        case 4: setWezzaState('valentine-blink'); setTimeout(() => runStep(5), 500); break; 
        case 5: setWezzaState('valentine'); setTimeout(() => runStep(6), 500); break; 
        case 6: setWezzaState('valentine-blink'); setTimeout(() => runStep(7), 500); break; 
        case 7: setWezzaState('valentine'); setTimeout(() => runStep(1), 1000); break; 
        default: break;
      }
    };
    runStep(1);
  };

  const handleFonkaTap = () => {
    if (showTapPrompt && !isFadingOut) {
      setIsFadingOut(true);
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      context.resume();

      setTimeout(() => {
        setShowTapPrompt(false);
        startValentineLoop();
        playAnlatamam();
      }, 500);
    }
  };

  const fullCrowd = useMemo(() => {
    const leftCoords = [{ x: 0, y: 0 }, { x: 0, y: -30 }, { x: 0, y: -60 }, { x: 0, y: -90 }, { x: 0, y: -120 }, { x: 0, y: -145 }, { x: -30, y: -30}, { x: -30, y: -60 }, { x: -30, y: -90}, { x: -30, y: -120}, { x: -30, y: -145}, { x: -30, y: -175}, { x: -60, y: -60}, { x: -60, y: -90}, { x: -60, y: -120}, { x: -60, y: -145}, { x: -60, y: -175}, { x: -60, y: -200}, { x: -90, y: -90}, { x: -90, y: -120}, { x: -90, y: -145}, { x: -90, y: -175}, { x: -90, y: -200}, { x: -120, y: -120}, { x: -120, y: -145}, { x: -120, y: -175}];
    const rightCoords = [{ x: 30, y: -30}, { x: 30, y: -60 }, { x: 30, y: -90}, { x: 30, y: -120}, { x: 30, y: -145}, { x: 30, y: -175}, { x: 60, y: -60}, { x: 60, y: -90}, { x: 60, y: -120}, { x: 60, y: -145}, { x: 60, y: -175}, { x: 60, y: -200}, { x: 90, y: -90}, { x: 90, y: -120}, { x: 90, y: -145}, { x: 90, y: -175}, { x: 90, y: -200}, { x: 120, y: -120}, { x: 120, y: -145}, { x: 120, y: -175}];
    const speed = 0.10;
    const leftSide = leftCoords.map((pos, i) => ({ id: `left-${i}`, targetX: pos.x, targetY: pos.y, duration: (500 + pos.x) / speed, delay: Math.random() * 500, side: 'left' }));
    const rightSide = rightCoords.map((pos, i) => ({ id: `right-${i}`, targetX: pos.x, targetY: pos.y, duration: (500 - pos.x) / speed, delay: Math.random() * 500, side: 'right' }));
    return [...leftSide, ...rightSide];
  }, []);

  useEffect(() => {
    if (whistled) {
      setActiveCrowd(fullCrowd); 
      setFinishedIds(new Set());
      setWezzaState('back'); 
      setIsSequenceStarted(false);
      setShowTapPrompt(false);
      setIsFadingOut(false);
    }
  }, [whistled, fullCrowd]);

  useEffect(() => {
    const totalPeople = activeCrowd.length;
    if (totalPeople > 0 && finishedIds.size === totalPeople && !isSequenceStarted) {
      setIsSequenceStarted(true);
      setTimeout(() => {
        setWezzaState('happy');
        setTimeout(() => {
          setWezzaState('blink');
          setTimeout(() => {
            setWezzaState('happy');
            setTimeout(() => {
              setWezzaState('blink');
              setTimeout(() => {
                setWezzaState('happy');
                setTimeout(() => {
                  setWezzaState('blink');
                  setTimeout(() => {
                    if (isIOS) {
                      setWezzaState('happy');
                      setShowTapPrompt(true);
                    } else {
                      startValentineLoop();
                      playAnlatamam();
                    }
                  }, 150);
                }, 500);
              }, 150);
            }, 1000);
          }, 150);
        }, 2000);
      }, 2000);
    }
  }, [finishedIds, activeCrowd, isSequenceStarted, isIOS]);

  useEffect(() => {
    if (activeCrowd.length > 0) {
      const interval = setInterval(() => setFrame(f => (f + 1) % 9), 120);
      return () => clearInterval(interval);
    }
  }, [activeCrowd]);

  return (
    <div className="void-stage" onClick={handleFonkaTap}>
      {activeCrowd.length === 0 && isWhistleVisible && (
        <div className={`whistle-container ${whistled ? 'detected' : ''}`}>
          <h2 className="whistle-text">CAN YOU WHISTLE?</h2>
        </div>
      )}

      {showTapPrompt && (
        <div className="tap-prompt-layer">
          <h2 className={`tap-text-moveable ${isFadingOut ? 'tap-fade-out' : 'tap-animate'}`}>
            TAP THE SCREEN...
          </h2>
        </div>
      )}

      {/* FIXED CHARACTER RENDERING: Single div background swap */}
      <div className={`wezza-sprite-container ${wezzaState === 'back' ? 'wezza-intro-fade' : ''}`}>
        <div className={`wezza-pixel-sprite ${wezzaState}`}></div>
      </div>
      
      {activeCrowd.map((person) => {
        const isResting = finishedIds.has(person.id);
        const prefix = person.side === 'left' ? 'MGR' : 'MGL';
        return (
          <img
            key={person.id}
            src={isResting ? '/assets/images/maghrb/mghrb-rest.png' : `/assets/images/maghrb/${prefix}_00${frame}.png`}
            className={`crowd-member ${isResting ? 'resting' : 'moving'}`}
            onAnimationEnd={() => setFinishedIds(prev => new Set(prev).add(person.id))}
            style={{
              '--target-x': `${person.targetX}px`,
              '--target-y': `${person.targetY}px`,
              '--duration': `${person.duration}ms`,
              zIndex: 1000 + Math.round(person.targetY), 
              animationDelay: `${person.delay}ms`,
              animationName: isResting ? 'none' : (person.side === 'left' ? 'runInLane' : 'runInLaneRight'),
              animationDuration: 'var(--duration)',
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
            alt="crowd"
          />
        );
      })}
    </div>
  );
};

export default Scene2_Void;