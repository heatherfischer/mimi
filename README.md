# Mimi — Virtual Cat Web App

A full-stack Tamagotchi-style virtual cat game built for German third-graders (age 8–9). Max 5-minute sessions with stat decay, autonomous pet behaviors, and touch-friendly UI.

## 🎮 Features

- **Interactive Pet Care**: Feed, play, clean, and give medicine to Mimi
- **Dynamic Stats**: Hunger, energy, happiness, and health with realistic decay
- **Autonomous Behaviors**: Random animations (dancing, jumping, spinning) every 15–45 seconds
- **Funny Speech Bubbles**: Mimi says unprompted German phrases matching her mood
- **5-Minute Session Cap**: Natural energy drain acceleration after 5 mins forces sleep
- **Sleep Cycle**: Automatic wake when energy is full; separate stat recovery during sleep
- **LocalStorage Persistence**: Game state saved on client for resilience
- **Responsive Design**: Touch-friendly on mobile and desktop
- **Pure German UI**: All labels, buttons, and messages in German
- **Sick Events**: Random illness events (0.5% per tick) with recovery mechanics

## 🏗️ Architecture

### Backend (Express)
- **Single server.js file** with in-memory pet state
- REST API endpoints:
  - `GET /api/pet` — Returns current pet state
  - `POST /api/pet/action` — Apply action (feed, play, clean, medicine, sleep)
  - `POST /api/pet/tick` — Called every 10s by client for stat decay
  - `GET /api/pet/reset` — Reset pet to default state

### Frontend (React + Vite)
- **Component Structure**:
  - `Cat.jsx` — SVG cat with animations and speech bubbles
  - `StatsBar.jsx` — Individual stat display with color coding
  - `ActionButtons.jsx` — Action triggers with cooldowns
  - `SleepScreen.jsx` — Sleep overlay with starfield
  - `App.jsx` — Main layout and state management

- **State Management**: TanStack Query v5 with 10-second polling
- **Styling**: Pure SCSS (BEM naming, no CSS-in-JS)
- **Testing**: React Testing Library + Vitest

## 📋 Tech Stack

| Layer     | Technology           | Version |
|-----------|----------------------|---------|
| Frontend  | React                | 18.2+   |
| Frontend  | Vite                 | 5.0+    |
| Frontend  | TanStack Query       | 5.25+   |
| Frontend  | Sass                 | 1.69+   |
| Backend   | Express.js           | 4.18+   |
| Testing   | Vitest + RTL         | Latest  |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone and navigate to project**
   ```bash
   cd Mimi
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Development

Run both server and client concurrently:
```bash
npm run dev
```

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- Vite automatically proxies `/api` calls to the backend

### Building

```bash
npm run build
```

Outputs:
- Frontend: `frontend/dist/`
- Backend: Ready to run with `npm run server:dev` in production

### Testing

```bash
npm run test          # Run tests
npm run test:ui       # Run tests with UI
```

## 🎨 Game Design

### Pet States

| Status     | Visual                          | Speech Examples |
|------------|---------------------------------|-----------------|
| **Idle**   | Gentle breathing animation      | "Ich bin so flauschig!" |
| **Hungry** | Ears flatten, eyes droop        | "Ich habe Hunger!" |
| **Sleeping**| Curled up, Zzz floats upward   | (silent) |
| **Sick**   | Green tint, dizzy swirl         | "Mir ist schlecht..." |

### Stat Mechanics

- **Hunger**: Decreases ~1/6s; faster if happiness is low
- **Energy**: Decreases ~1/6s; faster if hungry; 3× faster after 5 mins
- **Happiness**: Stable; increases with play and clean actions
- **Health**: Decreases ~1/60s; can be sick (random 0.5% per tick)

### Actions & Effects

| Action   | Hunger | Energy | Happiness | Health | Cooldown |
|----------|--------|--------|-----------|--------|----------|
| Feed     | +30    | -5     | —         | —      | 5s       |
| Play     | -10    | -15    | +20       | —      | 5s       |
| Clean    | —      | —      | +5        | +15    | 5s       |
| Medicine | —      | —      | —         | +40    | 5s       |
| Sleep    | —      | ↑↑     | —         | +0.5   | —        |

## 📂 Project Structure

```
Mimi/
├── backend/
│   ├── server.js              # Express server + game logic
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── petApi.js      # Fetch wrappers
│   │   ├── hooks/
│   │   │   └── usePet.js      # TanStack Query hooks
│   │   ├── components/
│   │   │   ├── Cat/           # SVG cat + animations
│   │   │   ├── StatsBar/      # Stat display
│   │   │   ├── ActionButtons/ # Action triggers
│   │   │   ├── SpeechBubble/  # Tooltip messages
│   │   │   └── SleepScreen/   # Sleep overlay
│   │   ├── styles/
│   │   │   ├── _variables.scss
│   │   │   └── _mixins.scss
│   │   ├── App.jsx
│   │   ├── App.scss
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── vitest.config.js
├── .github/
│   └── copilot-instructions.md
├── package.json               # Root (concurrently script)
└── README.md
```

## 🧪 Testing

Tests cover:
- **StatsBar**: Color class application for stat ranges
- **ActionButtons**: Disable states, cooldowns, click handlers
- **SpeechBubble**: Text rendering, timeout behavior
- **usePet Hook**: Query/mutation behavior with mock API
- **Server Endpoints**: Action validation, stat mutations, error handling

Run with:
```bash
npm run test          # Headless
npm run test:ui       # Interactive UI
```

## 🌍 Localization

All UI text is in **German** (Deutsch):
- "Füttern" (Feed)
- "Spielen" (Play)
- "Waschen" (Clean)
- "Schlafen" (Sleep)
- "Medizin" (Medicine)
- Status labels, stat names, and speech bubbles

To adapt for other languages, update:
- Component label props
- Backend status messages
- `autonomousBehaviors` and quote arrays in `Cat.jsx`

## 📱 Responsive Design

- **Mobile**: Single-column layout, touch-optimized buttons
- **Tablet**: 2-column stats grid
- **Desktop**: 4-column stats grid

All animations scale appropriately for screen size.

## 🎯 Implementation Notes

1. **Server-First Logic**: All stat mutations happen server-side to prevent cheating
2. **Client Polling**: Every 10 seconds; TanStack Query handles refetch + caching
3. **LocalStorage Sync**: Snapshot saved on every successful query for resilience
4. **No Countdown**: 5-min session cap is invisible to user—energy drain acceleration feels natural
5. **Inactivity Protection**: If >5 mins since last update, elapsed time is discarded to prevent stat punishment for leaving browser

## 🛠️ Development Workflow

1. Modify backend logic in `backend/server.js` first
2. Test endpoints with `npm run test`
3. Update frontend components as needed
4. Use `npm run dev` to see hot-reload changes
5. Commit and deploy both layers together

## 📝 License

MIT

---

**Viel Spaß mit Mimi! 🐱**
