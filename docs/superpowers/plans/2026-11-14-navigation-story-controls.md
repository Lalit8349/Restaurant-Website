# Navigation & Story Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Timeline Filmstrip Scrub Slider with 3 Story Speeds (0.75x Cinematic, 1x Normal, 1.5x Brisk) and Story Chapter Bookmarks with live thumbnail hover cards on the progress rail.

**Architecture:**
1. **Timeline Controls Math & Utilities (`src/utils/timelineControls.ts`)**:
   - Speeds: `0.75` (Cinematic), `1.0` (Normal), `1.5` (Brisk).
   - Chapter thumbnail mapping to high-res video frames (`/assets/frames/00080.jpg`, `00500.jpg`, `01008.jpg`, `01512.jpg`).
   - Time formatting, chapter lookup, and scrubber clamping.
2. **Timeline Filmstrip Scrubber & Speed Control (`src/components/TimelineFilmstripScrubber.tsx`)**:
   - Embeds into `TopBar` with vintage filmstrip aesthetic (golden sprockets, progress track, chapter markers, scrubbing handle, timestamp tooltip).
   - Speed switcher pill (`0.75x | 1x | 1.5x`) dynamically driving auto-scroll playback speed.
3. **Chapter Bookmarks with Live Hover Thumbnails (`src/components/JourneyProgressRail.tsx`)**:
   - Enhances rail buttons so hovering reveals an ornate preview thumbnail card with chapter frame, description, and jump timestamp.
4. **Integration in `TopBar.tsx` and `App.tsx`**:
   - Wires `storySpeed`, `onSpeedChange`, and `onScrub` into `App.tsx` driving `video.playbackRate` and smooth canvas syncing.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, Node test runner (`tsx --test`).

**Spec:** User request dated 2026-11-14.

---

### Task 1: Timeline Controls Utilities & Unit Tests
- [x] **Step 1: Write unit tests in `src/utils/timelineControls.test.ts`**
- [x] **Step 2: Implement `src/utils/timelineControls.ts`**
- [x] **Step 3: Run unit tests to verify 100% pass**

---

### Task 2: Filmstrip Scrubber & Speed Selector Component
- [x] **Step 1: Create `src/components/TimelineFilmstripScrubber.tsx`**
- [x] **Step 2: Mount `TimelineFilmstripScrubber` in `src/components/TopBar.tsx`**
- [x] **Step 3: Verify TypeScript typing and responsiveness**

---

### Task 3: Chapter Bookmarks with Live Hover Thumbnails
- [x] **Step 1: Enhance `JourneyProgressRail.tsx` with hover preview thumbnail cards**
- [x] **Step 2: Support keyboard focus accessibility and smooth animations**

---

### Task 4: Connect Speed & Scrubbing in `App.tsx` & Verification
- [x] **Step 1: Add `storySpeed` state and connect playback rate to RAF loop and video in `src/App.tsx`**
- [x] **Step 2: Connect scrubbing callbacks to smooth scroll synchronization**
- [x] **Step 3: Run all unit tests (`npx tsx --test src/utils/*.test.ts`)**
- [x] **Step 4: Run TypeScript lint (`npm run lint`)**
- [x] **Step 5: Run production build (`npm run build`)**
