import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory pet state
let petState = {
  name: 'Mimi',
  hunger: 100,
  energy: 100,
  happiness: 100,
  health: 100,
  status: 'idle', // 'idle' | 'hungry' | 'sleeping' | 'sick'
  lastUpdated: Date.now(),
  sessionStart: Date.now(),
  isSick: false,
  isAsleep: false,
};

// Helper: Clamp value between 0-100
const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));

// Helper: Apply stat decay based on elapsed time
const applyDecay = () => {
  const now = Date.now();
  const elapsed = (now - petState.lastUpdated) / 1000; // seconds
  const inactivityThreshold = 5 * 60; // 5 minutes

  // If inactive for more than 5 mins, discard elapsed time
  if (elapsed > inactivityThreshold) {
    petState.lastUpdated = now;
    return;
  }

  // Calculate session duration in seconds
  const sessionDuration = (now - petState.sessionStart) / 1000;
  const sessionCapThreshold = 5 * 60; // 5 minutes
  const sessionCapActive = sessionDuration > sessionCapThreshold;

  if (petState.isAsleep) {
    // While sleeping: energy +2/tick, health +0.5/tick
    const energyRecovery = (elapsed / 10) * 2; // ~2 per 10 seconds
    const healthRecovery = (elapsed / 10) * 0.5; // ~0.5 per 10 seconds

    petState.energy = clamp(petState.energy + energyRecovery);
    petState.health = clamp(petState.health + healthRecovery);

    // Wake up when energy === 100
    if (petState.energy >= 100) {
      petState.energy = 100;
      petState.isAsleep = false;
      petState.status = 'idle';
      petState.sessionStart = now;
    }
  } else {
    // While awake
    // Base decay rates (~1 per 6 seconds baseline)
    let hungerDecayRate = elapsed / 6;
    let energyDecayRate = elapsed / 6;

    // Hunger decays faster if happiness is low
    if (petState.happiness < 50) {
      hungerDecayRate *= 1.5;
    }

    // Energy decays faster if hunger is low
    if (petState.hunger < 20) {
      energyDecayRate *= 1.5;
    }

    // Apply 3× energy drain after 5-min session cap
    if (sessionCapActive) {
      energyDecayRate *= 3;
    }

    // Health decays slowly (~1 per 60 seconds)
    const healthDecayRate = elapsed / 60;

    petState.hunger = clamp(petState.hunger - hungerDecayRate);
    petState.energy = clamp(petState.energy - energyDecayRate);
    petState.health = clamp(petState.health - healthDecayRate);

    // Random sick event: 0.5% chance per tick
    if (Math.random() < 0.005) {
      petState.isSick = true;
      petState.health = clamp(petState.health - 50);
      petState.energy = clamp(petState.energy - 50);
      petState.happiness = clamp(petState.happiness - 50);
    }

    // Update status based on current stats
    if (petState.energy <= 0) {
      petState.energy = 0;
      petState.isAsleep = true;
      petState.status = 'sleeping';
    } else if (petState.hunger < 20) {
      petState.status = 'hungry';
    } else if (petState.health < 30) {
      petState.status = 'sick';
      petState.isSick = true;
    } else {
      petState.status = 'idle';
    }
  }

  petState.lastUpdated = now;
};

// Helper: Restore from localStorage if available
const restoreFromLocalStorage = () => {
  // In a real backend, this would read from a persistent store
  // For now, we'll just reset to defaults after server restart
  // The client will restore from its localStorage if snapshot is recent
};

// ===== API ENDPOINTS =====

// GET /api/pet - Return current pet state
app.get('/api/pet', (req, res) => {
  applyDecay();
  res.json(petState);
});

// POST /api/pet/action - Apply an action
app.post('/api/pet/action', (req, res) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({ error: 'Missing action' });
  }

  // Wake is allowed (and only valid) while sleeping
  if (action === 'wake') {
    if (!petState.isAsleep) {
      return res.status(400).json({ error: 'Pet is not sleeping' });
    }
    applyDecay();
    if (petState.energy <= 1) {
      return res.status(400).json({ error: 'Not enough energy to wake up' });
    }
    petState.isAsleep = false;
    petState.status = 'idle';
    petState.sessionStart = Date.now();
    return res.json(petState);
  }

  // All other actions blocked while sleeping
  if (petState.isAsleep) {
    return res.status(400).json({ error: 'Pet is sleeping' });
  }

  applyDecay();

  switch (action) {
    case 'feed':
      petState.hunger = clamp(petState.hunger + 30);
      break;

    case 'coffee':
      petState.energy = clamp(petState.energy + 30);
      break;

    case 'play':
      petState.happiness = clamp(petState.happiness + 20);
      petState.energy = clamp(petState.energy - 15);
      petState.hunger = clamp(petState.hunger - 10);
      break;

    case 'clean':
      petState.health = clamp(petState.health + 15);
      petState.happiness = clamp(petState.happiness + 5);
      break;

    case 'medicine':
      petState.health = clamp(petState.health + 40);
      petState.isSick = false;
      if (petState.health >= 30) {
        petState.status = 'idle';
      }
      break;

    case 'sleep':
      petState.isAsleep = true;
      petState.status = 'sleeping';
      break;

    default:
      return res.status(400).json({ error: 'Unknown action' });
  }

  // Update status
  if (!petState.isAsleep) {
    if (petState.hunger < 20) {
      petState.status = 'hungry';
    } else if (petState.health < 30) {
      petState.status = 'sick';
    } else {
      petState.status = 'idle';
    }
  }

  res.json(petState);
});

// POST /api/pet/tick - Called by client every 10 seconds
app.post('/api/pet/tick', (req, res) => {
  applyDecay();
  res.json(petState);
});

// GET /api/pet/reset - Reset pet to default state
app.get('/api/pet/reset', (req, res) => {
  petState = {
    name: 'Mimi',
    hunger: 100,
    energy: 100,
    happiness: 100,
    health: 100,
    status: 'idle',
    lastUpdated: Date.now(),
    sessionStart: Date.now(),
    isSick: false,
    isAsleep: false,
  };
  res.json(petState);
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🐱 Mimi server running on http://localhost:${PORT}`);
});
