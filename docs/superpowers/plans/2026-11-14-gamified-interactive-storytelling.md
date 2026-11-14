# Gamified & Interactive Storytelling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the audio mixer button and its features, reduce the Day/Night toggle size by 50%, and implement two rich gamified features: "Find the Baker's Secret" Easter Egg Hunt (with promo code unlock) and the "Miniature Cake Finisher" interactive decorating workbench.

**Architecture:** 
1. **Refactor & Resize**: Remove `SoundscapeMixer` components and config; adjust `EnvironmentThemeToggle.css` wrapper and transform scale to half size (~0.20 scale).
2. **"Find the Baker's Secret" Easter Egg Hunt**: Pure state tracker in `src/utils/bakersSecretHunt.ts` persisting discovered items in `localStorage`. Hidden animated collectible items (`BakersSecretEasterEgg.tsx`) embedded within specific stages (Farm, Hearth Oven, Grand Hotel). Reward popup (`BakersSecretModal.tsx`) when all 3 are gathered, revealing secret promo code `HEARTH1924`.
3. **Miniature Cake Finisher**: Interactive topping placer in `src/components/CakeFinisherModal.tsx` powered by pure layout and coordinate logic in `src/utils/cakeFinisherConfig.ts`. Visitors drag & drop or click to place whipped cream rosettes, wild strawberries, blueberries, chocolate curls, and gold leaf onto a layered sponge cake, with undo/clear and "Present to Grand Table" celebration.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, HTML5 Drag & Drop / Pointer events, Canvas/SVG, Node test runner (`tsx --test`).

**Spec:** User request dated 2026-11-14.

## Global Constraints
- Preserve smooth 60fps video and canvas scrolling synchronization.
- Day/Night switch must retain its exact sun/moon celestial knob and cloud/star animations, displayed at 50% of previous size.
- Easter eggs must be accessible, mobile-friendly (tap-friendly), and responsive.
- Cake Finisher must support both drag-and-drop and tap-to-place for touch devices.

## Review Focus
1. Audio removal must completely clean up `SoundscapeMixer` from `TopBar`, `App`, and `AmbientAudioController` without breaking ambient audio playback.
2. 50% toggle scale must not clip within `TopBar` or create excessive whitespace.
3. Easter Egg items must be discoverable on both mobile viewports and large monitors without blocking text readability.
4. Cake Finisher touch events must work reliably on mobile devices without scrolling the page.
5. All unit tests must pass (`npx tsx --test src/utils/*.test.ts`) and `npm run build` must succeed with zero errors.

---

### Task 1: Remove Audio Mixer & Scale Day/Night Button to 50%
- [x] **Step 1: Revert `AmbientAudioController.tsx` to pure scroll-based ambient audio**
- [x] **Step 2: Remove `SoundscapeMixer` from `TopBar.tsx` and `App.tsx`**
- [x] **Step 3: Update `EnvironmentThemeToggle.css` to 50% size**
- [x] **Step 4: Run unit tests and lint**

---

### Task 2: "Find the Baker's Secret" Easter Egg Hunt
- [x] **Step 1: Write tests for `bakersSecretHunt.ts`**
- [x] **Step 2: Implement `src/utils/bakersSecretHunt.ts`**
- [x] **Step 3: Implement `BakersSecretEasterEgg.tsx`**
- [x] **Step 4: Implement `BakersSecretModal.tsx`**
- [x] **Step 5: Integrate Easter Eggs into `StoryStageCard.tsx` and TopBar tracker pill**

---

### Task 3: Miniature Cake Finisher (Interactive Decorating Widget)
- [x] **Step 1: Write tests for `cakeFinisherConfig.ts`**
- [x] **Step 2: Implement `src/utils/cakeFinisherConfig.ts`**
- [x] **Step 3: Implement `CakeFinisherModal.tsx`**
- [x] **Step 4: Connect Launch Button in Stage 3 & `App.tsx`**

---

### Task 4: Verification & Polish
- [x] **Step 1: Run all unit tests** (`npx tsx --test src/utils/*.test.ts`).
- [x] **Step 2: Run TypeScript lint** (`npm run lint`).
- [x] **Step 3: Run production build** (`npm run build`).
- [x] **Step 4: Interactive verification on dev server** (`http://localhost:3000/`).
