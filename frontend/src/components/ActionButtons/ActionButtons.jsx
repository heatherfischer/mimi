import React, { useState, useEffect } from 'react';
import './ActionButtons.scss';

export const ActionButtons = ({
  onFeed,
  onPlay,
  onClean,
  onMedicine,
  onSleep,
  onCoffee,
  isAsleep,
  isSick,
  isLoading,
}) => {
  const [cooldowns, setCooldowns] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldowns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => {
          updated[key] = Math.max(0, updated[key] - 100);
          if (updated[key] === 0) delete updated[key];
        });
        return updated;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleAction = (action, callback) => {
    callback();
    setCooldowns((prev) => ({ ...prev, [action]: 5000 }));
  };

  const isActionDisabled = (action) =>
    isAsleep || isLoading || cooldowns[action] > 0 || (action === 'medicine' && !isSick);

  const getCooldownPercent = (action) =>
    cooldowns[action] ? ((5000 - cooldowns[action]) / 5000) * 100 : 0;

  return (
    <div className="action-buttons">
      <div className="action-buttons__row">
        <button
          className="action-btn action-btn--feed"
          onClick={() => handleAction('feed', onFeed)}
          disabled={isActionDisabled('feed')}
          title="Füttern"
        >
          {cooldowns.feed > 0 && (
            <div
              className="action-btn__cooldown"
              style={{ width: `${getCooldownPercent('feed')}%` }}
            />
          )}
          <span className="action-btn__icon">🍖</span>
          <span className="action-btn__label">Füttern</span>
        </button>

        <button
          className="action-btn action-btn--play"
          onClick={() => handleAction('play', onPlay)}
          disabled={isActionDisabled('play')}
          title="Spielen"
        >
          {cooldowns.play > 0 && (
            <div
              className="action-btn__cooldown"
              style={{ width: `${getCooldownPercent('play')}%` }}
            />
          )}
          <span className="action-btn__icon">🎮</span>
          <span className="action-btn__label">Spielen</span>
        </button>

        <button
          className="action-btn action-btn--sleep"
          onClick={() => handleAction('sleep', onSleep)}
          disabled={isActionDisabled('sleep')}
          title="Schlafen"
        >
          {cooldowns.sleep > 0 && (
            <div
              className="action-btn__cooldown"
              style={{ width: `${getCooldownPercent('sleep')}%` }}
            />
          )}
          <span className="action-btn__icon">💤</span>
          <span className="action-btn__label">Schlafen</span>
        </button>
      </div>

      <div className="action-buttons__row">
        <button
          className="action-btn action-btn--clean"
          onClick={() => handleAction('clean', onClean)}
          disabled={isActionDisabled('clean')}
          title="Waschen"
        >
          {cooldowns.clean > 0 && (
            <div
              className="action-btn__cooldown"
              style={{ width: `${getCooldownPercent('clean')}%` }}
            />
          )}
          <span className="action-btn__icon">🧼</span>
          <span className="action-btn__label">Waschen</span>
        </button>

        <button
          className="action-btn action-btn--medicine"
          onClick={() => handleAction('medicine', onMedicine)}
          disabled={isActionDisabled('medicine')}
          title="Medizin"
        >
          {cooldowns.medicine > 0 && (
            <div
              className="action-btn__cooldown"
              style={{ width: `${getCooldownPercent('medicine')}%` }}
            />
          )}
          <span className="action-btn__icon">💊</span>
          <span className="action-btn__label">Medizin</span>
        </button>

        <button
          className="action-btn action-btn--coffee"
          onClick={() => handleAction('coffee', onCoffee)}
          disabled={isActionDisabled('coffee')}
          title="Kaffee"
        >
          {cooldowns.coffee > 0 && (
            <div
              className="action-btn__cooldown"
              style={{ width: `${getCooldownPercent('coffee')}%` }}
            />
          )}
          <span className="action-btn__icon">☕</span>
          <span className="action-btn__label">Kaffee</span>
        </button>
      </div>
    </div>
  );
};
