# 2026 Premium UI Redesign

## Brutal Diagnosis

Score before this pass: **74/100**. The app had strong intent, but still felt early-stage: too many saturated reward colors, thick visual containers, repetitive cards, and gamification widgets competing with the learning task.

## Outdated

- Heavy rounded cards everywhere made the product feel like a template dashboard.
- Bright gamification colors were overused, so progress, currency, streaks, and actions all competed.
- The dark/light mix lacked a single premium surface strategy.
- Uppercase labels and bold text were too frequent, reducing hierarchy.
- The first screen did not feel like guided onboarding; it felt like a control panel.

## Generic

- "XP / coins / league" appeared as common gamification furniture instead of a learning loop.
- Cards used similar spacing, similar radii, and similar emphasis.
- The code mission lacked a premium product frame around why the user should do it.
- Shop and reward elements looked decorative rather than productized.

## Hurting Conversion

- Too many choices before the first meaningful action.
- Primary mission did not dominate enough.
- Onboarding steps were implied, not explicit.
- Mobile stacking risked burying the mission beneath support panels.
- The interface felt more busy than trustworthy.

## Before vs After

| Area | Before | After |
| --- | --- | --- |
| First impression | Energetic but noisy | Calm, guided, premium |
| Visual hierarchy | Many equal cards | Mission-first center stage |
| Color | Blue, green, red, gold all loud | Neutral shell with one blue action color |
| Typography | Frequent heavy labels | Larger mission headline, quieter metadata |
| Layout | Dashboard collage | Three-zone product layout: onboarding/path, mission, support |
| Gamification | Decorative stats | Progress supports onboarding and next action |
| Conversion | User decides where to start | Product directs user to continue mission |

## Design Tokens

```css
--surface-page: #f7f8fb;
--surface-card: #ffffff;
--ink: #111827;
--ink-muted: #667085;
--line: #e4e7ec;
--accent: #2563eb;
--accent-soft: #eff6ff;
--success: #16a34a;
--radius-panel: 18px;
--shadow-panel: 0 18px 55px rgba(17, 24, 39, 0.08);
```

## Component Redesigns

- Buttons: moved from playful cyan to premium ink/white primary and bordered secondary.
- Panels: moved to consistent 18px radius, thin borders, and soft shadows.
- Onboarding: added explicit three-step progress so a new user understands the first session.
- Skill path: redesigned as a calm status list with current, complete, ready, and locked states.
- Mission card: elevated as the main conversion surface with action-oriented copy and focused controls.
- Stats: reduced visual volume; reward data now supports the task rather than dominating it.

## Layout Improvements

- Left: identity, onboarding, and learning path.
- Center: mission header, segmented navigation, code/coach/progress surfaces.
- Right: quest progress, active track, and reward shop.
- Mobile: columns collapse naturally while preserving mission-first reading order inside the central content.

## Retention Strategy

- First session loop: onboarding -> mission -> output -> coach -> reward.
- Daily loop: compact daily plan and quest progress.
- Progress loop: visible level progress and active track continuity.
- Emotional loop: calm confidence, not pressure or shame.

