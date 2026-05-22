# ManoSetu App UI Kit

## Overview
High-fidelity, interactive click-through prototype of the ManoSetu mobile app (iOS). Built from the Executive Summary design specification.

## Design width
**390px** — iPhone 15 Pro standard canvas.

## Screens
| File | Screen | Description |
|---|---|---|
| `HomeScreen.jsx` | Home / Dashboard | Greeting, 7-day streak, quick-action grid, today's plan |
| `ManasChat.jsx` | Manas AI Chat | Conversational thread, typing indicator, inline tool card delivery |
| `BreathingSession.jsx` | Breathing Library | Technique picker + full-screen rAF-driven ring animation |
| `MoodLog.jsx` | Mood Log | 3-layer: spectrum slider → word cloud → context factors |
| `SetupathJourney.jsx` | Setupath Journey | XP bar, chapter list, narrative ACT arc |

## Usage
Open `index.html` — it mounts all screens inside a phone bezel with a live bottom nav. Click any screen in the side panel or tap the nav bar inside the phone to switch screens.

## Notes
- All components share global scope via `Object.assign(window, {...})` at the end of each JSX file.
- Breathing ring is JavaScript `requestAnimationFrame`-driven (not CSS keyframes) per spec.
- Dark mode locked throughout per ManoSetu spec.
- Google Fonts loaded via CDN: Syne, DM Sans, DM Mono, Noto Sans Devanagari.
- No real API calls — all data is mocked for design fidelity.
