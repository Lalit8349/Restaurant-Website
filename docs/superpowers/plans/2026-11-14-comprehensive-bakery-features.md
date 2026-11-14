# Comprehensive Bakery Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 6 rich interactive bakery features (Daily Hearth Bake Schedule with Oven Bell, Sourdough Hydration & Crumb Inspector, Artisan Pairing Sommelier, Reserve a Hearth Table Guestbook Drawer, Send a Fresh Loaf Virtual Postcard Generator, and Multi-Stage Hearth Ember & Steam Atmospheric Micro-Particles), organizing all feature access buttons cleanly inside the side slider menu (`BakerySliderDrawer.tsx`).

**Architecture:**
1. **Side Menu Centralization (`src/components/BakerySliderDrawer.tsx`)**:
   - Provide an organized, scrollable drawer section containing access buttons for all interactive tools:
     - 🔔 Daily Hearth Bake Schedule
     - 🥖 Sourdough Hydration Inspector
     - ☕ Artisan Pairing Sommelier
     - 📖 Reserve a Hearth Table
     - 💌 Send a Fresh Loaf Postcard
     - 🎂 Cake Finisher Atelier
     - 🐱 Baker's Secret Companion Hunt
2. **Feature 1: Daily Hearth Bake Schedule & Live Oven Bell**:
   - Time calculations, next bake slot countdown, and audio chime helper in `src/utils/hearthBakeSchedule.ts`.
   - Slate chalkboard modal with interactive brass bell in `src/components/HearthBakeScheduleModal.tsx`.
3. **Feature 2: Sourdough Hydration & Crumb Inspector**:
   - Hydration math (65% to 85%), crumb air-pocket density, and fermentation specs in `src/utils/sourdoughHydration.ts`.
   - Interactive slider and dynamic SVG/canvas crumb cross-section in `src/components/SourdoughHydrationModal.tsx`.
4. **Feature 3: Artisan Pairing Sommelier (Morning Flight Builder)**:
   - Bread, spread, and beverage pairings with flavor harmony engine in `src/utils/pairingSommelier.ts`.
   - Interactive 3-tier flight builder and generated Tasting Card in `src/components/PairingSommelierModal.tsx`.
5. **Feature 4: Reserve a Hearth Table Guestbook Drawer**:
   - Table moods (Hearthside, Window, Courtyard), party validation, and voucher reference generator in `src/utils/tableReservation.ts`.
   - Vintage brass & leather guestbook reservation modal with loaf pre-orders and ticket generation in `src/components/TableReservationModal.tsx`.
6. **Feature 5: "Send a Fresh Loaf" Virtual Postcard Generator**:
   - Templates, wax seal stamps, and share link logic in `src/utils/postcardGenerator.ts`.
   - Interactive double-sided vintage postcard modal with wax seal stamp in `src/components/PostcardGeneratorModal.tsx`.
7. **Feature 6: Hearth Ember & Steam Atmospheric Micro-Particles**:
   - Particle multi-type physics (chaff, glowing embers, rising steam, powdered sugar/flour) in `src/utils/atmosphericParticles.ts`.
   - Updated particle canvas in `src/components/WheatChaffOverlay.tsx` seamlessly crossfading particle physics by chapter.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide icons, Web Audio API, Canvas 2D, Node test runner (`tsx --test`).

**Spec:** User request dated 2026-11-14.

---

### Task 1: Daily Hearth Bake Schedule & Live Oven Bell
**Files:**
- Create: `src/utils/hearthBakeSchedule.ts`
- Create: `src/utils/hearthBakeSchedule.test.ts`
- Create: `src/components/HearthBakeScheduleModal.tsx`

- [x] **Step 1: Write unit tests in `src/utils/hearthBakeSchedule.test.ts`**
- [x] **Step 2: Implement `src/utils/hearthBakeSchedule.ts`**
- [x] **Step 3: Implement `src/components/HearthBakeScheduleModal.tsx`**

---

### Task 2: Sourdough Hydration & Crumb Inspector
**Files:**
- Create: `src/utils/sourdoughHydration.ts`
- Create: `src/utils/sourdoughHydration.test.ts`
- Create: `src/components/SourdoughHydrationModal.tsx`

- [x] **Step 1: Write unit tests in `src/utils/sourdoughHydration.test.ts`**
- [x] **Step 2: Implement `src/utils/sourdoughHydration.ts`**
- [x] **Step 3: Implement `src/components/SourdoughHydrationModal.tsx`**

---

### Task 3: Artisan Pairing Sommelier (Morning Flight Builder)
**Files:**
- Create: `src/utils/pairingSommelier.ts`
- Create: `src/utils/pairingSommelier.test.ts`
- Create: `src/components/PairingSommelierModal.tsx`

- [x] **Step 1: Write unit tests in `src/utils/pairingSommelier.test.ts`**
- [x] **Step 2: Implement `src/utils/pairingSommelier.ts`**
- [x] **Step 3: Implement `src/components/PairingSommelierModal.tsx`**

---

### Task 4: Reserve a Hearth Table Guestbook Drawer
**Files:**
- Create: `src/utils/tableReservation.ts`
- Create: `src/utils/tableReservation.test.ts`
- Create: `src/components/TableReservationModal.tsx`

- [x] **Step 1: Write unit tests in `src/utils/tableReservation.test.ts`**
- [x] **Step 2: Implement `src/utils/tableReservation.ts`**
- [x] **Step 3: Implement `src/components/TableReservationModal.tsx`**

---

### Task 5: "Send a Fresh Loaf" Virtual Postcard Generator
**Files:**
- Create: `src/utils/postcardGenerator.ts`
- Create: `src/utils/postcardGenerator.test.ts`
- Create: `src/components/PostcardGeneratorModal.tsx`

- [x] **Step 1: Write unit tests in `src/utils/postcardGenerator.test.ts`**
- [x] **Step 2: Implement `src/utils/postcardGenerator.ts`**
- [x] **Step 3: Implement `src/components/PostcardGeneratorModal.tsx`**

---

### Task 6: Hearth Ember & Steam Atmospheric Micro-Particles
**Files:**
- Create: `src/utils/atmosphericParticles.ts`
- Create: `src/utils/atmosphericParticles.test.ts`
- Modify: `src/components/WheatChaffOverlay.tsx`

- [x] **Step 1: Write unit tests in `src/utils/atmosphericParticles.test.ts`**
- [x] **Step 2: Implement `src/utils/atmosphericParticles.ts`**
- [x] **Step 3: Upgrade `src/components/WheatChaffOverlay.tsx` to render chapter-specific particles**

---

### Task 7: Integrate Side Menu & Wiring in `App.tsx`
**Files:**
- Modify: `src/components/BakerySliderDrawer.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: Update `BakerySliderDrawer.tsx` with buttons for all 5 new features**
- [x] **Step 2: Wire modal states in `src/App.tsx`**
- [x] **Step 3: Run all unit tests (`npx tsx --test src/utils/*.test.ts`)**
- [x] **Step 4: Run TypeScript lint (`npm run lint`)**
- [x] **Step 5: Run production build (`npm run build`)**
