# Whatsapp Analyzer (WhatsApp Wrapped)

A premium, 100% client-side conversational retrospective application ("WhatsApp Wrapped") built with React, Vite, Tailwind CSS, and Framer Motion. 

This tool parses your WhatsApp chat exports (`.txt` logs or `.zip` files containing media) and transforms them into an interactive, beautifully animated story slideshow, complete with high-resolution PDF exports and social media graphic generation—all executed completely in your browser to guarantee maximum privacy.

---

## 🌟 Key Features

### 1. 🛡️ 100% Private & Client-Side
* No chat logs or metadata are ever uploaded to a server.
* The parser runs locally inside a dedicated **Web Worker** (`chat-parser.worker.js`), ensuring that the browser UI remains highly responsive even when processing multi-year chats containing millions of lines.

### 2. 📁 ZIP & Media Upload Support
* Drag and drop or upload standard `.txt` text logs.
* Directly upload zipped chat archives (`.zip`) containing media files. The app automatically extracts the primary chat log client-side using `JSZip` without requiring external extraction tools.

### 3. 📊 Premium Retrospective Slideshow (11 Animated Chapters)
Explore your conversation metrics through 11 curated, glassmorphic, and animated slides:
1. **Cover Slide**: Elegant welcome screen setting the theme.
2. **Volume & Longevity**: Lifetime message exchange counts and the span of your texting history in days.
3. **Peak Traffic**: Pinpoints your most active days of the week and peak hour frequencies.
4. **Yapper & Double Texter**: Highlights monologue streaks (consecutive texts in a row) and average texts per turn.
5. **The Ghoster**: Identifies your longest reply wait times, including exact timestamps and message snippets.
6. **Midnight Philosopher**: Tracks late-night text volumes sent between 12:00 AM and 4:00 AM.
7. **The Initiator**: Detects who started the most conversations after silent periods of 8+ hours.
8. **The Media Mogul**: Analyzes photos, videos, and custom GIF/sticker counts sent by each participant.
9. **Voice Notes (The Podcaster)**: Counts total voice messages sent, cumulative durations, top voice note sender, and highlights the "Longest Monologue" (longest single voice note).
10. **Signature Dialect & Emojis**: Tracks top-used vocabulary (excluding stop words) and favorite emoji dependencies per user.
11. **Retrospective Summary Card**: A beautiful retro-style overview dashboard summarizing all of your milestones in a single card.

### 4. 📸 High-Resolution Exports
* **Instagram Summary Card**: Generates a high-resolution, perfectly sized 1080x1920 Instagram graphic to share on social media.
* **Full Multi-Page PDF Report**: Sequential compilation of all 11 slides into a high-quality, print-ready PDF document with premium layouts.

---

## 🛠️ Technology Stack

* **Frontend**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (lightning-fast dev server and optimized production builds)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphic CSS variables
* **Animations**: [Framer Motion](https://www.framer.com/motion/) (smooth micro-animations, story progress bars, and transitions)
* **Data Processing**: Native Web Workers (parallel parsing thread)
* **Libraries**:
  * [JSZip](https://stuk.github.io/jszip/) for client-side ZIP parsing.
  * [html2canvas](https://html2canvas.hertzen.com/) for canvas-based layout captures.
  * [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) for multi-page high-resolution PDF generation.
  * [Lucide React](https://lucide.dev/) for premium modern icon assets.

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* npm or yarn

### Installation

1. Clone or download this project directory.
2. Open your terminal in the project root:
   ```bash
   npm install
   ```

### Running Locally

To launch the local development server:
```bash
npm run dev
```
Open your browser and navigate to the local URL (usually `http://localhost:5173`).

### Building for Production

To create an optimized production bundle:
```bash
npm run build
```
The compiled files will be located in the `dist/` directory, ready to be hosted on any static hosting provider (e.g., Netlify, Vercel, GitHub Pages).

---

## 📱 How to Export Your WhatsApp Chat

1. Open the chat thread in WhatsApp on your mobile phone or desktop.
2. Tap the chat name/header to view settings.
3. Select **Export Chat**.
4. Choose **Without Media** (for a `.txt` file) or **Attach Media** (to export as a `.zip` archive).
5. Upload or drag-and-drop the exported file into the **Whatsapp Analyzer** interface.
6. Sit back and watch your year in review unfold!
