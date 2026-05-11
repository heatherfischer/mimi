import React, { useEffect, useRef, useState } from 'react';
import { usePet } from './hooks/usePet';
import { Cat } from './components/Cat/Cat';
import { StatsBar } from './components/StatsBar/StatsBar';
import { ActionButtons } from './components/ActionButtons/ActionButtons';
import { SleepScreen } from './components/SleepScreen/SleepScreen';
import './App.scss';

function App() {
  const [activeAction, setActiveAction] = useState(null);
  const actionIdRef = useRef(0);

  const triggerAction = (actionName, mutationFn) => {
    actionIdRef.current += 1;
    const currentId = actionIdRef.current;
    setActiveAction({ type: actionName, id: currentId });
    mutationFn();
    setTimeout(() => {
      setActiveAction(prev => (prev?.id === currentId ? null : prev));
    }, 1600);
  };

  const {
    pet,
    isLoading,
    error,
    feed,
    play,
    clean,
    medicine,
    sleep,
    wake,
    coffee,
    isMutating,
  } = usePet();

  // Save pet state to localStorage whenever it changes
  useEffect(() => {
    if (pet) {
      localStorage.setItem(
        'mimi_snapshot',
        JSON.stringify({
          lastSaved: Date.now(),
          pet,
        })
      );
    }
  }, [pet]);

  if (isLoading && !pet) {
    return (
      <div className="app app--loading">
        <div className="app__loading-text">Mimi wird geboren...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app app--error">
        <div className="app__error-text">⚠️ Fehler beim Laden</div>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!pet) return null;

  const getStatusBadge = () => {
    if (pet.isAsleep) return '😴 Schlafend';
    if (pet.isSick) return '🤒 Krank';
    if (pet.status === 'hungry') return '🍖 Hungrig';
    return '😊 Glücklich';
  };

  return (
    <div className="app">
      <SleepScreen isAsleep={pet.isAsleep} energy={pet.energy} onWake={wake} />

      <header className="app__header">
        <div className="app__title">
          <span className="app__pet-name">Mimi</span>
          <span className="app__pet-icon">🐱</span>
        </div>
        <div className={`app__status app__status--${pet.status}`}>
          {getStatusBadge()}
        </div>
      </header>

      <main className="app__stage">
        <Cat pet={pet} activeAction={activeAction} />
      </main>

      <section className="app__stats">
        <StatsBar icon="🍖" label="Hunger" value={pet.hunger} />
        <StatsBar icon="⚡" label="Energie" value={pet.energy} />
        <StatsBar icon="😊" label="Laune" value={pet.happiness} />
        <StatsBar icon="❤️" label="Gesundheit" value={pet.health} />
      </section>

      <footer className="app__actions">
        <ActionButtons
          onFeed={() => triggerAction('feed', feed)}
          onPlay={() => triggerAction('play', play)}
          onClean={() => triggerAction('clean', clean)}
          onMedicine={() => triggerAction('medicine', medicine)}
          onSleep={() => triggerAction('sleep', sleep)}
          onCoffee={() => triggerAction('coffee', coffee)}
          isAsleep={pet.isAsleep}
          isSick={pet.isSick}
          isLoading={isMutating || activeAction !== null}
        />
      </footer>
    </div>
  );
}

export default App;
