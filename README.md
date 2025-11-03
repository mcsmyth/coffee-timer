# Coffee Timer ☕

A beautiful Pomodoro timer with an 8-bit coffee mug visualization. Watch the coffee mug fill up as time runs down!

## Features

- 🎨 8-bit pixel art coffee mug that fills/empties based on timer
- ⏱️ Default presets: 5, 15, 25, 30 minutes
- 🎯 Custom timer input (1-60 minutes)
- 🎵 Lofi jazz background music with mute/unmute control
- 🔊 Audio notification when timer completes
- 💾 LocalStorage persistence for custom timer preferences and music settings
- 🌙 Dark mode support
- 📱 Fully responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running Locally

Start the development server:

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Customizing Music

**Why is music showing as "Unavailable"?**

External URLs often fail due to CORS (Cross-Origin Resource Sharing) policies or security restrictions. The solution is to use a **local music file**.

### Quick Fix (Recommended)

1. **Download a lofi jazz track** from a free music source (see list below)
2. **Place it in `public/music/`** folder (e.g., `public/music/lofi-jazz.mp3`)
3. **Update `src/components/PomodoroTimer/MusicPlayer.tsx`**:
   ```typescript
   // Change this line:
   const LOFI_JAZZ_URL = '/music/lofi-jazz.mp3';
   ```
4. **Restart your dev server**: `npm start`

### Free Music Sources

- **Pixabay**: https://pixabay.com/music/search/lofi%20jazz/ (free, no attribution required)
- **Free Music Archive**: https://freemusicarchive.org/
- **Incompetech**: https://incompetech.com/music/royalty-free/
- **YouTube Audio Library**: https://www.youtube.com/audiolibrary (requires download)

### Adjust Volume

Change the volume in `MusicPlayer.tsx`:
```typescript
audioRef.current.volume = 0.3; // 0.0 to 1.0 (30% volume)
```

### Check Browser Console

If music still doesn't work, open your browser's developer console (F12) to see detailed error messages that will help diagnose the issue.

## Tech Stack

- React 19 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Web Audio API for notifications and background music

## License

MIT

