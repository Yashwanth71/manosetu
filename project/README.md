# ManoSetu Design System

**ManoSetu** (मनोसेतु — "Bridge to the Mind") is an India-first mental health and wellness app combining AI-powered therapeutic conversation, pranayama breathwork, mood tracking, and professional therapist booking. The product is deeply rooted in Indian cultural context — Sanskrit technique names, Devanagari typography, and CBT/ACT frameworks adapted for Indian social stressors.

## Sources

This design system was built from the **ManoSetu UI/UX Design System Executive Summary** specification document. No external codebase or Figma file was attached at time of creation — all tokens, components, and UI recreations are derived from the spec. If a codebase or Figma link becomes available, this system should be updated accordingly.

---

## Products

| Product | Description |
|---|---|
| **ManoSetu Mobile App** | Primary product. React Native iOS/Android app. Dark-mode-first. |
| **Manas AI** | Conversational AI therapist layer (violet accent, inline tool delivery) |
| **Breathing Library** | 12 pranayama techniques, full-screen immersive sessions |
| **Setupath** | Narrative gamification / XP journey layer (no reward coins) |
| **Community** | Professional therapist booking and institutional layer |

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Warm, clinical-lite**: Never cold or medical. Uses empathetic, conversational language.
- **India-first**: Acknowledges Indian social stressors (family pressure, academic stress, professional burnout). References Indian cultural concepts without being tokenistic.
- **First person respectful**: "Your breathing session" not "The breathing session". Direct but gentle.
- **No clinical jargon exposed to users**: PHQ-9, GAD-7, RoBERTa — all invisible. Users see narratives, not scores.
- **Sanskrit terms normalized**: Pranayama technique names are given in both Sanskrit (Devanagari script where appropriate) and plain English transliterations (e.g., "Nadi Shodhana • Alternate Nostril").
- **Emoji**: Not used in primary UI. Mood logging uses emoji-style visual buttons (custom illustrated, not system emoji).
- **Casing**: Title case for section headers, sentence case for body copy and chat. CTAs are title case.
- **Affirmations**: Short, present-tense, evidence-informed. Not saccharine ("You're doing okay" not "You're amazing!").

### Copy Examples
- Manas greeting: *"I'm here. What's been on your mind today?"*
- Breathing prompt: *"Let's begin. Inhale slowly through your left nostril…"*
- Mood check-in: *"How are you feeling right now?"*
- Streak milestone: *"7 days of showing up for yourself."*
- Therapist card: *"Matches your style · Speaks Hindi · Available this week"*

---

## VISUAL FOUNDATIONS

### Color Philosophy
Two-accent system (violet for AI/Manas, blue for therapy/plans) on dark navy. Prevents color overload. Tinted navy surfaces reduce eye strain for extended therapeutic use.

#### Dark Mode (Primary)
| Role | Token | Hex |
|---|---|---|
| App background | `--bg-app` | `#0C1120` |
| Card surface | `--bg-card` | `#111827` |
| Elevated surface | `--bg-elevated` | `#1C2333` |
| Brand Violet (Manas/AI) | `--accent-violet` | `#7C3AED` |
| Brand Blue (Therapy) | `--accent-blue` | `#3B82F6` |
| Primary text | `--text-primary` | `#F0F4FF` |
| Manas text | `--text-manas` | `#C4B5FD` |

#### Light Mode (Secondary)
| Role | Token | Hex |
|---|---|---|
| App background | `--bg-app-light` | `#FAFAF8` |
| Card surface | `--bg-card-light` | `#FFFFFF` |
| Surface | `--bg-surface-light` | `#F0EFED` |
| Primary text | `--text-primary-light` | `#0D1117` |
| Secondary text | `--text-secondary-light` | `#3D4451` |

### Typography
- **Display/Headings**: Syne (700–800) — Google Fonts. Hero, section titles, CTAs.
- **Body/UI**: DM Sans (300–500) — Google Fonts. Chat, labels, instructions.
- **Code/Technical**: DM Mono (400) — Google Fonts. Session IDs, score displays.
- **Sanskrit Terms**: Noto Sans Devanagari (400–500) — Google Fonts. Pranayama names.
- Font loading: `font-display: swap` — no FOUT blocking.
- *Note: Google Fonts CDN used. No local font files provided in spec. See `fonts/` for stubs.*

### Backgrounds
- **Dark mode base**: Deep navy `#0C1120` — no gradients on base layer.
- **Breathing screens**: Always dark regardless of system setting. Gradient overlays allowed for immersion (violet glow, subtle radial).
- **Cards**: Flat dark surfaces (`#111827`) with subtle 1px border (`rgba(255,255,255,0.06)`).
- **No aggressive full-bleed gradients** on app screens; gradients reserved for breathing ring glows and accent elements.

### Spacing System
| Token | Value | Context |
|---|---|---|
| `--space-screen-v` | 24px | Vertical screen padding |
| `--space-screen-h` | 20px | Horizontal screen padding |
| `--space-card-pad` | 16px | Internal card padding |
| `--space-section` | 12px | Between UI sections |
| `--space-inline` | 8px | Inline element spacing |

### Corner Radius
| Token | Value | Context |
|---|---|---|
| `--radius-card` | 16px | Primary cards |
| `--radius-card-sm` | 12px | Secondary components |
| `--radius-button` | 12px | All CTAs |
| `--radius-pill` | 999px | Tags, chips |

### Borders & Shadows
- Cards: `1px solid rgba(255,255,255,0.06)` — extremely subtle. No heavy drop shadows.
- Elevated: `1px solid rgba(124,58,237,0.15)` — faint violet tint on active/elevated states.
- Focus outlines: `2px solid #7C3AED`, `outline-offset: 2px` — high contrast, WCAG compliant.
- Inner shadow: Not used. Surfaces are flat.
- Backdrop blur: Used sparingly — sheet modals, overlays. `backdrop-filter: blur(20px)`.

### Animation & Motion
| Rule | Implementation |
|---|---|
| **Entrance** | `fadeUp` — 24px translate-y, 0.7s ease-out, opacity 0→1 |
| **Breathing ring** | `breatheRing` — scale 0.88→1.16, opacity 0.2→0.55, rAF-driven |
| **Float** | `translateY(0 → -8px)` 4s infinite ease-in-out |
| **Transition** | `slideIn` — 16px horizontal, 0.3s ease |
| **Emphasis** | `bindPulse` — scale 1→1.2, opacity 0.7→1 |
| **Reduced motion** | `animation-duration: 0ms` — ZERO duration, not slowed |

Breathing ring is **JavaScript rAF-driven**, never CSS keyframe loops. Never `setInterval`.

### Hover / Press States
- **Buttons**: Background shifts to violet at 90% brightness; subtle scale `0.97` on press.
- **Cards**: Slight border brightening `rgba(255,255,255,0.1)` on hover. No lift/shadow change.
- **Chat bubbles**: No hover state (mobile-first).
- **Tabs/Nav**: Active: violet underline + text `#C4B5FD`. Inactive: `#6B7280`.

### Imagery & Illustrations
- No photography defined in spec. Likely uses illustrated characters.
- **Color vibe**: Dark navy background with violet/blue glows. No warm photographic imagery.
- **Grain/texture**: Not specified; clean flat surfaces.
- Illustrations: Placeholder slots defined (no actual illustrations provided in spec).

### Iconography → see ICONOGRAPHY section

---

## ICONOGRAPHY

### Approach
- **No icon font embedded in spec**. The design implies a stroke-weight icon system consistent with the clean, minimal dark-mode aesthetic.
- **Recommended**: Lucide Icons (CDN available) — 1.5px stroke, clean stroke-only geometry. Matches the DM Sans body weight and dark-mode style perfectly.
- **Logo/Brand**: Custom SVG — Lotus/Padma geometry with Devanagari-inspired dual-petal structure. Gradient fill blue→violet. Scalable 24px–128px. See `assets/logo.svg`.
- **Emoji**: Not used in primary navigation or cards. Mood logging uses custom illustrated emoji-style inputs (not system emoji).
- **Unicode as icons**: Not used.

### CDN
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
```
Usage: `<i data-lucide="heart"></i>` — replaced by `lucide.createIcons()`.

### Key icons in use
| Context | Icon name |
|---|---|
| Home | `home` |
| Manas AI Chat | `message-circle` |
| Breathing | `wind` |
| Mood log | `smile` |
| Journey/Setupath | `map` |
| Therapist | `user-check` |
| Settings | `settings` |
| Exit session | `x` |

---

## ACCESSIBILITY

- Primary text contrast: **14.8:1 AAA** (dark mode)
- Manas chat text: **8.6:1 AAA**
- Touch targets: minimum **44×44px**
- No color-only state indication
- Focus outlines: 2px violet, offset 2px
- Reduced motion: `animation-duration: 0ms` globally

---

## File Index

```
README.md                         This file
SKILL.md                          Agent skill descriptor
colors_and_type.css               All CSS custom properties (colors, type, spacing, motion)
assets/
  logo.svg                        ManoSetu lotus/padma wordmark
  logo-mark.svg                   Icon-only mark (24–128px)
fonts/
  (Google Fonts via CDN)          Syne, DM Sans, DM Mono, Noto Sans Devanagari
preview/
  colors-dark.html                Dark mode color palette card
  colors-light.html               Light mode color palette card
  colors-semantic.html            Semantic color roles
  type-display.html               Display / heading type specimens
  type-body.html                  Body / UI type specimens
  type-mono-devanagari.html       DM Mono + Noto Sans Devanagari specimens
  spacing-tokens.html             Spacing token visualization
  radius-tokens.html              Corner radius tokens
  motion-tokens.html              Animation / motion system
  components-buttons.html         Button variants
  components-cards.html           Card variants
  components-chat.html            Chat bubble system
  components-mood.html            Mood log UI
  components-nav.html             Bottom navigation bar
ui_kits/
  app/
    README.md                     App UI kit overview
    index.html                    Full interactive app prototype
    HomeScreen.jsx                Dashboard / home screen component
    ManasChat.jsx                 Manas AI chat interface
    BreathingSession.jsx          Full-screen breathing session
    MoodLog.jsx                   Mood logging flow
    SetupathJourney.jsx           Journey / gamification screen
```
