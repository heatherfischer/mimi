import React, { useState, useEffect } from 'react';
import './StatsBar.scss';

export const StatsBar = ({ icon, label, value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(Math.round(value));
  }, [value]);

  const getStatClass = (val) => {
    if (val > 60) return 'stat--high';
    if (val >= 30) return 'stat--medium';
    return 'stat--low';
  };

  return (
    <div className={`stat ${getStatClass(displayValue)}`}>
      <div className="stat__icon">{icon}</div>
      <div className="stat__info">
        <div className="stat__label">{label}</div>
        <div className="stat__bar">
          <div
            className="stat__fill"
            style={{ width: `${Math.max(0, Math.min(100, displayValue))}%` }}
          />
        </div>
      </div>
      <div className="stat__value">{displayValue}</div>
    </div>
  );
};
