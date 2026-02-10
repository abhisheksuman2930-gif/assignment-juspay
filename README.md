# Scratch-style Cat Sprite Project

A block-based coding app where you control cat sprites on a stage using drag-and-drop blocks, similar to Scratch.

## Getting started

```bash
npm i
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:

```bash
npm run build
```

## Features

- **Sidebar** — Drag blocks from Motion, Looks, and Control into the script area.
- **Mid area** — One script per cat. Switch tabs (Cat 1, Cat 2, …) to edit that cat’s blocks. Add/remove cats and clear blocks.
- **Preview** — Stage with cat sprites. Shows x/y for the active tab’s cat. Play runs all scripts; clicking a cat runs only that cat’s script and selects its tab. You can drag cats to move them.
- **Blocks** — Move steps, turn degrees, go to x/y, say/think for seconds, repeat N times, wait N seconds. When two cats get close, their movement directions swap (bounce).

## Tech stack

- React 17
- Tailwind CSS
- Webpack 5

## Project structure

- `src/App.js` — Root component, renders `Layout`.
- `src/components/Layout.js` — Main layout, state (sprites, scripts, active tab), play/script execution and collision.
- `src/components/Sidebar.js` — Draggable block palette (Motion, Looks, Control).
- `src/components/MidArea.js` — Cat tabs, script list, block editing, add cat, clear, remove block/sprite.
- `src/components/PreviewArea.js` — Stage, coordinates bar, Play/Reload, click-to-select and click-to-run sprite.
- `src/components/CatSprite.js` — Cat SVG sprite.
- `src/constant/index.js` — Sprite size and timing constants.
- `src/utils/blocks.js` — Block factory (defaults for new blocks).
- `src/utils/sprites.js` — Sprite/script IDs and collision detection.
