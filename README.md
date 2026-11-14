# 🌾 Golden Grain Bakery — Interactive Cinematic Story & Artisan Experience

An interactive, cinematic 4K narrative website for **Golden Grain Bakery (Est. 1924)**. Built with React, TypeScript, Tailwind CSS, Lucide icons, and modern Canvas & HTML5 Video rendering.

---

## ✨ Features & Architecture

### 1. 🎬 Seamless 4K Story Journey & Video Mode
- **Dual-Layer Rendering**:
  - **Native 4K Video Mode**: Click *"Begin the Story"* or the top-bar Play button to auto-play the 4K journey video forward at configurable speeds (1x, 1.5x, 2x, 3x), smoothly driving scroll progress and chapter transitions.
  - **Interactive 4K Canvas Sequence**: When scrubbing manually with the scrollbar or trackpad, a high-performance Canvas renders 2,016 ultra-high-resolution frames with instant sub-frame interpolation and zero-lag prefetching.
- **Narrative Chapters**:
  1. **Chapter 01 · The Farm**: Raw Grains Sorted by Hand & Bound for the City Ovens.
  2. **Chapter 02 · The Bakery**: Inspected & Signed at Dawn & Courier Dispatch.
  3. **Chapter 03 · The Hotel**: Cobblestone Doorstep Delivery & Pastry Kitchen Finishing.
  4. **Chapter 04 · The Customers**: Grand Dining Hall & The End.

---

### 2. 🥖 6 Interactive Artisanal Bakery Features

1. **Daily Hearth Bake Schedule & Live Oven Bell**
   - Live vintage slate chalkboard popover that updates dynamically based on the visitor’s real-world local time.
   - Interactive brass *"Ring for Next Batch"* oven bell with authentic crumb crackle audio feedback and a live countdown timer to the next hot pull.
2. **Interactive Sourdough Hydration & Crumb Inspector**
   - Interactive slider exploring hydration from 65% (sandwich loaf) to 85% (open-crumb sourdough).
   - Real-time cross-section crossfades showcasing fermentation time, alveoli air pocket structure, and artisan baker's tips.
3. **Artisan Pairing Sommelier (Morning Flight Builder)**
   - Interactive flight tray to pair heritage breads, artisanal cultured spreads, and single-origin morning beverages.
   - Generates custom tasting cards with flavor harmony tasting notes (*Parisian Sunrise*, *Baltic Nordic Hearth*, *Valley Orchard Morn*).
4. **"Reserve a Hearth Table" Guestbook Drawer**
   - Slide-over brass reservation guestbook with table mood selector (*Hearthside Oven Counter*, *Sunlit Garden Window*, *Courtyard Terrace*).
   - Morning loaf pre-reservation selector and illustrated vintage ticket voucher with golden wax seal stamp.
5. **"Send a Fresh Loaf" Virtual Postcard Generator**
   - Shareable gift postcard creator with vintage illustrated templates and customizable virtual wax seal colors.
   - Live card preview, direct shareable URL generation, and high-res download.
6. **Chapter-Specific Atmospheric Micro-Particles**
   - Floating golden wheat chaff & pollen motes during Farm scenes.
   - Glowing ember sparks and rising steam curls above the stone ovens during Hearth scenes.
   - Powdered sugar & flour dust drifting across the pastry bench.

---

### 3. 🎨 Design & Navigation Polish
- **Smooth Slide-Out Side Menu**: Accessible via the transparent golden button on the far-left of the navigation bar, spaced cleanly away from the brand logo with fluid slide-in/out transitions.
- **Stylized Assassin's Creed Animus Scrollbar**: Custom golden blade track and playhead styling implemented cleanly in `src/index.css`.
- **Full Mobile Responsiveness**: Every modal, drawer, flight builder, hydration slider, and speed control is responsive across mobile, tablet, and ultra-wide displays.
- **Interactive Map Fallback**: Interactive diorama and route calculation fallback when Google Maps API key is not configured.

---

## 🛠️ Tech Stack & Scripts

- **Framework**: React 18 / 19 + TypeScript
- **Styling**: Tailwind CSS + Lucide React icons
- **Build Tool**: Vite 8
- **Audio**: Web Audio API ambient audio controller & synthesized oven bell sound effects

### Available Scripts

- **Development Server**:
  ```bash
  npm run dev
  ```
- **Typecheck & Linting**:
  ```bash
  npm run lint
  ```
- **Unit & Logic Tests**:
  ```bash
  npm test
  # or: npx tsx --test src/utils/*.test.ts
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
