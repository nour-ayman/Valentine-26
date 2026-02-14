import { useState, useEffect } from 'react';

/**
 * Custom hook to detect a whistle or loud sound using the Web Audio API.
 * @param {number} threshold - Sensitivity (0.0 to 1.0). Lower is more sensitive.
 */
export const useWhistle = (threshold = 0.15) => {
  const [isWhistled, setIsWhistled] = useState(false);

  useEffect(() => {
    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;

    const startAudio = async () => {
      try {
        // 1. Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // 2. Initialize Audio Context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // FIX: Browsers often start AudioContext in 'suspended' state
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        // ScriptProcessor analyzes the audio samples in real-time
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        // 3. Connect the nodes (Mic -> Analyser -> Processor)
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        // 4. Processing Loop
        javascriptNode.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;

          for (let i = 0; i < array.length; i++) {
            values += array[i];
          }

          const average = values / array.length;

          // If the average volume exceeds our threshold, trigger 'whistled'
          if (average > threshold * 100) {
            setIsWhistled(true);
          }
        };
      } catch (err) {
        console.error("Microphone access denied or error:", err);
      }
    };

    startAudio();

    // Cleanup: Stop the microphone and close the context when component unmounts
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [threshold]);

  return isWhistled;
};