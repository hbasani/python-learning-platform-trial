# Python Learning Platform Design System

A premium, accessible design system for a gamified Python learning product. The visual direction is calm, high-trust, and motivating: more Stripe/Linear polish than arcade game, with selective Duolingo-style reward energy.

## Design Principles

- Clarity first: every screen should make the next learning action obvious within 3 seconds.
- Premium restraint: use fewer colors, stronger spacing, better hierarchy, and confident typography.
- Motivation without manipulation: rewards celebrate mastery and consistency, not anxiety or shame.
- Mobile-native: dashboards, lesson cards, and code tasks must work comfortably at 360px width.
- Accessible by default: AA contrast, visible focus states, readable type, reduced-motion support.

## Colors

Use semantic tokens for product UI and reserve raw color scales for illustrations, charts, and rare accents.

### Primary

Purpose: main CTA, current mission, active navigation, focused learning state.

Tailwind values:

```ts
primary: {
  50: "#eef6ff",
  100: "#d9ebff",
  200: "#baddff",
  300: "#8ac8ff",
  400: "#53a7ff",
  500: "#2f7df4",
  600: "#1d5fe3",
  700: "#184cc0",
  800: "#1a439c",
  900: "#1a3a7b",
  DEFAULT: "#1d5fe3",
  foreground: "#ffffff"
}
```

Recommended usage:

- CTA: `bg-primary text-primary-foreground hover:bg-primary-700`
- Focus ring: `focus-visible:ring-4 focus-visible:ring-primary-200`
- Active card: `border-primary-200 bg-primary-50`

### Secondary

Purpose: skill-path support, calm gamification, community, coach surfaces.

Tailwind values:

```ts
secondary: {
  50: "#f4f8f7",
  100: "#dfece9",
  200: "#c3ddd6",
  300: "#9ac7bc",
  400: "#6ba99d",
  500: "#498d82",
  600: "#397168",
  700: "#315c56",
  800: "#2b4b47",
  900: "#263f3c",
  DEFAULT: "#397168",
  foreground: "#ffffff"
}
```

Recommended usage:

- Secondary CTA: `bg-secondary text-secondary-foreground hover:bg-secondary-700`
- Learning coach chip: `bg-secondary-50 text-secondary-800 border-secondary-200`

### Success

Purpose: completion, correct answer, streak maintained, tests passed.

Tailwind values:

```ts
success: {
  50: "#effaf3",
  100: "#d7f4df",
  200: "#b2e9c3",
  300: "#7fd99d",
  400: "#49c272",
  500: "#24a853",
  600: "#188640",
  700: "#166936",
  800: "#15542f",
  900: "#124528",
  DEFAULT: "#188640",
  foreground: "#ffffff"
}
```

Recommended usage:

- Completed lesson: `bg-success-50 text-success-800 border-success-200`
- Correct result: `bg-success text-success-foreground`

### Warning

Purpose: streak risk, retry needed, partial completion, time-sensitive prompt.

Tailwind values:

```ts
warning: {
  50: "#fff8eb",
  100: "#ffedc6",
  200: "#ffd889",
  300: "#ffbf4a",
  400: "#ffa51f",
  500: "#f27f0c",
  600: "#d75c07",
  700: "#b33d0a",
  800: "#91300f",
  900: "#77290f",
  DEFAULT: "#d75c07",
  foreground: "#211403"
}
```

Recommended usage:

- Nudge banner: `bg-warning-50 text-warning-900 border-warning-200`
- Streak flame: `text-warning-500`

### Error

Purpose: incorrect answer, failed tests, validation, destructive action.

Tailwind values:

```ts
error: {
  50: "#fff1f2",
  100: "#ffe1e5",
  200: "#ffc8d1",
  300: "#ffa2b2",
  400: "#fc718a",
  500: "#ef4365",
  600: "#db234d",
  700: "#b8173e",
  800: "#991638",
  900: "#831735",
  DEFAULT: "#db234d",
  foreground: "#ffffff"
}
```

Recommended usage:

- Failed test: `bg-error-50 text-error-800 border-error-200`
- Destructive CTA: `bg-error text-error-foreground hover:bg-error-700`

### Background And Content

Semantic Tailwind values are backed by CSS variables for light/dark themes:

```ts
background: {
  canvas: "hsl(var(--background-canvas) / <alpha-value>)",
  subtle: "hsl(var(--background-subtle) / <alpha-value>)",
  raised: "hsl(var(--background-raised) / <alpha-value>)",
  inverse: "hsl(var(--background-inverse) / <alpha-value>)"
},
content: {
  DEFAULT: "hsl(var(--content-primary) / <alpha-value>)",
  secondary: "hsl(var(--content-secondary) / <alpha-value>)",
  muted: "hsl(var(--content-muted) / <alpha-value>)",
  inverse: "hsl(var(--content-inverse) / <alpha-value>)"
},
border: {
  DEFAULT: "hsl(var(--border) / <alpha-value>)",
  strong: "hsl(var(--border-strong) / <alpha-value>)",
  focus: "hsl(var(--border-focus) / <alpha-value>)"
}
```

Recommended usage:

- Page: `bg-background-canvas text-content`
- Elevated panel: `bg-background-raised border border-border shadow-card`
- Muted text: `text-content-muted`

## Typography

Recommended font direction:

- Display: Fraunces or a similarly expressive serif for hero moments and achievement celebration.
- Heading: Satoshi or a geometric humanist sans for clarity and premium SaaS polish.
- Body: Satoshi, Inter fallback, or another highly readable sans.
- Code: JetBrains Mono for code editors, inline snippets, and test output.

Tailwind families:

```ts
fontFamily: {
  display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
  heading: ["var(--font-heading)", "Satoshi", "Inter", "sans-serif"],
  body: ["var(--font-body)", "Satoshi", "Inter", "sans-serif"],
  mono: ["var(--font-mono)", "JetBrains Mono", "monospace"]
}
```

### Type Scale

- Display large: `text-display-lg font-display` for landing hero only.
- Display medium: `text-display-md font-display` for major onboarding moments.
- Display small: `text-display-sm font-display` for dashboard headline.
- Heading XL: `text-heading-xl font-heading` for section titles.
- Heading LG: `text-heading-lg font-heading` for cards and modals.
- Heading MD: `text-heading-md font-heading` for dense modules.
- Body LG: `text-body-lg font-body` for intro copy.
- Body MD: `text-body-md font-body` for normal text.
- Body SM: `text-body-sm font-body` for supporting copy.
- Caption: `text-caption font-body uppercase tracking-wide` for labels.

Tailwind values:

```ts
fontSize: {
  "display-lg": ["4.5rem", { lineHeight: "0.92", letterSpacing: "-0.06em", fontWeight: "760" }],
  "display-md": ["3.5rem", { lineHeight: "0.96", letterSpacing: "-0.052em", fontWeight: "740" }],
  "display-sm": ["2.75rem", { lineHeight: "1", letterSpacing: "-0.045em", fontWeight: "720" }],
  "heading-xl": ["2rem", { lineHeight: "1.08", letterSpacing: "-0.035em", fontWeight: "720" }],
  "heading-lg": ["1.5rem", { lineHeight: "1.16", letterSpacing: "-0.028em", fontWeight: "700" }],
  "heading-md": ["1.25rem", { lineHeight: "1.25", letterSpacing: "-0.02em", fontWeight: "680" }],
  "body-lg": ["1.125rem", { lineHeight: "1.65", letterSpacing: "-0.01em", fontWeight: "450" }],
  "body-md": ["1rem", { lineHeight: "1.6", letterSpacing: "-0.006em", fontWeight: "450" }],
  "body-sm": ["0.875rem", { lineHeight: "1.5", letterSpacing: "-0.002em", fontWeight: "450" }],
  caption: ["0.75rem", { lineHeight: "1.35", letterSpacing: "0.01em", fontWeight: "560" }]
}
```

## Spacing

Use a 4px system. Avoid one-off values unless creating responsive art-directed compositions.

### Base Scale

- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `5`: 20px
- `6`: 24px
- `8`: 32px
- `10`: 40px
- `12`: 48px
- `16`: 64px
- `18`: 72px
- `22`: 88px
- `26`: 104px
- `30`: 120px

### Margins

- Mobile page margin: `px-4`
- Tablet page margin: `sm:px-6`
- Desktop page margin: `lg:px-8`
- Max content width: `max-w-7xl mx-auto`
- Section gap: `py-12 md:py-18 lg:py-22`

### Paddings

- Button compact: `px-4 py-2`
- Button default: `px-5 py-3`
- Button large: `px-6 py-4`
- Card compact: `p-4`
- Card default: `p-5 md:p-6`
- Hero panel: `p-6 md:p-8 lg:p-10`
- Modal: `p-6 md:p-8`

## Radius, Elevation, And Motion

Radius:

- Input: `rounded-xl`
- Button: `rounded-full` or `rounded-2xl`
- Card: `rounded-3xl`
- Modal: `rounded-4xl`

Shadows:

- Standard card: `shadow-card`
- Premium panel: `shadow-premium`
- Focused reward state: `shadow-glow`
- Subtle glass surface: `shadow-inset`

Motion:

- Standard transition: `transition duration-300 ease-premium`
- Large reveal: `transition duration-600 ease-premium`
- Hover lift: `hover:-translate-y-0.5`
- Press state: `active:translate-y-0`
- Respect reduced motion through global `prefers-reduced-motion` rules.

## Components

### Buttons

Primary button:

```tsx
<button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-body-sm font-semibold text-primary-foreground shadow-glow transition duration-300 ease-premium hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200 disabled:pointer-events-none disabled:opacity-45">
  Continue mission
</button>
```

Secondary button:

```tsx
<button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-background-raised px-5 py-3 text-body-sm font-semibold text-content transition duration-300 ease-premium hover:-translate-y-0.5 hover:border-border-strong hover:bg-background-subtle focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200">
  Ask coach
</button>
```

Destructive button:

```tsx
<button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-error px-5 py-3 text-body-sm font-semibold text-error-foreground transition duration-300 ease-premium hover:bg-error-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-error-100">
  Reset progress
</button>
```

### Cards

Base card:

```tsx
<section className="rounded-3xl border border-border bg-background-raised p-5 shadow-card md:p-6">
  <h2 className="font-heading text-heading-lg text-content">Python Basics</h2>
  <p className="mt-2 text-body-sm text-content-secondary">Learn variables, strings, and your first programs.</p>
</section>
```

Interactive lesson card:

```tsx
<button className="group w-full rounded-3xl border border-border bg-background-raised p-5 text-left shadow-card transition duration-300 ease-premium hover:-translate-y-1 hover:border-primary-200 hover:shadow-premium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200">
  <span className="text-caption text-primary-700">Level 1</span>
  <h3 className="mt-3 font-heading text-heading-md text-content">Print your first output</h3>
  <p className="mt-2 text-body-sm text-content-muted">10 min · 60 XP</p>
</button>
```

### Inputs

Text input:

```tsx
<label className="block">
  <span className="text-caption text-content-secondary">Email</span>
  <input className="mt-2 min-h-12 w-full rounded-xl border border-border bg-background-raised px-4 text-body-md text-content outline-none transition duration-300 ease-premium placeholder:text-content-muted focus:border-border-focus focus:ring-4 focus:ring-primary-100" placeholder="you@example.com" />
</label>
```

Code input/editor shell:

```tsx
<div className="rounded-3xl border border-border bg-slate-950 p-4 font-mono text-sm text-slate-100 shadow-premium">
  <div className="mb-3 flex gap-2"><span className="h-3 w-3 rounded-full bg-error-400" /><span className="h-3 w-3 rounded-full bg-warning-300" /><span className="h-3 w-3 rounded-full bg-success-400" /></div>
  <pre>print("Hello, Python")</pre>
</div>
```

### Badges

Status badge:

```tsx
<span className="inline-flex items-center rounded-full border border-success-200 bg-success-50 px-3 py-1 text-caption text-success-800">
  Completed
</span>
```

XP badge:

```tsx
<span className="inline-flex items-center rounded-full bg-xp-50 px-3 py-1 text-caption text-xp-500 ring-1 ring-xp-100">
  +80 XP
</span>
```

Coin badge:

```tsx
<span className="inline-flex items-center rounded-full bg-coin-50 px-3 py-1 text-caption text-coin-500 ring-1 ring-coin-100">
  120 coins
</span>
```

### Progress Bars

Lesson progress:

```tsx
<div className="h-3 overflow-hidden rounded-full bg-background-subtle ring-1 ring-border">
  <div className="h-full rounded-full bg-primary transition-all duration-600 ease-premium" style={{ width: "68%" }} />
</div>
```

Streak progress:

```tsx
<div className="h-3 overflow-hidden rounded-full bg-warning-100">
  <div className="h-full rounded-full bg-gradient-to-r from-warning-400 to-coin-400" style={{ width: "82%" }} />
</div>
```

### Achievement Cards

Locked achievement:

```tsx
<article className="rounded-3xl border border-border bg-background-raised p-5 opacity-70 shadow-card">
  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-background-subtle text-content-muted">Lock</div>
  <h3 className="mt-4 font-heading text-heading-md text-content">Loop Master</h3>
  <p className="mt-2 text-body-sm text-content-muted">Complete 20 loop challenges.</p>
</article>
```

Unlocked achievement:

```tsx
<article className="rounded-3xl border border-warning-200 bg-gradient-to-br from-warning-50 to-background-raised p-5 shadow-glow">
  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-warning-300 text-warning-900">Star</div>
  <h3 className="mt-4 font-heading text-heading-md text-content">Loop Master</h3>
  <p className="mt-2 text-body-sm text-content-secondary">You completed 20 loop challenges.</p>
  <span className="mt-4 inline-flex rounded-full bg-background-raised px-3 py-1 text-caption text-warning-800 ring-1 ring-warning-200">+250 XP</span>
</article>
```

### Navigation

Desktop navigation:

```tsx
<nav className="sticky top-4 z-40 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border bg-background-raised/86 px-4 py-3 shadow-card backdrop-blur-xl">
  <a className="font-heading text-heading-md text-content" href="/">PyCoach</a>
  <div className="hidden items-center gap-2 md:flex">
    <a className="rounded-full px-4 py-2 text-body-sm font-semibold text-content-secondary hover:bg-background-subtle hover:text-content" href="/learn">Learn</a>
    <a className="rounded-full bg-primary px-4 py-2 text-body-sm font-semibold text-primary-foreground" href="/mission">Mission</a>
  </div>
</nav>
```

Mobile bottom navigation:

```tsx
<nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-3xl border border-border bg-background-raised/92 p-2 shadow-premium backdrop-blur-xl md:hidden">
  <a className="rounded-2xl px-3 py-2 text-center text-caption text-primary-700 bg-primary-50" href="/learn">Learn</a>
  <a className="rounded-2xl px-3 py-2 text-center text-caption text-content-muted" href="/practice">Practice</a>
  <a className="rounded-2xl px-3 py-2 text-center text-caption text-content-muted" href="/quests">Quests</a>
  <a className="rounded-2xl px-3 py-2 text-center text-caption text-content-muted" href="/profile">Profile</a>
</nav>
```

## Accessibility Standards

- Maintain WCAG AA contrast for all text and controls.
- Minimum touch target: `44px` height and width.
- Use `focus-visible:ring-4` on every interactive control.
- Never communicate success/error by color alone; include text or iconography.
- Use semantic landmarks: `header`, `main`, `nav`, `section`, `footer`.
- Support `prefers-reduced-motion` globally.
- Avoid disabling zoom and avoid tiny code text on mobile.

## Mobile Standards

- Use one primary action per screen section.
- Prefer stacked cards under `md`; avoid dense dashboards on mobile.
- Keep persistent bottom navigation to 4 items maximum.
- Code exercises should use a full-width editor with horizontal scrolling only inside the code block.
- Lesson cards should show title, reward, duration, and state without requiring hover.

## Dark Mode Standards

- Use semantic classes, not hard-coded light colors, for app surfaces.
- Prefer `bg-background-canvas`, `bg-background-raised`, `text-content`, `text-content-secondary`, `border-border`.
- Keep primary CTA blue in both modes, but shift glow/rings softer in dark mode.
- Avoid pure black backgrounds except code editor surfaces.

## Product Patterns

- Onboarding: show 3 steps maximum, with the current action visually dominant.
- Learning path: use clear locked/current/completed states with labels.
- Rewards: reward after effort, not before. Use coins and XP as confirmation, not pressure.
- Coach: keep AI explanations calm and optional; never interrupt a learner mid-flow.
- Error states: phrase as recoverable next steps, especially for beginners.
