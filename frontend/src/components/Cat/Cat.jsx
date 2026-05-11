import React, { useState, useEffect } from 'react';
import './Cat.scss';
import { SpeechBubble } from '../SpeechBubble/SpeechBubble';

const autonomousBehaviors = [
  { action: 'dancing', label: 'Tanzt' },
  { action: 'jumping', label: 'Herumspringen' },
  { action: 'spinning', label: 'Schwanz jagen' },
  { action: 'bow', label: 'Kompliment machen' },
];

const funnyQuotes = [
  'Ich bin so flauschig!',
  'Miau!',
  'Was machst du?',
  "Ich hab gehört, Montage sind doof.",
  'Hunde sind... naja. Du weißt schon.',
  'Ich hab heute 3 Nickerchen gemacht. Rekord!',
  'Wenn ich Fisch bekomme, bin ich dein bester Freund.',
  'Psst. Der Fisch im Kühlschrank gehört jetzt mir.',
  'Streichel mich!',
  'Mein Bauch knurrt...',
  'Zeit für einen Snack?',
  'Spielen wir?',
  'Ich bin eine elegante Katze.',
  'Naps sind das Beste!',
  'Deine Hand sieht wie ein Spielzeug aus...',
];

const hungrySpeech = ['Ich habe Hunger!', 'Mein Bauch knurrt...', 'Fütter mich bitte!'];
const sickSpeech = ['Mir ist schlecht...', 'Ich brauche Medizin!', 'Hilf mir...'];

export const Cat = ({ pet, activeAction }) => {
  const [currentAnimation, setCurrentAnimation] = useState('breathing');
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [hasHat, setHasHat] = useState(false);
  const [hasSunglasses, setHasSunglasses] = useState(false);
  const [butterflyActive, setButterflyActive] = useState(false);

  // Autonomous behaviors
  useEffect(() => {
    if (pet?.isAsleep || pet?.isSick) return;

    const interval = setInterval(() => {
      const behavior = autonomousBehaviors[Math.floor(Math.random() * autonomousBehaviors.length)];
      setCurrentAnimation(behavior.action);

      setTimeout(() => {
        setCurrentAnimation('breathing');
      }, 1500);
    }, 15000 + Math.random() * 30000);

    return () => clearInterval(interval);
  }, [pet?.isAsleep, pet?.isSick]);

  // Funny speech bubbles
  useEffect(() => {
    if (pet?.isAsleep) {
      setCurrentSpeech('');
      return;
    }

    const interval = setInterval(() => {
      let quote = '';
      if (pet?.status === 'hungry') {
        quote = hungrySpeech[Math.floor(Math.random() * hungrySpeech.length)];
      } else if (pet?.isSick) {
        quote = sickSpeech[Math.floor(Math.random() * sickSpeech.length)];
      } else {
        quote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];
      }

      setCurrentSpeech(quote);
    }, 26667 + Math.random() * 53333);

    return () => clearInterval(interval);
  }, [pet?.status, pet?.isSick, pet?.isAsleep]);

  // Trigger animations for hat and sunglasses
  useEffect(() => {
    if (Math.random() < 0.3) {
      setHasHat(true);
      setTimeout(() => setHasHat(false), 10000);
    }
  }, []);

  // Apply status-based animation
  useEffect(() => {
    if (pet?.isAsleep) {
      setCurrentAnimation('sleeping');
    } else if (pet?.isSick) {
      setCurrentAnimation('sick');
    } else if (pet?.status === 'hungry') {
      setCurrentAnimation('hungry');
    } else {
      setCurrentAnimation('breathing');
    }
  }, [pet?.isAsleep, pet?.status, pet?.isSick]);

  const getGreenTint = () => {
    if (pet?.isSick) {
      return 'url(#sickFilter)';
    }
    return 'none';
  };

  return (
    <div className="cat-container">
      <SpeechBubble text={currentSpeech} />

      {activeAction?.type === 'feed' && (
        <div key={activeAction.id} className="cat__action-prop cat__action-prop--feed">
          🐟
        </div>
      )}
      {activeAction?.type === 'play' && (
        <div key={activeAction.id} className="cat__action-prop cat__action-prop--play">
          🧶
        </div>
      )}
      {activeAction?.type === 'clean' && (
        <div key={activeAction.id} className="cat__action-prop cat__action-prop--clean">
          <span className="bubble bubble--1" />
          <span className="bubble bubble--2" />
          <span className="bubble bubble--3" />
          <span className="bubble bubble--4" />
          <span className="bubble bubble--5" />
        </div>
      )}
      {activeAction?.type === 'medicine' && (
        <div key={activeAction.id} className="cat__action-prop cat__action-prop--medicine">
          💊
        </div>
      )}
      {activeAction?.type === 'coffee' && (
        <div key={activeAction.id} className="cat__action-prop cat__action-prop--coffee">
          ☕
        </div>
      )}
      {activeAction?.type === 'sleep' && (
        <div key={activeAction.id} className="cat__action-prop cat__action-prop--sleep">
          <span className="moon">🌙</span>
          <span className="star star--1">✦</span>
          <span className="star star--2">✦</span>
          <span className="star star--3">✦</span>
        </div>
      )}

      <svg
        className={`cat cat--${currentAnimation}`}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="sickFilter">
            <feColorMatrix
              type="saturate"
              values="0.5"
              result="desaturated"
            />
            <feFlood floodColor="green" floodOpacity="0.3" result="greenColor" />
            <feComposite in="greenColor" in2="desaturated" operator="screen" result="greenTint" />
            <feComposite in="greenTint" in2="SourceGraphic" operator="multiply" />
          </filter>
        </defs>

        {/* Body */}
        <ellipse
          cx="100"
          cy="120"
          rx="50"
          ry="55"
          fill="#ff9944"
          filter={getGreenTint()}
        />

        {/* Head */}
        <circle
          cx="100"
          cy="60"
          r="40"
          fill="#ffaa55"
          filter={getGreenTint()}
        />

        {/* Ears */}
        <g className="cat__ears">
          <polygon points="70,25 65,10 80,20" fill="#ffaa55" filter={getGreenTint()} />
          <polygon points="130,25 135,10 120,20" fill="#ffaa55" filter={getGreenTint()} />

          {/* Inner ears */}
          <polygon points="70,22 68,14 77,18" fill="#ffccbb" />
          <polygon points="130,22 132,14 123,18" fill="#ffccbb" />
        </g>

        {/* Eyes */}
        <g className="cat__eyes">
          <circle cx="85" cy="50" r="6" fill="#000" />
          <circle cx="115" cy="50" r="6" fill="#000" />

          {/* Eye highlights */}
          <circle cx="87" cy="48" r="2" fill="#fff" />
          <circle cx="117" cy="48" r="2" fill="#fff" />
        </g>

        {/* Nose */}
        <polygon points="100,65 95,72 105,72" fill="#ff6699" />

        {/* Mouth */}
        <path d="M 100 72 Q 90 85 85 80" stroke="#000" strokeWidth="2" fill="none" />
        <path d="M 100 72 Q 110 85 115 80" stroke="#000" strokeWidth="2" fill="none" />

        {/* Whiskers */}
        <line x1="60" y1="60" x2="40" y2="55" stroke="#000" strokeWidth="1" />
        <line x1="60" y1="70" x2="40" y2="75" stroke="#000" strokeWidth="1" />
        <line x1="140" y1="60" x2="160" y2="55" stroke="#000" strokeWidth="1" />
        <line x1="140" y1="70" x2="160" y2="75" stroke="#000" strokeWidth="1" />

        {/* Tail */}
        <path
          className="cat__tail"
          d="M 150 160 Q 180 150 175 120"
          stroke="#ffaa55"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />

        {/* Paws */}
        <ellipse cx="75" cy="170" rx="12" ry="15" fill="#ffaa55" />
        <ellipse cx="125" cy="170" rx="12" ry="15" fill="#ffaa55" />

        {/* Hat (conditional) */}
        {hasHat && (
          <g className="cat__hat">
            <rect x="70" y="5" width="60" height="15" rx="4" fill="#ff006e" />
            <polygon points="100,5 95,0 105,0" fill="#ff006e" />
          </g>
        )}

        {/* Sunglasses (conditional) */}
        {hasSunglasses && (
          <g className="cat__sunglasses">
            <rect x="75" y="45" width="12" height="10" rx="2" fill="#000" opacity="0.8" />
            <rect x="113" y="45" width="12" height="10" rx="2" fill="#000" opacity="0.8" />
            <line x1="87" y1="50" x2="113" y2="50" stroke="#000" strokeWidth="2" />
          </g>
        )}

        {/* Zzz (while sleeping) */}
        {pet?.isAsleep && (
          <g className="cat__zzz">
            <text x="140" y="30" fontSize="16" fill="#fff" fontWeight="bold">
              Z
            </text>
            <text x="155" y="20" fontSize="14" fill="#fff" fontWeight="bold" opacity="0.7">
              z
            </text>
            <text x="165" y="35" fontSize="12" fill="#fff" fontWeight="bold" opacity="0.5">
              z
            </text>
          </g>
        )}

        {/* Sick swirl (while sick) */}
        {pet?.isSick && (
          <g className="cat__sick-swirl">
            <circle cx="150" cy="30" r="1" fill="#00ff00" opacity="0.6" />
            <circle cx="155" cy="25" r="1.5" fill="#00ff00" opacity="0.4" />
            <circle cx="158" cy="35" r="1" fill="#00ff00" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
};
