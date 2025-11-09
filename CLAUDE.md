# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Coffee Timer is a Pomodoro timer web app with an 8-bit coffee shop aesthetic. Features include a pixel art coffee mug that fills/empties with time, customizable timer presets, lofi music playback with playlists, todo list management with analytics, and project organization.

Built with React 19, TypeScript, and Tailwind CSS. Deployed to GitHub Pages.

## Common Commands

### Development
```bash
npm start              # Start dev server at localhost:3000
npm run build          # Production build to build/ directory
npm test               # Run Jest unit tests
npm run test:e2e       # Run Playwright end-to-end tests
npm run test:e2e:ui    # Run Playwright tests with UI
```

### Deployment
```bash
npm run deploy         # Build and deploy to GitHub Pages (runs predeploy + gh-pages)
```

## Architecture

### State Management Pattern

The app uses **localStorage for persistence** and **custom events for cross-component synchronization**. No external state management library is used.

- **Timer state**: Managed by `usePomodoroTimer` hook (src/hooks/usePomodoroTimer.ts)
- **Todo data**: Persisted via `todoUtils.ts` with `todosUpdated` custom event
- **Project data**: Persisted via `todoUtils.ts` with `projectsUpdated` custom event
- **Music state**: MusicPlayer component syncs mute state across instances via `musicMuteToggled` event
- **Settings**: Stored in localStorage with custom events for song selection changes

When modifying state that needs to sync across components (e.g., todos, projects, music settings), always:
1. Update localStorage
2. Dispatch a custom event using `window.dispatchEvent(new CustomEvent(...))`
3. Components listen for these events via `window.addEventListener()`

### Component Organization

**Main Components** (src/components/PomodoroTimer/):
- `PomodoroTimer.tsx` - Main container with two layout modes:
  - **Running mode**: Full-screen coffee shop background with centered timer overlay
  - **Stopped mode**: Scrollable view with all controls, todo list, and settings
- `CoffeeMug.tsx` - Full-screen coffee shop background with animated mug fill level
- `MusicPlayer.tsx` - Handles audio playback with playlist support
- `TodoList.tsx` - Main todo interface (shown when timer stopped)
- `TodoListPanel.tsx` - Collapsible side panel (shown when timer running)
- `AnalyticsView.tsx` - Task analytics dashboard with time tracking

**Utility Modules** (src/utils/):
- `timerUtils.ts` - Time formatting, presets, fill percentage calculations
- `todoUtils.ts` - Todo/project CRUD operations, localStorage persistence
- `analyticsUtils.ts` - Analytics data aggregation (by task, day, week, month)
- `darkModeUtils.ts` - Dark mode state management
- `settingsUtils.ts` - App settings persistence

### Timer Session Lifecycle

The timer uses a `sessionId` (incremented in `usePomodoroTimer.ts:76`) to track distinct work sessions. Key behaviors:

1. **Session start**: When timer starts from complete state or full time, `sessionId` increments
2. **Music rotation**: MusicPlayer automatically advances to next song on new session (if playlist has multiple songs)
3. **Todo tracking**: When a todo is completed during a session, it's tagged with:
   - `sessionId` - Which session it was completed in
   - `timeSpent` - How long the timer ran (used for analytics)
   - `completedAt` - Timestamp

### Music System

Music files live in `public/music/`. The playlist is configured in `src/config/musicPlaylist.ts`:

```typescript
export const MUSIC_PLAYLIST: Song[] = [
  { filename: 'song.mp3', title: 'Song Title' }
];
```

**Music Player behavior**:
- Plays continuously when timer is running (unless muted)
- Auto-advances to next song when current ends
- Skips to next song when new timer session starts (configurable)
- Mute state persists across sessions
- Song selection can be changed in settings panel

**To add music**: Place MP3/OGG files in `public/music/` and add entries to `MUSIC_PLAYLIST`.

### Analytics System

Analytics are computed on-demand from completed todos (no separate database):

- `getTaskAnalytics()` - Groups by task name, totals time spent per task
- `getDayAnalytics()` - Groups by day, shows daily totals
- `getWeekAnalytics()` - Groups by week (Monday-Sunday)
- `getMonthAnalytics()` - Groups by month
- `getTotalFocusTime()` - Sums all time across completed tasks

Only todos with `completed: true`, `timeSpent > 0`, and `completedAt` timestamp contribute to analytics.

### Project and Todo Management

**Data Structure**:
- Projects are optional containers for todos
- Todos can have a `projectId` field linking them to a project
- Deleting a project removes `projectId` from all associated todos (doesn't delete todos)
- Both use drag-and-drop reordering via @dnd-kit/sortable

**Ordering**: Both todos and projects use an `order` field (timestamp-based). Higher order values appear first.

## Key Technical Constraints

### LocalStorage

All data is stored in localStorage with these keys:
- `pomodoro_todos` - Todo list
- `pomodoro_projects` - Project list
- `pomodoro_custom_time` - Last custom timer setting
- `pomodoro_music_muted` - Music mute state
- `settings_dark_mode` - Dark mode preference
- `settings_selected_song` - Currently selected song index

When adding new persisted data, follow the pattern in `todoUtils.ts` or `settingsUtils.ts`:
- Validate data on load
- Handle quota exceeded errors
- Dispatch custom events for cross-component sync

### GitHub Pages Deployment

The app is deployed to GitHub Pages with `homepage: "https://mcsmyth.github.io/coffee-timer"` in package.json.

**Important**: All asset paths must respect `process.env.PUBLIC_URL` (see `musicPlaylist.ts:46-48`). When referencing public assets, use the `getSongUrl` pattern or similar.

### Browser Audio Restrictions

Modern browsers require user interaction before playing audio. The MusicPlayer handles this gracefully:
- Audio playback is triggered by user clicking "Start" timer
- Errors are caught and logged (expected behavior on first load)
- Audio context is created lazily to avoid browser warnings

## Testing Strategy

- **Unit tests**: Jest (via react-scripts)
- **E2E tests**: Playwright (test:e2e commands)

When adding features, prioritize E2E tests for user workflows (timer start/stop, todo CRUD, music playback).
