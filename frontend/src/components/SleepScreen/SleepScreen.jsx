import React from 'react';
import './SleepScreen.scss';

export const SleepScreen = ({ isAsleep, energy, onWake }) => {
  if (!isAsleep) return null;

  const canWake = energy > 1;

  return (
    <div className="sleep-screen">
      <div className="sleep-screen__overlay" />
      <div className="sleep-screen__content">
        <div className="sleep-screen__icon">😴</div>
        <div className="sleep-screen__message">Mimi schläft...</div>
        <div className="sleep-screen__indicator">
          <span className="sleep-screen__dot" />
          <span className="sleep-screen__dot" />
          <span className="sleep-screen__dot" />
        </div>
        <button
          className="sleep-screen__wake-btn"
          onClick={onWake}
          disabled={!canWake}
        >
          ☀️ Aufwecken
        </button>
      </div>
    </div>
  );
};
