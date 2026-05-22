---
name: manosetu-design
description: Use this skill to generate well-branded interfaces and assets for ManoSetu, an India-first mental health and wellness app. Contains essential design guidelines, colors, typography, spacing, motion tokens, brand assets, and a full mobile app UI kit for prototyping or production reference.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

**Brand palette (dark mode primary)**
- App BG: `#0C1120`
- Card: `#111827` · Elevated: `#1C2333`
- Violet (Manas/AI): `#7C3AED`
- Blue (Therapy): `#3B82F6`
- Text primary: `#F0F4FF` · Manas text: `#C4B5FD`

**Typography**
- Display/Headings: `Syne` 700–800
- Body/UI: `DM Sans` 300–500
- Code: `DM Mono` 400
- Sanskrit: `Noto Sans Devanagari` 400–500

**Spacing**
- Screen padding: 20px H / 24px V
- Card padding: 16px
- Section gap: 12px · Inline: 8px

**Radius**
- Card: 16px · Button: 12px · Pill: 999px

**Motion**
- Entrance: `fadeUp` 0.7s ease-out (24px Y)
- Float: 4s ease-in-out infinite
- Reduced motion: `animation-duration: 0ms` — ZERO, not slowed

**Key files**
- `colors_and_type.css` — all CSS custom properties
- `assets/logo.svg` — full wordmark
- `assets/logo-mark.svg` — icon mark (24–128px)
- `ui_kits/app/index.html` — full interactive app prototype
