import React, { useState, useEffect } from 'react';
import './SpeechBubble.scss';

export const SpeechBubble = ({ text, duration = 6000 }) => {
  const [isVisible, setIsVisible] = useState(!!text);

  useEffect(() => {
    if (!text) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [text, duration]);

  if (!isVisible || !text) return null;

  return (
    <div className="speech-bubble">
      <div className="speech-bubble__text">{text}</div>
      <div className="speech-bubble__tail" />
    </div>
  );
};
