# Interactive UI Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Implement three rich interactive UI features for the Golden Grain Bakery website:
1. **Dawn-to-Dusk Lighting Shift (Day & Night Environment Toggle)** using the exact animated sun/moon switch provided by the user.
2. **Interactive Recipe & Origin Cards**: Clicking detail tags opens an illustrated vintage recipe/field note modal with baking secrets, origins, and trivia.
3. **Miniature Brass Soundscape Mixer**: An ornate popover allowing visitors to independently adjust volume for Field Breeze, Oven Hearth, and Dining Murmur with master volume and mute controls.

---

### Task 1: Environment Theme Toggle (Day & Night Switch)
- [x] Create `src/components/EnvironmentThemeToggle.css` adapting the provided styles for container, sun/moon knob, craters, clouds, and twinkling stars with modular scoping.
- [x] Create `src/components/EnvironmentThemeToggle.tsx` with controlled `isDay` prop and `onToggle` callback.
- [x] Add `isDay` state in `src/App.tsx`.
- [x] Embed the toggle in `src/components/TopBar.tsx`.
- [x] Add the night atmosphere layer in `src/App.tsx` (deep twilight blue & amber candlelit vignette, night sky embers tint).
- [x] Write unit tests in `src/utils/themeEnvironment.test.ts`.

### Task 2: Interactive Recipe & Origin Cards
- [x] Create `src/utils/recipeCardsData.ts` with authentic baking lore, origin stories, trivia, and baker secrets for each stage detail tag.
- [x] Create `src/components/RecipeCardModal.tsx` displaying the vintage parchment card, wax seal, baker's notes, and trivia with smooth entry/exit animations and keyboard/click-outside dismissal.
- [x] Update `src/components/StoryStageCard.tsx` to render interactive detail tags that invoke `onOpenRecipeCard`.
- [x] Wire modal state and handler in `src/App.tsx`.
- [x] Write unit tests for recipe data lookup in `src/utils/recipeCardsData.test.ts`.

### Task 3: Miniature Brass Soundscape Mixer
- [x] Create `src/utils/soundMixerConfig.ts` with volume presets, track definitions, and audio gain math.
- [x] Create `src/components/SoundscapeMixer.tsx` with vintage brass gramophone button and floating popover containing master volume, track sliders, and mute toggles.
- [x] Wire audio volume levels into `src/components/AmbientAudioController.tsx` so user mixer adjustments dynamically drive audio channels.
- [x] Write unit tests for mixer logic in `src/utils/soundMixerConfig.test.ts`.

### Task 4: Verification & Polish
- [x] Run all unit tests (`npx tsx --test src/utils/*.test.ts`).
- [x] Run TypeScript lint (`npm run lint`).
- [x] Run Vite production build (`npm run build`).
- [x] Verify interactively in browser preview.
