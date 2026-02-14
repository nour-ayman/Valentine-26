import React, { useState, useEffect } from 'react';
import '../styles/animations.css';

const Scene1_Intro = ({ onComplete }) => {
  const [frame, setFrame] = useState('open'); 
  const [isZooming, setIsZooming] = useState(false);
  const [isFadingIn, setIsFadingIn] = useState(true);

  useEffect(() => {
    // 0s: Start with Black Screen (Fades in for 2s)
    const fadeTimer = setTimeout(() => {
      setIsFadingIn(false); 
    }, 2000);

    // --- The Blink Sequence (Post-Fade) ---
    // 4.0s: CLOSE (after 2s open)
    const t1 = setTimeout(() => setFrame('closed'), 4000);
    // 4.2s: OPEN (after 0.2s closed)
    const t2 = setTimeout(() => setFrame('open'), 4200);
    // 4.7s: CLOSE (after 0.5s open)
    const t3 = setTimeout(() => setFrame('closed'), 4700);
    // 5.2s: OPEN (after 0.5s closed)
    const t4 = setTimeout(() => setFrame('open'), 5200);
    // 5.7s: CLOSE (after 0.5s open)
    const t5 = setTimeout(() => setFrame('closed'), 5700);
    // 6.0s: OPEN (after 0.3s closed)
    const t6 = setTimeout(() => setFrame('open'), 6000);

    // --- The Smile Frame ---
    // 8.0s: SMILE (After 2s of being open)
    const t7 = setTimeout(() => setFrame('smile'), 8000);

    // --- The Finale ---
    // 14.0s: ZOOM OUT (Camera fly-up starts)
    const startZoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, 10000);

    // 14.1s: Switch to Scene 2 (Fast cut to Bird's Eye View)
    const endSceneTimer = setTimeout(() => {
      onComplete();
    }, 11000);

    return () => {
      clearTimeout(fadeTimer);
      [t1, t2, t3, t4, t5, t6, t7, startZoomTimer, endSceneTimer].forEach(clearTimeout);
    };
  }, [onComplete]);

  const getImagePath = () => {
    if (frame === 'closed') return '/assets/images/wezza_closed_shadow.png';
    if (frame === 'smile') return '/assets/images/wezza_open_slightly_slime_shadow.png';
    return '/assets/images/wezza_open_shadow.png';
  };

  return (
    <div className="intro-stage">
      <div className={`black-fade ${isFadingIn ? 'active' : ''}`}></div>
      <div className={`camera-lens ${isZooming ? 'fly-up' : ''}`}>
        <img 
          src={getImagePath()} 
          alt="Wezza"
          className="wezza-pixel"
        />
      </div>
    </div>
  );
};

export default Scene1_Intro;