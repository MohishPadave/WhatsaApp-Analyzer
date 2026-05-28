import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import {
  Upload,
  FileText,
  Download,
  RefreshCw,
  Play,
  Pause,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const SLIDE_DURATION = 7000; // 7 seconds per slide for reading detailed roasts

function formatDuration(ms) {
  if (!ms || ms <= 0) return '0 minutes';
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const displayDays = days;
  const displayHours = hours % 24;
  const displayMinutes = minutes % 60;

  const parts = [];
  if (displayDays > 0) parts.push(`${displayDays} day${displayDays > 1 ? 's' : ''}`);
  if (displayHours > 0) parts.push(`${displayHours} hour${displayHours > 1 ? 's' : ''}`);
  if (displayMinutes > 0 && parts.length < 2) parts.push(`${displayMinutes} min${displayMinutes > 1 ? 's' : ''}`);

  return parts.join(', ') || 'a few seconds';
}

function calculateChatAura(results) {
  if (!results) return null;

  const totalMidnight = results.totalMidnightMessages || 0;
  const totalMsgs = results.totalMessages || 1;
  const midnightRatio = totalMidnight / totalMsgs;

  const totalBombs = Object.values(results.notificationBombs || {}).reduce((a, b) => a + b, 0);
  const totalPanic = Object.values(results.panicCounts || {}).reduce((a, b) => a + b, 0);
  const panicRatio = totalPanic / totalMsgs;

  let theme = 'balanced';
  if (midnightRatio > 0.12) {
    theme = 'midnight';
  } else if (totalBombs > 15) {
    theme = 'active';
  }

  const speedMultiplier = Math.min(3, 1 + (panicRatio * 15));
  const pulseDuration = Math.max(2.5, 8 / speedMultiplier);

  return { theme, pulseDuration, midnightRatio, totalBombs, panicRatio };
}

const SLIDE_STYLES = [
  { // Slide 0 (Cover)
    bg: '#F5D6CE',
    text: '#1C1A17',
    secondaryText: '#6C5C57',
    accent: '#0066FF',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Overlapping large geometric loops - Cover style */}
        <svg className="absolute -bottom-24 -left-12 w-[120%] h-[60%] opacity-90" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Black loop ring */}
          <path d="M50 150 C 50 80, 150 80, 150 150 C 150 220, 250 220, 250 150" stroke="#1C1A17" strokeWidth="26" strokeLinecap="round" />
          {/* Cobalt Blue loop ring intersecting */}
          <path d="M150 150 C 150 220, 250 220, 250 150 C 250 80, 350 80, 350 150" stroke="#0066FF" strokeWidth="26" strokeLinecap="round" />
          {/* White loop ring intersecting */}
          <path d="M100 90 C 140 50, 200 90, 200 150 C 200 210, 260 250, 300 210" stroke="#FFFFFF" strokeWidth="26" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 1 (Volume & Longevity)
    bg: '#F2CFC6',
    text: '#1C1A17',
    secondaryText: '#6C5C57',
    accent: '#0066FF',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Overlocking loops at bottom like Card 1 in the screenshot */}
        <svg className="absolute -bottom-20 -right-10 w-[110%] h-[55%] opacity-95" viewBox="0 0 350 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 180 C 80 100, 180 100, 180 180 C 180 260, 280 260, 280 180" stroke="#FFFFFF" strokeWidth="30" strokeLinecap="round" />
          <path d="M180 180 C 180 260, 280 260, 280 180 C 280 100, 380 100, 380 180" stroke="#0066FF" strokeWidth="30" strokeLinecap="round" />
          <path d="M130 130 C 160 90, 220 130, 220 180 C 220 230, 280 270, 310 230" stroke="#1C1A17" strokeWidth="22" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 2 (Peak Traffic)
    bg: '#E5ECE7',
    text: '#1C2D22',
    secondaryText: '#556E5D',
    accent: '#0066FF',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-95" viewBox="0 0 360 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Green wave shapes */}
          <path d="M-50 250 C 50 150, 150 350, 250 250 C 350 150, 450 250, 450 250 L 450 450 L -50 450 Z" fill="#C5D9CE" />
          {/* Blue organic wave */}
          <path d="M100 200 C 160 140, 220 260, 280 200 C 340 140, 400 200, 400 200 L 400 400 L 100 400 Z" fill="#0066FF" fillOpacity="0.12" />
          {/* White loop line */}
          <path d="M80 150 C 150 150, 200 80, 270 150" stroke="#FFFFFF" strokeWidth="22" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 3 (Yapper & Double Texter)
    bg: '#F4F1EA',
    text: '#1C1A17',
    secondaryText: '#6C685F',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Overlapping speech bubble elements */}
        <svg className="absolute inset-0 w-full h-full opacity-95" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Green organic connector path */}
          <path d="M380 50 C 250 50, 200 250, 200 350 C 200 450, 100 500, -50 500" stroke="#C3DEC9" strokeWidth="44" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 4 (The Ghoster)
    bg: '#EAF1E0',
    text: '#1C2B1F',
    secondaryText: '#5F6C61',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Quote ribbon card style */}
        <svg className="absolute inset-0 w-full h-full opacity-95" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wavy Green Ribbon */}
          <path d="M280 -50 C 280 100, 120 150, 120 300 C 120 450, 220 500, 220 700" stroke="#9AD3AA" strokeWidth="44" strokeLinecap="round" />
          {/* Wavy Orange Ribbon */}
          <path d="M200 440 C 200 500, 300 500, 300 580 C 300 660, 200 700, 150 700" stroke="#E95D3C" strokeWidth="32" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 5 (Speed Racer vs Snail)
    bg: '#ECF5E6',
    text: '#1C3B24',
    secondaryText: '#547A5F',
    accent: '#0066FF',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-0 right-0 w-[110%] h-[55%] opacity-90" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Speedy circular speedometer arcs */}
          <circle cx="200" cy="200" r="120" stroke="#C2DFCE" strokeWidth="20" strokeDasharray="300 100" />
          <circle cx="200" cy="200" r="90" stroke="#0066FF" strokeWidth="12" strokeDasharray="180 80" strokeOpacity="0.15" />
          <line x1="200" y1="200" x2="110" y2="110" stroke="#1C3B24" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 6 (Notification Bomber)
    bg: '#FAF0EC',
    text: '#3D1B10',
    secondaryText: '#784C3F',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-[-100px] left-[-50px] w-[130%] h-[70%] opacity-90" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Floating alert cards in background */}
          <rect x="50" y="80" width="220" height="70" rx="16" stroke="#F1DCD3" strokeWidth="4" />
          <rect x="90" y="160" width="220" height="70" rx="16" stroke="#E95D3C" strokeWidth="4" strokeOpacity="0.1" />
          <rect x="130" y="240" width="220" height="70" rx="16" stroke="#F1DCD3" strokeWidth="4" />
        </svg>
      </div>
    )
  },
  { // Slide 7 (Midnight Philosopher)
    bg: '#E2E0EF',
    text: '#201A35',
    secondaryText: '#5F5875',
    accent: '#1C1A17',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-0 left-0 w-full h-[65%] opacity-90" viewBox="0 0 360 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wave */}
          <path d="M-20 220 C 80 180, 180 320, 280 250 C 380 180, 420 220, 420 220 L 420 450 L -20 450 Z" fill="#201A35" fillOpacity="0.06" />
          {/* Moon crescent */}
          <circle cx="280" cy="120" r="45" fill="#FFFFFF" />
          <circle cx="262" cy="110" r="41" fill="#E2E0EF" />
          {/* Stars */}
          <path d="M80 80 L 82 85 L 87 85 L 83 88 L 85 93 L 80 90 L 75 93 L 77 88 L 73 85 L 78 85 Z" fill="#D4AF37" />
          <path d="M160 180 L 161 183 L 165 183 L 162 185 L 163 189 L 160 187 L 157 189 L 158 185 L 155 183 L 159 183 Z" fill="#D4AF37" />
          {/* Wavy path line */}
          <path d="M50 250 C 120 300, 200 200, 270 250" stroke="#FFFFFF" strokeWidth="18" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 8 (The Initiator)
    bg: '#FAF4D3',
    text: '#3B3118',
    secondaryText: '#736548',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Starburst rays and intersecting rings */}
        <svg className="absolute -bottom-16 -right-16 w-80 h-80 opacity-90" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="150" cy="150" r="110" stroke="#E95D3C" strokeWidth="14" strokeDasharray="25 15" />
          <circle cx="150" cy="150" r="80" stroke="#0066FF" strokeWidth="8" strokeDasharray="40 10" />
          <circle cx="150" cy="150" r="50" stroke="#1C1A17" strokeWidth="5" />
          <line x1="150" y1="20" x2="150" y2="45" stroke="#E95D3C" strokeWidth="4" strokeLinecap="round" />
          <line x1="150" y1="255" x2="150" y2="280" stroke="#E95D3C" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="150" x2="45" y2="150" stroke="#0066FF" strokeWidth="4" strokeLinecap="round" />
          <line x1="255" y1="150" x2="280" y2="150" stroke="#0066FF" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    )
  },
  { // Slide 9 (Chat CPR Award)
    bg: '#EDFAF0',
    text: '#153C22',
    secondaryText: '#4F7359',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute -bottom-10 -left-10 w-[110%] h-[55%] opacity-90" viewBox="0 0 350 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* EKG heartbeat line */}
          <path d="M0 120 L 80 120 L 100 60 L 120 180 L 140 100 L 150 130 L 160 120 L 220 120 L 235 40 L 250 200 L 265 140 L 280 120 L 350 120" stroke="#22C55E" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="280" cy="120" r="16" fill="#E95D3C" fillOpacity="0.2" />
        </svg>
      </div>
    )
  },
  { // Slide 10 (Dry Spell Milestone)
    bg: '#FAF4EC',
    text: '#3B2C1C',
    secondaryText: '#7A624E',
    accent: '#D2B48C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-0 left-0 w-full h-[60%] opacity-90" viewBox="0 0 360 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sun and desert dune lines */}
          <circle cx="180" cy="120" r="60" fill="#E95D3C" fillOpacity="0.08" />
          <path d="M-50 280 C 100 230, 200 330, 410 250 L 410 450 L -50 450 Z" fill="#EAE0D5" />
          <path d="M-50 320 C 80 290, 250 380, 410 310 L 410 450 L -50 450 Z" fill="#D2B48C" fillOpacity="0.2" />
        </svg>
      </div>
    )
  },
  { // Slide 11 (The Media Mogul)
    bg: '#F8EFEB',
    text: '#282321',
    secondaryText: '#6E625F',
    accent: '#0066FF',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Polaroids and vectors */}
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-40 450 C 60 450, 120 300, 200 300 C 280 300, 340 450, 400 450" stroke="#0066FF" strokeWidth="32" strokeLinecap="round" strokeOpacity="0.08" />
          <g transform="translate(50, 380) rotate(-10)">
            <rect x="0" y="0" width="110" height="140" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.05))" />
            <rect x="8" y="8" width="94" height="94" rx="3" fill="#EAE5E2" />
            <circle cx="55" cy="55" r="14" fill="#0066FF" fillOpacity="0.15" />
            <path d="M38 65 L 55 48 L 72 65 Z" fill="#E95D3C" fillOpacity="0.2" />
          </g>
          <g transform="translate(195, 395) rotate(12)">
            <rect x="0" y="0" width="105" height="135" rx="8" fill="#FFFFFF" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.06))" />
            <rect x="8" y="8" width="89" height="89" rx="3" fill="#C5D9CE" fillOpacity="0.4" />
            <circle cx="52" cy="52" r="10" fill="#224535" fillOpacity="0.25" />
          </g>
        </svg>
      </div>
    )
  },
  { // Slide 12 (Text-to-Media Ratio)
    bg: '#EBF9F3',
    text: '#123C27',
    secondaryText: '#4F7A62',
    accent: '#10B981',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-[-50px] right-[-50px] w-[110%] h-[55%] opacity-90" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Overlapping grid arrays of image frames */}
          <rect x="50" y="50" width="150" height="150" rx="20" stroke="#10B981" strokeWidth="6" strokeDasharray="15 10" strokeOpacity="0.2" />
          <rect x="120" y="120" width="160" height="160" rx="24" stroke="#10B981" strokeWidth="8" strokeOpacity="0.1" />
        </svg>
      </div>
    )
  },
  { // Slide 13 (Voice Notes)
    bg: '#F3E9FA',
    text: '#29183B',
    secondaryText: '#665578',
    accent: '#8A2BE2',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft overlapping sound waves */}
        <svg className="absolute -bottom-24 -left-12 w-[120%] h-[60%] opacity-80" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="100" width="12" height="100" rx="6" fill="#8A2BE2" fillOpacity="0.15" />
          <rect x="80" y="80" width="12" height="140" rx="6" fill="#8A2BE2" fillOpacity="0.25" />
          <rect x="100" y="60" width="12" height="180" rx="6" fill="#8A2BE2" fillOpacity="0.4" />
          <rect x="120" y="90" width="12" height="120" rx="6" fill="#29183B" fillOpacity="0.3" />
          <rect x="140" y="70" width="12" height="160" rx="6" fill="#0066FF" fillOpacity="0.2" />
          <rect x="160" y="110" width="12" height="80" rx="6" fill="#8A2BE2" fillOpacity="0.3" />
          <rect x="180" y="50" width="12" height="200" rx="6" fill="#8A2BE2" fillOpacity="0.5" />
          <rect x="200" y="80" width="12" height="140" rx="6" fill="#29183B" fillOpacity="0.4" />
          <rect x="220" y="100" width="12" height="100" rx="6" fill="#8A2BE2" fillOpacity="0.35" />
          <rect x="240" y="60" width="12" height="180" rx="6" fill="#8A2BE2" fillOpacity="0.2" />
          <rect x="260" y="90" width="12" height="120" rx="6" fill="#0066FF" fillOpacity="0.2" />
          <rect x="280" y="120" width="12" height="60" rx="6" fill="#8A2BE2" fillOpacity="0.15" />
        </svg>
      </div>
    )
  },
  { // Slide 14 (Vocabulary & Emojis)
    bg: '#E3EEF6',
    text: '#102235',
    secondaryText: '#4D5C6C',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 150 C 100 150, 100 350, 250 350 C 400 350, 400 150, 450 150" stroke="#BDD6EC" strokeWidth="44" strokeLinecap="round" />
          <circle cx="80" cy="400" r="85" fill="#FFFFFF" fillOpacity="0.25" />
          <circle cx="280" cy="470" r="65" fill="#FFFFFF" fillOpacity="0.35" />
        </svg>
      </div>
    )
  },
  { // Slide 15 (Slang Lord vs Corporate Dictator)
    bg: '#F9F9FB',
    text: '#1F2937',
    secondaryText: '#4B5563',
    accent: '#FBBF24',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Half divided diagonal vector background */}
          <path d="M-20 -20 L 380 300 L 380 660 L -20 660 Z" fill="#E5E7EB" fillOpacity="0.3" />
          <line x1="-20" y1="-20" x2="380" y2="300" stroke="#1F2937" strokeWidth="4" strokeOpacity="0.1" />
        </svg>
      </div>
    )
  },
  { // Slide 16 (The Panic Station Index)
    bg: '#FAF0F0',
    text: '#3D1010',
    secondaryText: '#7A4A4A',
    accent: '#EF4444',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute bottom-[-80px] right-[-50px] w-[110%] h-[55%] opacity-90" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Warning rings and alert hazard diagonal segments */}
          <circle cx="180" cy="180" r="100" stroke="#EF4444" strokeWidth="12" strokeDasharray="30 20" strokeOpacity="0.15" />
          <circle cx="180" cy="180" r="70" stroke="#EF4444" strokeWidth="6" strokeOpacity="0.08" />
          <path d="M100 280 L 260 120" stroke="#EF4444" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.05" />
        </svg>
      </div>
    )
  },
  { // Slide 17 (The Hyper-Fixation Phase)
    bg: '#FAF0F7',
    text: '#3A1035',
    secondaryText: '#734470',
    accent: '#EC4899',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Focus targets */}
          <circle cx="180" cy="180" r="120" stroke="#F472B6" strokeWidth="10" strokeDasharray="20 10" strokeOpacity="0.25" />
          <circle cx="180" cy="180" r="80" stroke="#EC4899" strokeWidth="6" strokeOpacity="0.15" />
          <circle cx="180" cy="180" r="40" stroke="#EC4899" strokeWidth="2" strokeOpacity="0.2" />
        </svg>
      </div>
    )
  },
  { // Slide 18 (Chat Aura)
    bg: '#0A0A0E',
    text: '#FFFFFF',
    secondaryText: '#8E9A8F',
    accent: '#8B5CF6',
    shapes: null
  },
  { // Slide 19 (Heatmap Timeline)
    bg: '#F5ECE5',
    text: '#2F231D',
    secondaryText: '#7A6458',
    accent: '#E95D3C',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-50 480 C 100 450, 180 520, 410 490" stroke="#E95D3C" strokeWidth="4" strokeOpacity="0.1" />
          <path d="M-50 510 C 120 540, 200 480, 410 520" stroke="#E95D3C" strokeWidth="6" strokeOpacity="0.08" />
        </svg>
      </div>
    )
  },
  { // Slide 20 (Summary Card)
    bg: '#F4F1EA',
    text: '#1C1A17',
    secondaryText: '#6C685F',
    accent: '#0066FF',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Intersecting loops and vintage frame corner brackets */}
        <svg className="absolute inset-0 w-full h-full opacity-90" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="640" r="150" stroke="#0066FF" strokeWidth="18" strokeOpacity="0.2" fill="none" />
          <circle cx="360" cy="640" r="110" stroke="#E95D3C" strokeWidth="14" strokeOpacity="0.15" fill="none" />
          <circle cx="360" cy="0" r="75" stroke="#1C1A17" strokeWidth="10" strokeOpacity="0.08" fill="none" />
          <path d="M 22 42 L 22 22 L 42 22" stroke="#6C685F" strokeWidth="1.5" fill="none" />
          <path d="M 338 42 L 338 22 L 318 22" stroke="#6C685F" strokeWidth="1.5" fill="none" />
          <path d="M 22 598 L 22 618 L 42 618" stroke="#6C685F" strokeWidth="1.5" fill="none" />
          <path d="M 338 598 L 338 618 L 318 618" stroke="#6C685F" strokeWidth="1.5" fill="none" />
        </svg>
      </div>
    )
  }
];

function App() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [chatType, setChatType] = useState('detect'); // 'detect' | 'personal' | 'group'

  // Story state
  const [activeSlide, setActiveSlide] = useState(-1); // -1: Upload, 0-10: story slides
  const [slideProgress, setSlideProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [scrubMonth, setScrubMonth] = useState(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const workerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const holdStartRef = useRef(0);
  const touchStartRef = useRef(null);

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./workers/chat-parser.worker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      const { status, result, error, progress, message } = e.data;
      if (status === 'progress') {
        setLoadingProgress(progress);
        setLoadingMessage(message || 'Processing...');
      } else if (status === 'success') {
        setIsLoading(false);
        setResults(result);
        setActiveSlide(0); // Start story
        setSlideProgress(0);
        setIsPaused(false);
      } else if (status === 'error') {
        setIsLoading(false);
        setError(error || 'An error occurred during parsing');
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleNextSlide = () => {
    setActiveSlide((prev) => {
      if (prev < 20) {
        setSlideProgress(0);
        return prev + 1;
      } else {
        setIsPaused(true);
        return 20;
      }
    });
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => {
      setSlideProgress(0);
      if (prev > 0) {
        return prev - 1;
      }
      return 0;
    });
  };

  // Story playback timer
  useEffect(() => {
    if (activeSlide < 0 || activeSlide > 20 || isPaused || isExporting) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const intervalTime = 30; // Update progress every 30ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [activeSlide, isPaused, isExporting]);

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processZipFile = async (zipFile) => {
    setIsLoading(true);
    setLoadingProgress(10);
    setLoadingMessage('Reading ZIP archive...');
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(zipFile);
      setLoadingProgress(40);
      setLoadingMessage('Locating chat log...');

      // Find the main chat file (ends with .txt)
      const chatFileName = Object.keys(contents.files).find(
        (name) => name.toLowerCase().endsWith('.txt') && !name.includes('__MACOSX') && !name.startsWith('.')
      );
      if (!chatFileName) {
        throw new Error('No WhatsApp chat .txt file found inside this ZIP archive.');
      }

      setLoadingProgress(70);
      setLoadingMessage('Extracting messages...');
      const chatText = await contents.files[chatFileName].async('text');
      setLoadingProgress(95);

      const chatFile = new File([chatText], chatFileName, { type: 'text/plain' });
      processFile(chatFile);
    } catch (err) {
      setError('ZIP Error: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const name = droppedFile.name.toLowerCase();
      if (name.endsWith('.txt') || droppedFile.type === 'text/plain') {
        processFile(droppedFile);
      } else if (name.endsWith('.zip') || droppedFile.type === 'application/zip' || droppedFile.type === 'application/x-zip-compressed') {
        processZipFile(droppedFile);
      } else {
        setError('Please upload a valid .txt or .zip file exported from WhatsApp.');
      }
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const name = selectedFile.name.toLowerCase();
      if (name.endsWith('.zip') || selectedFile.type === 'application/zip' || selectedFile.type === 'application/x-zip-compressed') {
        processZipFile(selectedFile);
      } else if (name.endsWith('.txt') || selectedFile.type === 'text/plain') {
        processFile(selectedFile);
      } else {
        setError('Please upload a valid .txt or .zip file exported from WhatsApp.');
      }
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Initializing...');

    if (workerRef.current) {
      workerRef.current.postMessage({ file: selectedFile });
    }
  };

  // Story Navigation tap detector
  const handleStoryTap = (e) => {
    const holdDuration = Date.now() - holdStartRef.current;
    if (holdDuration > 250) return; // Ignore hold pauses

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.35) {
      handlePrevSlide();
    } else {
      handleNextSlide();
    }
  };

  // Hold to pause handlers
  const handlePressStart = () => {
    holdStartRef.current = Date.now();
    setIsPaused(true);
  };

  const handlePressEnd = () => {
    setIsPaused(false);
  };

  // Reset to initial state
  const handleReset = () => {
    setFile(null);
    setResults(null);
    setActiveSlide(-1);
    setSlideProgress(0);
    setIsPaused(false);
    setError(null);
  };

  // Capture slide high-res JPEG
  const handleDownloadJPEG = async () => {
    const cardElement = document.getElementById('wrapped-summary-card-export');
    if (!cardElement) return;

    try {
      setIsPaused(true);
      setIsExporting(true);
      setExportMessage('Generating high-res card...');

      await document.fonts.ready;
      await new Promise(r => setTimeout(r, 600));

      const canvas = await html2canvas(cardElement, {
        scale: 3,
        backgroundColor: '#F4F1EA',
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `whatsapp_wrapped_${file?.name.replace('.txt', '') || 'chat'}.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate image: ' + err.message);
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  // Sequential capture of all story slides to create a 21-page premium PDF report
  const handleDownloadPDF = async () => {
    try {
      setIsPaused(true);
      setIsExporting(true);
      setExportMessage('Rendering pages...');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1920]
      });

      await document.fonts.ready;

      for (let i = 0; i <= 20; i++) {
        setExportMessage(`Capturing slide ${i + 1} of 21...`);
        const slideEl = document.getElementById(`pdf-slide-export-${i}`);
        if (slideEl) {
          slideEl.style.display = 'block';
          await new Promise(r => setTimeout(r, 150));

          const canvas = await html2canvas(slideEl, {
            scale: 2,
            backgroundColor: SLIDE_STYLES[i].bg,
            useCORS: true,
            logging: false
          });

          slideEl.style.display = 'none';
          const imgData = canvas.toDataURL('image/jpeg', 0.92);

          if (i > 0) {
            pdf.addPage([1080, 1920], 'portrait');
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1920);
        }
      }

      setExportMessage('Compiling PDF...');
      pdf.save(`whatsapp_wrapped_${file?.name.replace('.txt', '') || 'report'}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF: ' + err.message);
    } finally {
      setIsExporting(false);
      setExportMessage('');
    }
  };

  // Stagger animation helpers for story slide content
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const slideFadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 75,
        damping: 16
      }
    }
  };

  // Group Mode Detection
  const isGroup = chatType === 'group' || (chatType === 'detect' && results?.sendersList?.length > 2);

  // Safely extract senders or fallback
  const senderA = results?.sendersList?.[0] || 'User A';
  const senderB = results?.sendersList?.[1] || 'User B';
  const senderC = results?.sendersList?.[2] || 'User C';

  // Message splits
  const countA = results?.senderCounts?.[senderA] || 0;
  const countB = results?.senderCounts?.[senderB] || 0;
  const totalMsgs = countA + countB || 1;
  const percentA = Math.round((countA / totalMsgs) * 100);
  const percentB = 100 - percentA;

  // Midnight splits
  const midA = results?.midnightCounts?.[senderA] || 0;
  const midB = results?.midnightCounts?.[senderB] || 0;
  const midTotal = midA + midB || 1;
  const midPercentA = Math.round((midA / midTotal) * 100);
  const midPercentB = 100 - midPercentA;

  // Initiation splits
  const initA = results?.initiations?.[senderA] || 0;
  const initB = results?.initiations?.[senderB] || 0;
  const initTotal = initA + initB || 1;
  const initPercentA = Math.round((initA / initTotal) * 100);
  const initPercentB = 100 - initPercentA;

  // Media splits
  const mediaA = results?.mediaCounts?.[senderA] || 0;
  const mediaB = results?.mediaCounts?.[senderB] || 0;
  const mediaTotal = mediaA + mediaB || 1;
  const mediaPercentA = Math.round((mediaA / mediaTotal) * 100);
  const mediaPercentB = 100 - mediaPercentA;

  const activeStyle = activeSlide >= 0
    ? SLIDE_STYLES[activeSlide]
    : { bg: '#050505', text: '#FFFFFF', secondaryText: '#999999', accent: '#0066FF', shapes: null };

  if (activeSlide === -1 && !isLoading) {
    return (
      <div className="font-body-md text-on-surface bg-background min-h-screen selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative flex flex-col justify-between">
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-container/20 confetti-glow animate-pulse"></div>
          <div className="absolute bottom-[-5%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-tertiary-container/20 confetti-glow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[30%] left-[20%] w-[10vw] h-[10vw] rounded-full bg-secondary-container/10 confetti-glow"></div>
        </div>

        {/* TopNavBar */}
        <header className="bg-surface/70 backdrop-blur-xl sticky top-0 z-50 shadow-none border-b border-outline-variant/10">
          <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto py-unit">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
              <span className="font-display-lg text-headline-md italic text-on-surface">WhatsApp</span>
              <span className="font-label-bold text-label-bold text-on-surface-variant tracking-widest opacity-60 uppercase">WRAPPED</span>
            </div>
            <nav className="hidden md:flex gap-gutter items-center">
              <button
                onClick={() => document.getElementById('uploader-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                How it Works
              </button>
              <button
                onClick={() => document.getElementById('privacy-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer bg-transparent border-none"
              >
                Security
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span className="hidden sm:inline font-label-bold text-xs tracking-wider uppercase">SECURE & PRIVATE</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex-grow">
          {/* Hero Section */}
          <section className="min-h-[500px] flex flex-col items-center justify-center px-margin-mobile text-center pt-16 pb-12">
            <div className="max-w-3xl space-y-gutter">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary-container/20 text-on-primary-container font-label-bold text-xs tracking-wide mb-4 animate-bounce">
                ✨ Your 2026 Digital Digest is Ready
              </div>
              <h1 className="font-display-lg text-headline-lg md:text-[84px] leading-tight text-on-surface">
                Your Year in <br />
                <span className="italic font-serif text-primary">Conversations</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mt-6">
                Discover your chat roasts, conversational dynamics, and key metrics. 100% private in-browser analysis. No data ever leaves your device.
              </p>

              {/* Toggle Control */}
              <div className="flex justify-center mt-12">
                <div className="bg-surface-container-high p-1 rounded-full flex gap-1 items-center shadow-inner">
                  <button
                    onClick={(e) => { e.stopPropagation(); setChatType('detect'); }}
                    className={`px-6 py-2 rounded-full font-label-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      chatType === 'detect'
                        ? 'bg-primary text-on-primary shadow-lg scale-105 font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    AUTO-DETECT
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setChatType('personal'); }}
                    className={`px-6 py-2 rounded-full font-label-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      chatType === 'personal'
                        ? 'bg-primary text-on-primary shadow-lg scale-105 font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    PERSONAL CHAT
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setChatType('group'); }}
                    className={`px-6 py-2 rounded-full font-label-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                      chatType === 'group'
                        ? 'bg-primary text-on-primary shadow-lg scale-105 font-bold'
                        : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                  >
                    GROUP CHAT
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Uploader Section */}
          <section id="uploader-section" className="max-w-container-max mx-auto px-margin-mobile pb-24">
            <div className="relative group">
              {/* Decorative accents for the box */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-xl opacity-40"></div>
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-secondary rounded-br-xl opacity-40"></div>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input')?.click()}
                className={`bg-surface-container-lowest border-2 border-dashed rounded-[32px] p-12 md:p-20 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer group-hover:bg-primary-container/5 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/5 ${
                  isDragging ? 'border-primary bg-primary-container/10' : 'border-outline-variant hover:border-primary'
                }`}
                id="drop-zone"
              >
                <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="material-symbols-outlined text-primary text-[40px]">upload</span>
                </div>
                <h2 className="font-headline-md text-2xl md:text-3xl mb-2 text-on-surface font-semibold text-center">Drag and drop your exported chat here</h2>
                <p className="font-body-md text-sm md:text-base text-on-surface-variant mb-8 text-center max-w-md">
                  Supports .txt or .zip formats (Exports with or without media)
                </p>

                <div className="cursor-pointer group/btn" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                    className="px-10 py-4 rounded-full bg-on-surface font-label-bold text-sm tracking-wide flex items-center gap-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl hover:bg-primary cursor-pointer !text-white"
                  >
                    <span className="material-symbols-outlined">folder_open</span>
                    BROWSE FILE
                  </button>
                  <input
                    id="file-upload-input"
                    type="file"
                    accept=".txt,.zip"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-6 text-red-600 text-xs tracking-wider font-mono flex items-center gap-2 border px-4 py-2.5 rounded-lg animate-pulse bg-red-50 border-red-200"
                  >
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Instructions / Guide */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-bold font-semibold text-on-surface">1</div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Open WhatsApp Chat</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-bold font-semibold text-on-surface">2</div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Export Chat (Settings &gt; Export)</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-bold font-semibold text-on-surface">3</div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Drop the .zip/.txt here</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section id="privacy-section" className="bg-surface-container-low py-20">
            <div className="max-w-container-max mx-auto px-margin-mobile text-center">
              <div className="inline-flex items-center gap-2 mb-6 text-primary">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <h3 className="font-label-bold text-xs uppercase tracking-widest font-semibold">Privacy Promise</h3>
              </div>
              <h2 className="font-headline-md text-2xl md:text-4xl mb-6 max-w-2xl mx-auto text-on-surface font-bold leading-tight">Your chat data stays strictly on your computer.</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-12">
                <div className="p-8 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 text-left">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 flex items-center justify-center mb-4 text-tertiary">
                    <span className="material-symbols-outlined">memory</span>
                  </div>
                  <h4 className="font-semibold text-on-surface mb-2">Local Analysis</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Your browser does all the heavy lifting using Web Workers. No servers are involved in reading your messages.</p>
                </div>
                <div className="p-8 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 text-left">
                  <div className="w-12 h-12 rounded-xl bg-primary-container/30 flex items-center justify-center mb-4 text-primary">
                    <span className="material-symbols-outlined">cloud_off</span>
                  </div>
                  <h4 className="font-semibold text-on-surface mb-2">Zero Uploads</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">We don't have a database. We don't have a backend storage. Your files are never sent over the internet.</p>
                </div>
                <div className="p-8 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 text-left">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center mb-4 text-secondary">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <h4 className="font-semibold text-on-surface mb-2">Open Standard</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">The processing logic is transparent and focused on privacy, ensuring only meaningful metrics are extracted.</p>
                </div>
              </div>

              <p className="mt-12 text-on-surface-variant text-sm max-w-xl mx-auto leading-relaxed opacity-70">
                Your chat export is parsed completely inside your browser using local Web Workers. We never upload or store your private messages.
              </p>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-surface-container-lowest border-t border-outline-variant">
          <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-gutter py-12 max-w-container-max mx-auto gap-gutter">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-xl md:text-2xl text-on-surface font-semibold">WhatsApp</span>
                <span className="font-label-bold text-xs text-on-surface-variant opacity-50 uppercase tracking-widest">Wrapped</span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant opacity-60">© 2026 WhatsApp Wrapped. Not affiliated with Meta or WhatsApp.</p>
              
              {/* Signature */}
              <div className="text-xs text-neutral-500 font-sans mt-1">
                Made with <span className="text-red-500 inline-block animate-pulse">♥</span> by <a href="https://www.mohishpadave.com" target="_blank" rel="noopener noreferrer" className="text-neutral-700 font-medium hover:text-primary transition-colors underline decoration-neutral-400 hover:decoration-primary underline-offset-4">Mohish Padave</a>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-gutter text-xs font-semibold">
              <button onClick={() => setShowPrivacy(true)} className="text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100 cursor-pointer bg-transparent border-none font-semibold text-xs">Privacy Policy</button>
              <button onClick={() => setShowTerms(true)} className="text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100 cursor-pointer bg-transparent border-none font-semibold text-xs">Terms of Service</button>
              <a className="text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100" href="https://github.com/MohishPadave/WhatsaApp-Analyzer/blob/main/README.md" target="_blank" rel="noopener noreferrer">Github</a>
              <a className="text-on-surface-variant hover:text-secondary transition-all opacity-80 hover:opacity-100" href="#">Contact</a>
            </div>
          </div>
        </footer>

        {/* Terms of Service Modal */}
        {showTerms && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowTerms(false)}>
            <div
              className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 md:p-12 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowTerms(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer border-none"
                aria-label="Close Terms of Service"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface mb-2">Terms of Service</h2>
                  <p className="text-on-surface-variant text-sm">Last updated: May 2026</p>
                </div>

                <div className="space-y-8 text-on-surface-variant text-sm leading-relaxed">
                  {/* Section 1 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">1</span>
                      Acceptance of Terms
                    </h3>
                    <p>By accessing or using the WhatsApp Retrospective Analyzer (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to all provisions within this contract, you are expressly prohibited from using the Service.</p>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">2</span>
                      Complete Detachment & Non-Affiliation Disclaimer
                    </h3>
                    <div className="space-y-2">
                      <p><strong className="text-on-surface">Independent Project:</strong> This Service is an entirely independent, open-source developer project.</p>
                      <p><strong className="text-on-surface">No Affiliation with Meta or WhatsApp:</strong> The Service is NOT affiliated, associated, authorized, endorsed by, sponsored by, or in any way officially connected with WhatsApp Inc., Meta Platforms Inc., or any of their subsidiaries, parent companies, or corporate affiliates.</p>
                      <p><strong className="text-on-surface">Trademarks:</strong> The name &ldquo;WhatsApp&rdquo; as well as related names, marks, emblems, and images are registered trademarks of their respective owners. Use of these terms on this website is strictly for nominative, descriptive, and educational purposes to indicate compatibility with file export formats.</p>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">3</span>
                      User Representation, Warranties, and Permitted Use
                    </h3>
                    <p>By uploading any file into this Service, you explicitly represent and warrant that:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>You are the legal owner of, or have obtained explicit, unambiguous, and lawful consent from all participating parties within the chat log to process the data.</li>
                      <li>You will not use this Service for malicious spying, unauthorized surveillance, data scraping, or breaching the privacy of any individual without their explicit consent.</li>
                      <li>You assume 100% of all legal, ethical, and civil liabilities arising from the processing or sharing of the generated metrics on public social media channels.</li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">4</span>
                      Limitation of Liability & &ldquo;As Is&rdquo; Warranty
                    </h3>
                    <div className="space-y-2">
                      <p><strong className="text-on-surface">No Warranty:</strong> The Service is provided entirely on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis, without warranties of any kind, either express or implied, including but not limited to fitness for a particular purpose, accuracy of parsing algorithms, or error-free rendering.</p>
                      <p><strong className="text-on-surface">Liability Cap:</strong> To the maximum extent permitted by applicable law, in no event shall the creator, contributors, developers, or hosting platforms (including but not limited to Vercel Inc.) be liable for any direct, indirect, incidental, special, exemplary, punitive, or consequential damages. This includes, but is not limited to, browser crashes, system lag, file corruption, emotional distress, relationship disputes, or legal actions resulting from the data patterns uncovered by the application.</p>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">5</span>
                      Intellectual Property & Open Source
                    </h3>
                    <p>The core application software is open-source and governed by the MIT License. You are free to audit, clone, or modify the code according to the parameters defined in the repository license file, provided that the original copyright notice and liability limitations remain intact.</p>
                  </div>

                  {/* Section 6 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">6</span>
                      Governing Law
                    </h3>
                    <p>Any claims, disputes, or legal proceedings arising out of or related to the use of this Service shall be governed by and construed in accordance with the local laws of the developer&rsquo;s jurisdiction, without regard to conflict of law principles.</p>
                  </div>
                </div>

                {/* Accept button */}
                <div className="pt-4 border-t border-outline-variant/30">
                  <button
                    onClick={() => setShowTerms(false)}
                    className="px-8 py-3 rounded-full bg-primary text-on-primary font-label-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg cursor-pointer border-none"
                  >
                    I UNDERSTAND
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {showPrivacy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowPrivacy(false)}>
            <div
              className="bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-8 md:p-12 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPrivacy(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all cursor-pointer border-none"
                aria-label="Close Privacy Policy"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface mb-2">Privacy Policy</h2>
                  <p className="text-on-surface-variant text-sm">Last updated: May 2026</p>
                </div>

                <div className="space-y-8 text-on-surface-variant text-sm leading-relaxed">
                  {/* Section 1 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">1</span>
                      Our Absolute Commitment to Privacy
                    </h3>
                    <p>This Privacy Policy governs the WhatsApp Analyzer application (the &ldquo;Service&rdquo;). Because we believe that personal conversations are sacred, this application has been explicitly engineered with a zero-data collection architecture. Your trust is our highest priority, and we ensure transparency by processing everything directly on your machine.</p>
                  </div>

                  {/* Section 2 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">2</span>
                      Zero Server-Side Data Processing
                    </h3>
                    <div className="space-y-2">
                      <p><strong className="text-on-surface">No Server Infrastructure:</strong> The Service operates entirely within your local web browser sandbox. There are no backend servers, external databases, or remote logging APIs attached to this application.</p>
                      <p><strong className="text-on-surface">Local Web Workers:</strong> When you upload a WhatsApp chat log (.txt) or archive (.zip), the parsing, regex matching, metric calculations, and visualization compilation are executed entirely inside an isolated browser thread (Web Worker) on your local hardware.</p>
                      <p><strong className="text-on-surface">Network Isolation Capability:</strong> Once the static website assets (HTML, CSS, JavaScript) are loaded in your browser, you can completely disconnect your device from the internet (cellular, Wi-Fi, or local network), and the Service will continue to function flawlessly.</p>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">3</span>
                      Data Collected, Stored, or Transferred
                    </h3>
                    <div className="space-y-2">
                      <p><strong className="text-on-surface">Personal Data:</strong> We collect zero (0) personal data, chat transcripts, metadata, names, contact numbers, or timestamps.</p>
                      <p><strong className="text-on-surface">Cookies & Tracking:</strong> This website does not use cookies, tracking pixels, or third-party marketing trackers (e.g., Meta Pixel, Google Analytics).</p>
                      <p><strong className="text-on-surface">Local Storage (localStorage):</strong> The application may use browser-level localStorage strictly to maintain transient UI state configurations (such as dark mode preferences) across page reloads. No chat details are ever written to persistent local storage.</p>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">4</span>
                      Third-Party Libraries & Dependencies
                    </h3>
                    <p>The Service utilizes trusted, client-side open-source libraries (JSZip, html2canvas, jsPDF, Framer Motion) to generate interactive animations and export downloadable graphics. All operations performed by these libraries are structurally locked inside your browser client and do not transmit data to third-party endpoints.</p>
                  </div>

                  {/* Section 5 */}
                  <div className="space-y-3">
                    <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-primary-container/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">5</span>
                      Changes to This Privacy Policy
                    </h3>
                    <p>We reserve the right to modify this Privacy Policy at any time. Any changes will be made apparent by updating the &ldquo;Last Updated&rdquo; date at the top of this document.</p>
                  </div>
                </div>

                {/* Accept button */}
                <div className="pt-4 border-t border-outline-variant/30">
                  <button
                    onClick={() => setShowPrivacy(false)}
                    className="px-8 py-3 rounded-full bg-primary text-on-primary font-label-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg cursor-pointer border-none"
                  >
                    I UNDERSTAND
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-luxury-white flex flex-col items-center justify-between p-4 selection:bg-neutral-800 selection:text-neutral-200 relative overflow-hidden">

      {/* Ambient glows in background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] pointer-events-none rounded-full blur-[100px] z-0" style={{ background: 'radial-gradient(circle, rgba(38,38,38,0.1) 0%, rgba(5,5,5,0) 70%)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] pointer-events-none rounded-full blur-[80px] z-0" style={{ background: 'radial-gradient(circle, rgba(10,10,10,0.8) 0%, rgba(5,5,5,0) 70%)' }} />

      {/* Main Header */}
      <header className="w-full max-w-5xl flex items-center justify-between py-6 z-10">
        <div className="flex items-center gap-2" onClick={handleReset} style={{ cursor: 'pointer' }}>
          <span className="font-serif italic text-2xl font-light tracking-wide text-neutral-100">
            WhatsApp <span className="text-neutral-500 font-sans text-xs uppercase tracking-[0.25em] ml-1 not-italic">Wrapped</span>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-neutral-500 font-mono tracking-widest">
          <span className="hidden sm:inline">SECURE & PRIVATE</span>
          <ShieldCheck className="w-4 h-4 text-neutral-500" />
        </div>
      </header>

      {/* Content Area */}
      <main className="w-full flex-grow flex items-center justify-center z-10 py-6">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(30, 30, 30, 0.5)"
                  strokeWidth="2"
                  fill="transparent"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="transparent"
                  className="text-neutral-300"
                  strokeDasharray={176}
                  strokeDashoffset={176 - (176 * loadingProgress) / 100}
                  transition={{ ease: "easeInOut" }}
                />
              </svg>
              <span className="absolute font-mono text-[10px] text-neutral-400">{loadingProgress}%</span>
            </div>
            <div className="space-y-1">
              <h2 className="font-serif italic text-lg text-neutral-200">{loadingMessage}</h2>
              <p className="text-xs text-neutral-500 tracking-widest uppercase">Processing local file</p>
            </div>
          </motion.div>
        )}

        {/* State 3: Stories Slides */}
        {activeSlide >= 0 && results && (
          <div className="relative flex flex-col items-center gap-6 w-full max-w-lg">

            {/* Slide Window */}
            <div
              className="relative w-full max-w-[430px] max-h-[75vh] xs:max-h-[80vh] sm:max-h-[82vh] md:max-h-[85vh] aspect-[9/16] border rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 select-none touch-none transition-colors duration-500"
              style={{ backgroundColor: activeStyle.bg, borderColor: 'rgba(0, 0, 0, 0.06)' }}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onTouchStart={(e) => {
                handlePressStart();
                const touch = e.touches[0];
                touchStartRef.current = { x: touch.clientX, y: touch.clientY };
              }}
              onTouchEnd={(e) => {
                handlePressEnd();
                if (!touchStartRef.current) return;
                const touch = e.changedTouches[0];
                const diffX = touch.clientX - touchStartRef.current.x;
                const diffY = touch.clientY - touchStartRef.current.y;

                if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = touch.clientX - rect.left;
                  const width = rect.width;
                  if (x < width * 0.35) {
                    handlePrevSlide();
                  } else {
                    handleNextSlide();
                  }
                }
                touchStartRef.current = null;
              }}
              onClick={handleStoryTap}
            >
              {/* Background abstract shapes */}
              {activeStyle.shapes}

              {/* LinkedIn Style Stories Header */}
              <div className="flex justify-between items-center w-full z-20 pointer-events-none mb-2 pt-1">
                <div className="flex items-center gap-2">
                  {/* WhatsApp Custom Bubble Logo */}
                  <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm5.835-3.332c1.629.967 3.23 1.488 4.793 1.489 5.517 0 10.005-4.486 10.008-10.006.002-2.673-1.038-5.187-2.931-7.082C15.823 3.16 13.315 2.12 10.64 2.12 5.125 2.12.637 6.606.635 12.127c-.001 1.621.43 3.206 1.251 4.607L.947 20.898l4.945-1.23z" />
                  </svg>
                  <span className="text-[10px] font-sans font-bold tracking-[0.1em] uppercase" style={{ color: activeStyle.text, opacity: 0.8 }}>
                    Wrapped • Year in Review
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 active:scale-90 transition-all cursor-pointer pointer-events-auto z-30"
                  style={{ color: activeStyle.text }}
                  aria-label="Close stories"
                >
                  <span className="text-sm font-light">✕</span>
                </button>
              </div>

              <div className="flex gap-1 w-full z-20 pointer-events-none mb-3">
                {Array.from({ length: 21 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-[3px] flex-grow rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }}
                  >
                    <div
                      className="h-full transition-all duration-75"
                      style={{
                        backgroundColor: activeStyle.text,
                        width:
                          idx < activeSlide
                            ? '100%'
                            : idx === activeSlide
                              ? `${slideProgress}%`
                              : '0%'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Render Slide Content */}
              <div className="flex-grow flex flex-col justify-between py-2 relative z-10 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-grow flex flex-col justify-between h-full"
                  >
                    {/* Slide 0: Cover */}
                    {activeSlide === 0 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-4">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            {isGroup ? "Here is your year in review with your group." : "Here is your year in review with your favorite person."}
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-6xl sm:text-8xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              2026
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              Wrapped • Year in Review
                            </p>
                          </div>
                        </motion.div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Unpack the reply logs, dialogue volumes, and habits that defined your {isGroup ? 'group chat' : 'chat thread'} this year.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 1: Volume & Longevity */}
                    {activeSlide === 1 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            {isGroup ? "You all connected more than ever before. Every conversation, counted." : "You connected more than ever before. Every conversation, counted."}
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.totalMessages.toLocaleString()}
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              messages exchanged
                            </p>
                          </div>
                        </motion.div>

                        {isGroup ? (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5 z-20 my-auto w-full"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>TOP CONTRIBUTORS</span>
                              <span className="text-[#0066FF] font-bold">{results.sendersList.length} members</span>
                            </div>

                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender, idx) => {
                                const count = results.senderCounts[sender] || 0;
                                const pct = Math.round((count / results.totalMessages) * 100);
                                const barColors = ['bg-[#0066FF]', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                                return (
                                  <div key={sender} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{idx + 1}. {sender}</span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${barColors[idx] || 'bg-neutral-400'} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3 z-20 my-auto"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>MESSAGE SHARE</span>
                              <span className="text-[#0066FF] font-extrabold">{percentA}% vs {percentB}%</span>
                            </div>

                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-[#0066FF] transition-all" style={{ width: `${percentA}%` }} />
                              <div className="h-full bg-[#E95D3C] transition-all" style={{ width: `${percentB}%` }} />
                            </div>

                            <div className="flex justify-between text-xs font-sans">
                              <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderA}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{countA.toLocaleString()} texts</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderB}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{countB.toLocaleString()} texts</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Exchanged over <span className="font-semibold text-neutral-800">{results.longevityDays} days</span> of chatting. That's a total word count of <span className="font-semibold text-neutral-800">{results.totalWordCount.toLocaleString()}</span> words!
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 2: Peak Traffic */}
                    {activeSlide === 2 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Your weekly peak traffic hour when the chat really came alive.
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-6xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.peakTraffic.day}s
                            </h2>
                            <h2 className="font-sans text-5xl font-extrabold tracking-tighter leading-none" style={{ color: activeStyle.accent }}>
                              at {results.peakTraffic.hour}
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              peak connection window
                            </p>
                          </div>
                        </motion.div>

                        {/* Weekly Rhythm Grid */}
                        <motion.div
                          variants={slideFadeUp}
                          className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-4 z-20 my-auto"
                        >
                          <div className="text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            WEEKLY RHYTHM
                          </div>

                          <div className="flex justify-between items-center px-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
                              const isActiveDay = results?.peakTraffic?.day?.startsWith(d);
                              return (
                                <div key={d} className="flex flex-col items-center gap-1">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${isActiveDay
                                        ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20 scale-110 ring-2 ring-white/50 animate-pulse'
                                        : 'bg-neutral-100 text-neutral-400'
                                      }`}
                                  >
                                    {d[0]}
                                  </div>
                                  <span className={`text-[8px] font-mono font-bold uppercase ${isActiveDay ? 'text-blue-600 font-extrabold' : 'text-neutral-500'}`}>{d}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex items-center gap-3 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100/60">
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-lg shadow-inner">
                              ⏰
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-neutral-800">Peak Hour: {results?.peakTraffic?.hour}</span>
                              <span className="text-[10px] text-neutral-500 font-medium">When your chat bursts into life</span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          {results.peakTraffic.text}
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 3: Speed & The Yapper */}
                    {activeSlide === 3 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            You amplified others' ideas, but someone usually took the stage.
                          </p>
                        </motion.div>

                        <div className="relative w-full h-[280px] my-auto">
                          {/* Decorative black bubble (behind) */}
                          <div className="w-[110px] h-[85px] bg-[#1C1A17]/8 border border-[#1C1A17]/10 rounded-[24px] absolute right-6 bottom-16 shadow-sm transform rotate-[-6deg]" />

                          {/* Decorative blue bubble (behind) */}
                          <div className="w-[125px] h-[95px] bg-[#0066FF]/10 border border-[#0066FF]/15 rounded-[28px] absolute left-6 bottom-4 shadow-sm transform rotate-[4deg]" />

                          {/* Green bubble (top right) */}
                          <motion.div
                            variants={slideFadeUp}
                            className="absolute right-2 top-0 w-[140px] h-[105px] bg-[#224535] text-white rounded-[30px] p-3 flex flex-col justify-center items-center shadow-xl border border-white/5 z-20"
                          >
                            <span className="font-sans text-3xl font-extrabold tracking-tight">
                              {(results.doubleTexter[senderA] || 1.0).toFixed(1)} vs {(results.doubleTexter[senderB] || 1.0).toFixed(1)}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-mono opacity-80 text-center leading-tight mt-1">
                              avg texts/turn
                            </span>
                          </motion.div>

                          {/* Orange bubble (mid left) */}
                          <motion.div
                            variants={slideFadeUp}
                            className="absolute left-2 top-10 w-[145px] h-[110px] bg-[#E95D3C] text-white rounded-[32px] p-3 flex flex-col justify-center items-center shadow-xl border border-white/5 z-20"
                          >
                            <span className="font-sans text-4xl font-extrabold tracking-tight">
                              {results.yapper.count}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-mono opacity-80 text-center leading-tight mt-1 font-bold">
                              consecutive messages
                            </span>
                            <span className="text-[8px] uppercase tracking-widest font-sans opacity-70 text-center truncate w-full mt-0.5">
                              by {results.yapper.name}
                            </span>
                          </motion.div>
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          "{results.yapper.name} once went on a monologue rampage of {results.yapper.count} messages in a row!"
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 4: Response Timings (The Ghoster) */}
                    {activeSlide === 4 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Beyond a quick reply, your longest wait was...
                          </p>
                        </motion.div>

                        {results.theGhoster ? (
                          <div className="my-auto space-y-4 w-full">
                            {/* Central White Card representing Card 3 layout */}
                            <motion.div
                              variants={slideFadeUp}
                              className="bg-white rounded-[24px] p-5 shadow-xl border border-neutral-100 flex flex-col items-center justify-center gap-1.5 relative z-20 w-[240px] mx-auto"
                            >
                              {/* Large heart SVG */}
                              <svg className="w-8 h-8 text-[#E95D3C]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>

                              <h4 className="font-sans text-2xl font-extrabold tracking-tight text-neutral-900 leading-none text-center">
                                {formatDuration(results.theGhoster.gapMs)}
                              </h4>
                              <p className="text-[10px] text-neutral-500 font-sans font-bold uppercase tracking-wider text-center">
                                reply gap by {results.theGhoster.senderB}
                              </p>
                            </motion.div>

                            {/* Conversation Snippet */}
                            <motion.div
                              variants={slideFadeUp}
                              className="border-l-2 pl-3 py-1 space-y-2 rounded-r-xl bg-white/70 shadow-sm border-[#E95D3C] max-w-[290px] mx-auto w-full"
                            >
                              <div className="space-y-0.5">
                                <p className="text-[9px] uppercase tracking-wider font-mono text-neutral-500">
                                  {results.theGhoster.senderA} • {results.theGhoster.timestampA}
                                </p>
                                <p className="text-[10px] italic font-serif leading-tight text-neutral-800 line-clamp-1">
                                  "{results.theGhoster.messageA}"
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-[9px] uppercase tracking-wider font-mono font-semibold text-[#E95D3C]">
                                  {results.theGhoster.senderB} replied • {results.theGhoster.timestampB}
                                </p>
                                <p className="text-[10px] font-serif leading-tight text-neutral-800 line-clamp-1">
                                  "{results.theGhoster.messageB}"
                                </p>
                              </div>
                            </motion.div>
                          </div>
                        ) : (
                          <div className="my-auto text-center">
                            <motion.p
                              variants={slideFadeUp}
                              className="text-sm font-light italic"
                              style={{ color: activeStyle.secondaryText }}
                            >
                              No reply delays recorded. Perfect real-time connection.
                            </motion.p>
                          </div>
                        )}

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          It takes patience to build a connection. Or maybe they were just busy!
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 5: Speed Racer vs Snail */}
                    {activeSlide === 5 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            {isGroup ? "Who responds at lightning speed and who takes their sweet time?" : "The Response Hierarchy: Who is the Speed Racer and who is the Snail?"}
                          </p>
                        </motion.div>

                        <div className="my-auto space-y-4 w-full z-20">
                          {isGroup ? (
                            <motion.div
                              variants={slideFadeUp}
                              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3"
                            >
                              <span className="text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">MEDIAN RESPONSE TIMES</span>
                              <div className="space-y-3">
                                {results.sendersList.slice(0, 3).map((sender) => {
                                  const time = results.medianResponseTimes[sender] || 0;
                                  return (
                                    <div key={sender} className="flex justify-between items-center text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{sender}</span>
                                      <span className="font-mono text-blue-600 font-bold">
                                        {time > 0 ? formatDuration(time * 1000) : "N/A"}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          ) : (
                            <div className="space-y-4">
                              <motion.div
                                variants={slideFadeUp}
                                className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm flex flex-col gap-2"
                              >
                                <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                                  <span>RESPONSE TIMES</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2 border-neutral-100">
                                  <span className="font-sans font-semibold text-neutral-800">{senderA}</span>
                                  <span className="font-mono text-xs font-bold text-neutral-600">
                                    {results.medianResponseTimes[senderA] ? formatDuration(results.medianResponseTimes[senderA] * 1000) : 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="font-sans font-semibold text-neutral-800">{senderB}</span>
                                  <span className="font-mono text-xs font-bold text-neutral-600">
                                    {results.medianResponseTimes[senderB] ? formatDuration(results.medianResponseTimes[senderB] * 1000) : 'N/A'}
                                  </span>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          {!isGroup && results.medianResponseTimes[senderA] && results.medianResponseTimes[senderB] ? (
                            results.medianResponseTimes[senderA] < results.medianResponseTimes[senderB]
                              ? `The response hierarchy is clear: ${senderA} replies in a median time of ${formatDuration(results.medianResponseTimes[senderA] * 1000)}, while ${senderB} takes ${formatDuration(results.medianResponseTimes[senderB] * 1000)}.`
                              : `The response hierarchy is clear: ${senderB} replies in a median time of ${formatDuration(results.medianResponseTimes[senderB] * 1000)}, while ${senderA} takes ${formatDuration(results.medianResponseTimes[senderA] * 1000)}.`
                          ) : "Calculated during active hours (9 AM - 10 PM) for messages that received a response."}
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 6: Notification Bomber */}
                    {activeSlide === 6 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            {isGroup ? "Who causes your lock screen to explode with rapid-fire messages?" : "The Notification Bomber: Who triggers the most lock screen cascades?"}
                          </p>
                        </motion.div>

                        <div className="my-auto space-y-3.5 w-full z-20 max-w-[280px] mx-auto">
                          {results.sendersList.slice(0, 3).map((sender) => {
                            const count = results.notificationBombs[sender] || 0;
                            return (
                              <motion.div
                                key={sender}
                                variants={slideFadeUp}
                                className="bg-white/90 backdrop-blur-md border border-neutral-100 shadow-md rounded-xl p-3 flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">🚨</span>
                                  <div>
                                    <h4 className="text-xs font-bold text-neutral-800 truncate max-w-[120px]">{sender}</h4>
                                    <p className="text-[9px] text-neutral-500">Lock-screen cascades</p>
                                  </div>
                                </div>
                                <span className="font-mono text-xs font-bold text-orange-600">{count} cascades</span>
                              </motion.div>
                            );
                          })}
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Triggered when a user sends 5 or more rapid-fire messages within a 60-second window before getting a response.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 7: Midnight Philosopher */}
                    {activeSlide === 7 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            When the rest of the world went quiet, your chat kept going.
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.totalMidnightMessages.toLocaleString()}
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              midnight messages exchanged
                            </p>
                          </div>
                        </motion.div>

                        {isGroup ? (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5 z-20 my-auto w-full"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>MIDNIGHT CHATS SPLIT</span>
                              <span className="text-indigo-600 font-bold">{results.totalMidnightMessages.toLocaleString()} texts</span>
                            </div>

                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender, idx) => {
                                const count = results.midnightCounts[sender] || 0;
                                const pct = results.totalMidnightMessages > 0 ? Math.round((count / results.totalMidnightMessages) * 100) : 0;
                                const barColors = ['bg-indigo-600', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                                return (
                                  <div key={sender} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{idx + 1}. {sender}</span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${barColors[idx] || 'bg-neutral-400'} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3 z-20 my-auto"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>MIDNIGHT CHATS SPLIT</span>
                              <span className="text-indigo-655 font-extrabold">{midPercentA}% vs {midPercentB}%</span>
                            </div>

                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-indigo-600 transition-all" style={{ width: `${midPercentA}%` }} />
                              <div className="h-full bg-[#E95D3C] transition-all" style={{ width: `${midPercentB}%` }} />
                            </div>

                            <div className="flex justify-between text-xs font-sans">
                              <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderA}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{midA.toLocaleString()} texts</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderB}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{midB.toLocaleString()} texts</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Sent between 12 AM and 4 AM this year. Chief Sleep Evader: <span className="font-semibold text-neutral-800">{results.topMidnightPhilosopher?.name || 'N/A'}</span> (sent {results.topMidnightPhilosopher?.count.toLocaleString() || 0} messages).
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 8: The Initiator */}
                    {activeSlide === 8 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Starting a conversation after a block of silence takes initiative.
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.topInitiator?.count || 0}
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              conversations started by {results.topInitiator?.name || 'N/A'}
                            </p>
                          </div>
                        </motion.div>

                        {isGroup ? (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5 z-20 my-auto w-full"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>CONVERSATION STARTERS</span>
                              <span className="text-emerald-600 font-bold">{(Object.values(results.initiations).reduce((a, b) => a + b, 0) || 0).toLocaleString()} starts</span>
                            </div>

                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender, idx) => {
                                const count = results.initiations[sender] || 0;
                                const totalInits = Object.values(results.initiations).reduce((a, b) => a + b, 0) || 1;
                                const pct = Math.round((count / totalInits) * 100);
                                const barColors = ['bg-emerald-600', 'bg-[#E95D3C]', 'bg-[#0066FF]'];

                                return (
                                  <div key={sender} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{idx + 1}. {sender}</span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${barColors[idx] || 'bg-neutral-400'} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/85 backdrop-blur-md border border-white/50 rounded-2xl p-4 shadow-sm space-y-3 z-20 my-auto"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>CONVERSATION STARTERS</span>
                              <span className="text-emerald-600 font-extrabold">{initPercentA}% vs {initPercentB}%</span>
                            </div>

                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-emerald-600 transition-all" style={{ width: `${initPercentA}%` }} />
                              <div className="h-full bg-[#E95D3C] transition-all" style={{ width: `${initPercentB}%` }} />
                            </div>

                            <div className="flex justify-between text-xs font-sans">
                              <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderA}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{initA.toLocaleString()} times</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderB}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{initB.toLocaleString()} times</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8 z-20 relative"
                        >
                          Conversations are initiated after a block of silence lasting more than 8 hours.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 9: Chat CPR Award */}
                    {activeSlide === 9 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            The Chat CPR Award: Who resuscitated the conversation when it was completely dead?
                          </p>
                        </motion.div>

                        <div className="my-auto space-y-4 w-full z-20">
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3"
                          >
                            <span className="text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">CPRS PERFORMED (24H+ SILENCE)</span>
                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender) => {
                                const count = results.resuscitationCounts[sender] || 0;
                                return (
                                  <div key={sender} className="flex justify-between items-center text-xs font-semibold text-neutral-800">
                                    <span className="truncate max-w-[150px]">{sender}</span>
                                    <span className="font-mono text-emerald-600 font-bold">{count} resuscitations</span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Awarded to whoever sent the very next message to bring the chat back to life after 24+ hours of silence.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 10: Dry Spell Milestone */}
                    {activeSlide === 10 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            The Great Silence: What was your longest dry spell this year?
                          </p>
                          {results.drySpell ? (
                            <div className="space-y-0">
                              <h2 className="font-sans text-6xl font-extrabold tracking-tighter leading-none text-neutral-900">
                                {results.drySpell.days} Days
                              </h2>
                              <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                                of absolute silence
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs font-mono text-neutral-500">No silence periods detected.</p>
                          )}
                        </motion.div>

                        {results.drySpell && (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm z-20 my-auto text-center"
                          >
                            <span className="text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase block mb-1">LONG TIME NO CHAT</span>
                            <span className="font-sans font-bold text-neutral-800 text-sm">
                              {results.drySpell.startDate} — {results.drySpell.endDate}
                            </span>
                            <p className="text-[10px] text-neutral-500 mt-2 font-serif italic">
                              "You two literally forgot each other existed."
                            </p>
                          </motion.div>
                        )}

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Your longest consecutive gap of absolute silence. No texts, no memes, no voice notes. Just pure peace.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 11: The Media Mogul */}
                    {activeSlide === 11 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            A picture is worth a thousand words, and your gallery proves it.
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.topMediaMogul?.count || 0}
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              media files shared by {results.topMediaMogul?.name || 'N/A'}
                            </p>
                          </div>
                        </motion.div>

                        {isGroup ? (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5 z-20 my-auto w-full"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>GALLERY SPLIT</span>
                              <span className="text-[#0066FF] font-bold">{results.topMediaMogul?.count || 0} files</span>
                            </div>

                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender, idx) => {
                                const count = results.mediaCounts[sender] || 0;
                                const totalMedia = Object.values(results.mediaCounts).reduce((a, b) => a + b, 0) || 1;
                                const pct = Math.round((count / totalMedia) * 100);
                                const barColors = ['bg-[#0066FF]', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                                return (
                                  <div key={sender} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{idx + 1}. {sender}</span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${barColors[idx] || 'bg-neutral-400'} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3 z-20 my-auto"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>GALLERY SPLIT</span>
                              <span className="text-[#0066FF] font-extrabold">{mediaPercentA}% vs {mediaPercentB}%</span>
                            </div>

                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-[#0066FF] transition-all" style={{ width: `${mediaPercentA}%` }} />
                              <div className="h-full bg-[#E95D3C] transition-all" style={{ width: `${mediaPercentB}%` }} />
                            </div>

                            <div className="flex justify-between text-xs font-sans">
                              <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderA}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{mediaA.toLocaleString()} files</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderB}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{mediaB.toLocaleString()} files</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {(results.totalStickers > 0 || results.totalGifs > 0) ? (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-3 shadow-sm grid grid-cols-2 gap-3 z-20 w-full mb-8"
                          >
                            <div className="flex flex-col justify-between p-2 rounded-xl bg-neutral-50/50 border border-neutral-100/60">
                              <div className="flex items-center gap-1 text-[9px] font-mono tracking-wider text-neutral-400 font-bold uppercase">
                                <span>👾 STICKERS</span>
                                <span className="bg-[#10B981]/10 text-[#10B981] px-1 rounded font-bold font-sans text-[8px]">{results.totalStickers}</span>
                              </div>
                              <div className="mt-1">
                                {results.topStickerSender ? (
                                  <>
                                    <div className="text-[8px] text-neutral-400 font-semibold uppercase font-mono tracking-tight leading-none">STICKER STAN</div>
                                    <div className="text-xs font-sans font-extrabold text-neutral-800 truncate mt-0.5">{results.topStickerSender.name}</div>
                                    <div className="text-[9px] font-mono text-neutral-500 font-bold mt-0.5">{results.topStickerSender.count} sent</div>
                                  </>
                                ) : (
                                  <div className="text-[9px] text-neutral-400 italic">None sent</div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col justify-between p-2 rounded-xl bg-neutral-50/50 border border-neutral-100/60">
                              <div className="flex items-center gap-1 text-[9px] font-mono tracking-wider text-neutral-400 font-bold uppercase">
                                <span>🎬 GIFS</span>
                                <span className="bg-[#0066FF]/10 text-[#0066FF] px-1 rounded font-bold font-sans text-[8px]">{results.totalGifs}</span>
                              </div>
                              <div className="mt-1">
                                {results.topGifSender ? (
                                  <>
                                    <div className="text-[8px] text-neutral-400 font-semibold uppercase font-mono tracking-tight leading-none">GIF OVERLORD</div>
                                    <div className="text-xs font-sans font-extrabold text-neutral-800 truncate mt-0.5">{results.topGifSender.name}</div>
                                    <div className="text-[9px] font-mono text-neutral-500 font-bold mt-0.5">{results.topGifSender.count} sent</div>
                                  </>
                                ) : (
                                  <div className="text-[9px] text-neutral-400 italic">None sent</div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.p
                            variants={slideFadeUp}
                            className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8 z-20 relative"
                          >
                            Counting all photos, stickers, voice notes, and media attachments sent in this chat.
                          </motion.p>
                        )}
                      </motion.div>
                    )}

                    {/* Slide 12: Text-to-Media Ratio */}
                    {activeSlide === 12 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            {isGroup ? "Who relies on stickers and attachments rather than typing?" : "The Media Spammer: Who communicates entirely in stickers and GIFs?"}
                          </p>
                        </motion.div>

                        <div className="my-auto space-y-4 w-full z-20">
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5"
                          >
                            <span className="text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">MEDIA TO TEXT RATIO</span>
                            <div className="space-y-3">
                              {results.sendersList.slice(0, 3).map((sender) => {
                                const ratio = results.mediaRatios[sender] || 0;
                                return (
                                  <div key={sender} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{sender}</span>
                                      <span className="font-mono text-emerald-600 font-bold">{ratio}% media</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${ratio}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          Percentage of sent messages that contain media attachments rather than plain text.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 13: Voice Notes */}
                    {activeSlide === 13 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Sometimes typing is too much work. Your audio archives speak volumes.
                          </p>
                          <div className="space-y-0">
                            <h2 className="font-sans text-5xl sm:text-7xl font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.totalVoiceNotesCount.toLocaleString()}
                            </h2>
                            <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
                              voice notes sent • {formatDuration(results.totalVoiceNotesDuration * 1000)}
                            </p>
                          </div>
                        </motion.div>

                        {isGroup ? (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5 z-20 my-auto w-full"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>VOICE NOTE SPLIT</span>
                              <span className="text-purple-600 font-bold">{results.totalVoiceNotesCount} files</span>
                            </div>

                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender, idx) => {
                                const count = results.voiceNoteCounts[sender] || 0;
                                const pct = results.totalVoiceNotesCount > 0 ? Math.round((count / results.totalVoiceNotesCount) * 100) : 0;
                                const barColors = ['bg-purple-600', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                                return (
                                  <div key={sender} className="space-y-1">
                                    <div className="flex justify-between text-xs font-semibold text-neutral-800">
                                      <span className="truncate max-w-[150px]">{idx + 1}. {sender}</span>
                                      <span className="font-mono text-[10px] text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                    </div>
                                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${barColors[idx] || 'bg-neutral-400'} transition-all`} style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3 z-20 my-auto"
                          >
                            <div className="flex justify-between items-center text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase">
                              <span>VOICE NOTE SPLIT</span>
                              <span className="text-purple-600 font-extrabold">
                                {Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}% vs {100 - Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}%
                              </span>
                            </div>

                            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-purple-600 transition-all" style={{ width: `${Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}%` }} />
                              <div className="h-full bg-[#E95D3C] transition-all" style={{ width: `${100 - Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}%` }} />
                            </div>

                            <div className="flex justify-between text-xs font-sans">
                              <div className="flex flex-col">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderA}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{(results.voiceNoteCounts[senderA] || 0).toLocaleString()} VN</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderB}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">{(results.voiceNoteCounts[senderB] || 0).toLocaleString()} VN</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <motion.div
                          variants={slideFadeUp}
                          className="bg-white/90 border border-purple-100 rounded-2xl p-3 shadow-sm z-20 flex items-center gap-3 w-full"
                        >
                          <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-lg text-purple-600 font-bold shrink-0">
                            🎙️
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="text-[9px] font-mono font-bold text-purple-600 uppercase tracking-widest leading-none">LONGEST MONOLOGUE</span>
                            {results.longestVoiceNote ? (
                              <>
                                <span className="text-xs font-sans font-extrabold text-neutral-800 truncate mt-1">
                                  {results.longestVoiceNote.name}'s voice note
                                </span>
                                <span className="text-[10px] text-neutral-500 font-mono mt-0.5">
                                  Lasted {formatDuration(results.longestVoiceNote.durationSec * 1000)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-neutral-500 italic mt-0.5">No voice notes parsed</span>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Slide 14: Vocabulary & Emojis */}
                    {activeSlide === 14 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-2">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Your signature reactions and favorite words of the year.
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-3 my-auto w-full z-20">
                          {/* Sender A Vocabulary Card */}
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/95 rounded-[20px] p-3.5 space-y-3.5 shadow-lg border border-neutral-100 flex flex-col justify-between h-44"
                          >
                            <div className="border-b pb-1.5 border-neutral-100">
                              <h4 className="font-sans text-xs font-bold truncate text-neutral-800">{senderA}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-3xl">{results.emojiDependency[senderA]?.emoji || "❤️"}</span>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">x{results.emojiDependency[senderA]?.count || 0}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono uppercase tracking-wider block font-bold text-neutral-400">TOP DIALECT</span>
                              {(results.vocabulary[senderA] || []).slice(0, 3).map((w, idx) => (
                                <div key={w.word} className="flex justify-between text-[10px] items-center">
                                  <span className="capitalize truncate font-medium text-neutral-800">{idx + 1}. {w.word}</span>
                                  <span className="font-mono text-neutral-500">{w.count}x</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Sender B Vocabulary Card */}
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-[#1C1A17] rounded-[20px] p-3.5 space-y-3.5 shadow-lg flex flex-col justify-between h-44 text-white"
                          >
                            <div className="border-b pb-1.5 border-white/10">
                              <h4 className="font-sans text-xs font-bold truncate text-neutral-100">{senderB}</h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-3xl">{results.emojiDependency[senderB]?.emoji || "❤️"}</span>
                                <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">x{results.emojiDependency[senderB]?.count || 0}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono uppercase tracking-wider block font-bold text-neutral-500">TOP DIALECT</span>
                              {(results.vocabulary[senderB] || []).slice(0, 3).map((w, idx) => (
                                <div key={w.word} className="flex justify-between text-[10px] items-center">
                                  <span className="capitalize truncate font-medium text-neutral-100">{idx + 1}. {w.word}</span>
                                  <span className="font-mono text-neutral-400">{w.count}x</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          {isGroup ? "Everyone speaks their own unique dialect. What a vibrant dynamic!" : "You both speak your own unique dialect. What a perfect dynamic!"}
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 15: Slang Lord vs Corporate Dictator */}
                    {activeSlide === 15 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Slang Lord vs. Corporate Dictator: Who writes like they are cold-emailing KPMG?
                          </p>
                        </motion.div>

                        <div className="my-auto space-y-4 w-full z-20">
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/85 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3.5"
                          >
                            <span className="text-[10px] font-mono tracking-wider text-neutral-500 font-bold uppercase block mb-1">DIALECT BREAKDOWN</span>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2 border-r pr-2 border-neutral-100">
                                <span className="text-[9px] font-mono font-bold text-yellow-600 uppercase">💬 SLANG TERMS</span>
                                {results.sendersList.slice(0, 3).map((sender) => (
                                  <div key={sender} className="flex justify-between text-[11px] text-neutral-700">
                                    <span className="truncate max-w-[90px]">{sender}</span>
                                    <span className="font-mono font-bold">{results.slangCounts[sender] || 0}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="space-y-2 pl-1">
                                <span className="text-[9px] font-mono font-bold text-blue-600 uppercase">💼 CORPORATE TERMS</span>
                                {results.sendersList.slice(0, 3).map((sender) => (
                                  <div key={sender} className="flex justify-between text-[11px] text-neutral-700">
                                    <span className="truncate max-w-[90px]">{sender}</span>
                                    <span className="font-mono font-bold">{results.corporateCounts[sender] || 0}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          One of you communicates entirely in text slang acronyms (fr, rn, idk). The other ends messages with full punctuation.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 16: The Panic Station Index */}
                    {activeSlide === 16 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Who is Always Panicking? The Punctuation Chain Count.
                          </p>
                        </motion.div>

                        <div className="my-auto space-y-4 w-full z-20">
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm space-y-3"
                          >
                            <span className="text-[10px] font-mono tracking-wider text-red-500 font-bold uppercase">PANIC INDEX (??? or !!! counts)</span>
                            <div className="space-y-2.5">
                              {results.sendersList.slice(0, 3).map((sender) => {
                                const count = results.panicCounts[sender] || 0;
                                return (
                                  <div key={sender} className="flex justify-between items-center text-xs font-semibold text-neutral-800">
                                    <span className="truncate max-w-[150px]">{sender}</span>
                                    <span className="font-mono text-red-600 font-bold">{count} marks</span>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        </div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          When things go sideways, someone loses their mind first. Total pure punctuation chains sent.
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 17: The Hyper-Fixation Phase */}
                    {activeSlide === 17 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-3">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Your Word Hyper-Fixation Phase: A linguistic spike that disappeared.
                          </p>
                          {results.hyperFixation ? (
                            <div className="space-y-0 text-center py-4 bg-white/40 rounded-2xl border border-white/20 p-4 shadow-sm">
                              <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold">IN {results.hyperFixation.monthName.toUpperCase()} YOU WENT CRAZY FOR</h3>
                              <h2 className="font-sans text-4xl font-extrabold tracking-tighter text-pink-600 my-2">
                                "{results.hyperFixation.word}"
                              </h2>
                              <p className="text-xs text-neutral-500 font-mono">
                                Used {results.hyperFixation.count} times in one month
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs font-mono text-neutral-500">No hyper-fixations detected.</p>
                          )}
                        </motion.div>

                        <motion.p
                          variants={slideFadeUp}
                          className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                        >
                          The single word that had a massive percentage spike in one specific month but virtually disappeared afterward. What happened there?
                        </motion.p>
                      </motion.div>
                    )}

                    {/* Slide 18: Chat Aura */}
                    {activeSlide === 18 && (() => {
                      const aura = calculateChatAura(results);
                      if (!aura) return null;

                      const config = {
                        midnight: {
                          title: "Night Owl Violet",
                          gradient: "from-violet-600 via-indigo-700 to-blue-900",
                          desc: "Mysterious, reflective, late-night deep talks. Your chat thrives under the cover of darkness, fueled by midnight monologues and deep-night disclosures.",
                          vibe: "Reflective & Intimate"
                        },
                        active: {
                          title: "Daylight Flame",
                          gradient: "from-orange-500 via-red-600 to-amber-500",
                          desc: "High-energy, fast-paced, daytime chaos. You trigger lock-screens, cascade notifications, and communicate in rapid-fire bursts of excitement.",
                          vibe: "Electric & Chaotic"
                        },
                        balanced: {
                          title: "Zenith Emerald",
                          gradient: "from-emerald-500 via-teal-600 to-blue-600",
                          desc: "Calm, steady, balanced connection. A harmonious pace of chat, with reliable response rhythms and structured, meaningful engagement.",
                          vibe: "Harmonious & Grounded"
                        }
                      }[aura.theme];

                      return (
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left relative overflow-hidden"
                        >
                          <motion.div variants={slideFadeUp} className="space-y-3 z-10">
                            <p className="text-[17px] font-sans font-medium leading-relaxed text-white max-w-[280px]">
                              Your Sensory Visualization: What does your chat vibe feel like?
                            </p>
                          </motion.div>

                          {/* Pulsing Gradient Aura Orb */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                            <motion.div
                              className={`w-64 h-64 rounded-full blur-[45px] opacity-70 bg-gradient-to-tr ${config.gradient}`}
                              animate={{
                                scale: [1, 1.15, 0.95, 1.05, 1],
                                x: [0, 15, -10, 5, 0],
                                y: [0, -15, 10, -5, 0],
                                rotate: [0, 120, 240, 360]
                              }}
                              transition={{
                                duration: aura.pulseDuration,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                          </div>

                          {/* Frosted Lens Card */}
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-6 shadow-2xl z-10 w-full my-auto flex flex-col gap-4 text-white relative"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                          >
                            <div className="border-b border-white/10 pb-3">
                              <span className="text-[10px] font-mono tracking-widest text-[#8B5CF6] font-bold uppercase block">YOUR CHAT AURA</span>
                              <h2 className="font-sans text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white to-neutral-200 bg-clip-text text-transparent">
                                {config.title}
                              </h2>
                              <span className="inline-block mt-2 text-[9px] font-bold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded-full border border-white/5 text-neutral-200">
                                Vibe: {config.vibe}
                              </span>
                            </div>

                            <p className="text-xs leading-relaxed text-neutral-200 font-sans font-light">
                              {config.desc}
                            </p>
                          </motion.div>

                          {/* Aura stats breakdown */}
                          <motion.div
                            variants={slideFadeUp}
                            className="bg-black/25 backdrop-blur-md rounded-2xl p-3 border border-white/5 space-y-1.5 z-10 w-full mb-8 text-[10px] text-neutral-300 font-sans"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-mono uppercase text-[8px] text-neutral-400 tracking-wider">MIDNIGHT CONVERSATIONS</span>
                              <span className="font-mono font-bold text-neutral-100">{Math.round(aura.midnightRatio * 100)}% of chat</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono uppercase text-[8px] text-neutral-400 tracking-wider">NOTIFICATION BOMBS</span>
                              <span className="font-mono font-bold text-neutral-100">{aura.totalBombs} lock-screen spikes</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-mono uppercase text-[8px] text-[#8B5CF6] tracking-wider font-bold">PULSE RATE FREQUENCY</span>
                              <span className="font-mono font-bold text-[#8B5CF6]">{Math.min(3, 1 + (aura.panicRatio * 15)).toFixed(1)}x speed</span>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })()}

                    {/* Slide 19: Heatmap Timeline */}
                    {activeSlide === 19 && (() => {
                      const timeline = results.monthlyTimeline || [];
                      const maxMonthCount = Math.max(...timeline.map(t => t.totalCount || 1));
                      const activeIndex = scrubMonth !== null ? scrubMonth : (() => {
                        let maxVal = -1;
                        let maxIdx = 0;
                        timeline.forEach((t, idx) => {
                          if (t.totalCount > maxVal) {
                            maxVal = t.totalCount;
                            maxIdx = idx;
                          }
                        });
                        return maxIdx;
                      })();
                      const activeMonth = timeline[activeIndex];

                      const handleScrub = (clientX, containerEl) => {
                        const rect = containerEl.getBoundingClientRect();
                        const x = clientX - rect.left;
                        const percent = Math.max(0, Math.min(0.999, x / rect.width));
                        const monthIdx = Math.floor(percent * 12);
                        setScrubMonth(monthIdx);
                      };

                      return (
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left relative z-20"
                        >
                          <motion.div variants={slideFadeUp} className="space-y-2">
                            <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                              Your Chat Heatmap: Scrub over the months to reveal memories.
                            </p>
                          </motion.div>

                          {/* Tooltip Memory Flashback Card */}
                          <div className="h-44 flex items-center justify-center w-full my-auto z-30">
                            <AnimatePresence mode="wait">
                              {activeMonth && activeMonth.peakDay && (
                                <motion.div
                                  key={activeIndex}
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                  className="w-full bg-white rounded-3xl p-4 shadow-xl border border-neutral-100 flex flex-col gap-3 relative"
                                >
                                  <div className="flex justify-between items-center border-b pb-2 border-neutral-100">
                                    <div>
                                      <span className="text-[9px] font-mono font-bold text-orange-600 uppercase tracking-wider block">MONTH PEAK</span>
                                      <h4 className="text-sm font-sans font-extrabold text-neutral-800 leading-none mt-0.5">{activeMonth.peakDay.dateStr}</h4>
                                    </div>
                                    <span className="font-mono text-xs font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">{activeMonth.peakDay.count} texts</span>
                                  </div>

                                  {/* Flashback message */}
                                  <div className="flex flex-col text-left bg-orange-50/50 rounded-2xl p-3 border border-orange-100/50">
                                    <span className="text-[8px] font-mono font-bold text-orange-600 uppercase tracking-widest leading-none mb-1">FLASHBACK MESSAGE</span>
                                    <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider truncate mb-1">{activeMonth.peakDay.flashback.sender}</p>
                                    <p className="text-[11px] font-serif italic leading-snug text-neutral-800 line-clamp-2">
                                      "${activeMonth.peakDay.flashback.message}"
                                    </p>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Interactive Bar Chart Scrubber */}
                          <div className="space-y-2 w-full z-20 relative">
                            <div
                              className="h-28 flex items-end justify-between gap-1 w-full bg-neutral-900/5 rounded-2xl p-3 border border-black/5 cursor-ew-resize relative pointer-events-auto touch-pan-y select-none"
                              onMouseMove={(e) => {
                                handleScrub(e.clientX, e.currentTarget);
                                setIsPaused(true);
                              }}
                              onMouseLeave={() => {
                                setScrubMonth(null);
                                setIsPaused(false);
                              }}
                              onTouchStart={(e) => {
                                handleScrub(e.touches[0].clientX, e.currentTarget);
                                setIsPaused(true);
                              }}
                              onTouchMove={(e) => {
                                handleScrub(e.touches[0].clientX, e.currentTarget);
                                setIsPaused(true);
                              }}
                              onTouchEnd={() => {
                                setScrubMonth(null);
                                setIsPaused(false);
                              }}
                            >
                              {timeline.map((t, idx) => {
                                const heightPct = Math.max(10, Math.round((t.totalCount / maxMonthCount) * 100));
                                const isActive = idx === activeIndex;
                                return (
                                  <div
                                    key={t.monthIndex}
                                    className="flex-grow flex flex-col items-center group h-full justify-end"
                                  >
                                    <div
                                      className="w-full rounded-t-lg transition-all duration-150"
                                      style={{
                                        height: `${heightPct}%`,
                                        backgroundColor: isActive ? '#E95D3C' : 'rgba(47, 35, 29, 0.2)',
                                        boxShadow: isActive ? '0 0 12px rgba(233, 93, 60, 0.4)' : 'none'
                                      }}
                                    />
                                    <span
                                      className="text-[8px] font-mono mt-1 font-bold select-none"
                                      style={{ color: isActive ? '#E95D3C' : '#7A6458' }}
                                    >
                                      {t.monthName.substring(0, 3)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-[8px] font-mono text-center block text-neutral-500 uppercase tracking-widest">DRAG OR HOVER OVER BARS TO RECALL MEMORIES</span>
                          </div>

                          <motion.p
                            variants={slideFadeUp}
                            className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
                          >
                            Timeline represents monthly text volumes. Scrubbing highlights the peak day of the month and pulls a random flashback message sent on that day.
                          </motion.p>
                        </motion.div>
                      );
                    })()}

                    {/* Slide 20: Summary Slide */}
                    {activeSlide === 20 && (
                      <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
                      >
                        <motion.div variants={slideFadeUp} className="space-y-1">
                          <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
                            Now you're wrapping the year. Here is your conversational retro.
                          </p>
                        </motion.div>

                        {/* On-screen Preview Card */}
                        <div
                          className={`border shadow-xl max-w-[320px] w-full relative overflow-hidden bg-white/95 z-20 mt-1 ${results.totalVoiceNotesCount > 0 ? 'p-3 rounded-[16px] space-y-2 mb-2' : 'p-4 rounded-[20px] space-y-3 mb-8'
                            }`}
                          style={{ borderColor: 'rgba(0, 0, 0, 0.03)' }}
                        >
                          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-neutral-400" />
                          <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-neutral-400" />
                          <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-neutral-400" />
                          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-neutral-400" />

                          <div className="text-center border-b pb-2 border-neutral-100">
                            <span className="font-serif italic text-sm font-bold text-neutral-800">2026 Chat Retrospective</span>
                          </div>

                          <div className={`text-neutral-700 font-sans ${results.totalVoiceNotesCount > 0 ? 'space-y-1 text-[10px]' : 'space-y-2 text-[11px]'}`}>
                            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
                              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">MESSAGES</span>
                              <span className="font-mono font-bold text-neutral-800">{results.totalMessages.toLocaleString()}</span>
                            </div>

                            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
                              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">DAYS TEXTING</span>
                              <span className="font-serif italic font-medium text-neutral-800">{results.longevityDays} Days</span>
                            </div>

                            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
                              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">👑 THE YAPPER</span>
                              <span className="font-serif font-medium text-neutral-800 truncate max-w-[110px]">{results.yapper?.name || 'N/A'}</span>
                            </div>

                            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
                              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">MAX REPLY GAP</span>
                              <span className="font-mono font-bold text-neutral-800 text-[10px]">
                                {results.theGhoster ? formatDuration(results.theGhoster.gapMs) : '0 mins'}
                              </span>
                            </div>

                            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
                              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">PEAK HOUR</span>
                              <span className="font-serif text-[10px] font-medium text-neutral-800">{results.peakTraffic.text}</span>
                            </div>

                            {results.totalVoiceNotesCount > 0 && (
                              <>
                                <div className="flex justify-between items-center border-b pb-0.5 border-neutral-100">
                                  <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">🎙️ VOICE NOTES</span>
                                  <span className="font-mono font-bold text-neutral-800">
                                    {results.totalVoiceNotesCount} ({formatDuration(results.totalVoiceNotesDuration * 1000)})
                                  </span>
                                </div>

                                <div className="flex justify-between items-center border-b pb-0.5 border-neutral-100">
                                  <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">👑 PODCASTER</span>
                                  <span className="font-serif font-medium text-neutral-800 truncate max-w-[125px]">
                                    {results.topVoiceNoteSender?.name || 'N/A'} ({results.topVoiceNoteSender?.count} VNs)
                                  </span>
                                </div>

                                <div className="flex justify-between items-center border-b pb-0.5 border-neutral-100">
                                  <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">⏱️ LONGEST VN</span>
                                  <span className="font-serif font-medium text-neutral-800 truncate max-w-[125px]">
                                    {results.longestVoiceNote ? `${results.longestVoiceNote.name} (${formatDuration(results.longestVoiceNote.durationSec * 1000)})` : 'N/A'}
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">TOP EMOJIS</span>
                              <span className="flex gap-2 font-medium text-neutral-800 text-[10px]">
                                <span>{senderA}: {results.emojiDependency[senderA]?.emoji || "❤️"}</span>
                                <span>{senderB}: {results.emojiDependency[senderB]?.emoji || "❤️"}</span>
                                {isGroup && senderC && <span>{senderC}: {results.emojiDependency[senderC]?.emoji || "❤️"}</span>}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Home indicator bar at bottom */}
              <div className="w-full z-20 pointer-events-none mt-1 flex justify-center pb-1">
                <div className="h-[4px] w-24 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }} />
              </div>

              {/* Pause Warning overlay */}
              {isPaused && !isExporting && activeSlide < 20 && (
                <div
                  className="absolute top-8 right-6 z-30 font-mono text-[9px] text-neutral-500 uppercase tracking-widest px-2 py-0.5 rounded border border-neutral-900 flex items-center gap-1"
                  style={{ backgroundColor: 'rgba(10, 10, 10, 0.8)' }}
                >
                  <Pause className="w-2.5 h-2.5" />
                  Paused
                </div>
              )}
            </div>

            {/* Desktop helpers */}
            <div className="absolute left-[-60px] top-[50%] -translate-y-1/2 hidden md:block">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 flex items-center justify-center transition-all text-neutral-400 hover:text-neutral-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute right-[-60px] top-[50%] -translate-y-1/2 hidden md:block">
              <button
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 flex items-center justify-center transition-all text-neutral-400 hover:text-neutral-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Panel */}
            <div className="w-full flex flex-col gap-4 max-w-[430px]">
              {isExporting ? (
                <div
                  className="w-full py-4 text-center border border-neutral-900 rounded-xl flex items-center justify-center gap-3"
                  style={{ backgroundColor: 'rgba(10, 10, 10, 0.5)' }}
                >
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-400" />
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{exportMessage}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadJPEG}
                    className="flex items-center justify-center gap-2 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-98 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Card
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center gap-2 py-3 border border-neutral-800 hover:bg-neutral-900 text-neutral-200 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all active:scale-98 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Full PDF Report
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center px-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-400 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Upload Different Chat
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-400 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  {isPaused ? "Resume Play" : "Pause Play"}
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-[10px] text-neutral-600 font-mono tracking-widest z-10 border-t border-neutral-950 flex flex-col gap-2 items-center justify-center">
        <span>© 2026 WHATSAPP WRAPPED. 100% PRIVATE CLIENT-SIDE PROCESSOR.</span>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* HIDDEN OFF-SCREEN CONTAINERS OPTIMIZED FOR EXPORTS */}
      {/* ------------------------------------------------------------- */}

      {results && (
        <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">

          {/* 1. HIGH-RESOLUTION INSTAGRAM SUMMARY CARD (1080x1920) */}
          <div
            id="wrapped-summary-card-export"
            className="w-[1080px] h-[1920px] flex flex-col justify-between p-[90px] relative overflow-hidden"
            style={{ backgroundColor: '#F4F1EA', color: '#1C1A17' }}
          >
            {/* Dynamic Shapes */}
            {SLIDE_STYLES[19].shapes}

            <div className="absolute top-[40px] left-[40px] right-[40px] bottom-[40px] border pointer-events-none" style={{ borderColor: 'rgba(0, 0, 0, 0.04)' }} />
            <div className="absolute top-[35px] left-[35px] w-6 h-6 border-t-2 border-l-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />
            <div className="absolute top-[35px] right-[35px] w-6 h-6 border-t-2 border-r-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />
            <div className="absolute bottom-[35px] left-[35px] w-6 h-6 border-b-2 border-l-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />
            <div className="absolute bottom-[35px] right-[35px] w-6 h-6 border-b-2 border-r-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />

            <div className="flex justify-between items-center z-10">
              <span className="font-serif italic text-3xl font-light" style={{ color: '#1A1A1A' }}>
                WhatsApp <span className="text-neutral-500 font-sans text-sm uppercase tracking-[0.3em] ml-2 not-italic">Wrapped</span>
              </span>
              <span className="font-mono text-sm tracking-widest text-neutral-500 uppercase">2026 RETROSPECTIVE</span>
            </div>

            <div className="space-y-[55px] z-10 my-auto px-6">
              <div className="text-center space-y-2">
                <span className="text-xs tracking-[0.4em] uppercase text-neutral-500 font-mono">TOTAL MESSAGES</span>
                <h2 className="font-serif text-9xl font-light tracking-tighter" style={{ color: '#1A1A1A' }}>
                  {results.totalMessages.toLocaleString()}
                </h2>
                <p className="text-neutral-500 text-lg font-light">messages exchanged over {results.longevityDays} days</p>
              </div>

              <div className="h-[1px] w-[200px] mx-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />

              <div className="grid grid-cols-2 gap-y-[45px] gap-x-12">

                {results.topTexter && (
                  <div className="space-y-1">
                    <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">TOP TEXTER</span>
                    <h3 className="font-serif text-4xl font-medium italic" style={{ color: '#1A1A1A' }}>{results.topTexter.name}</h3>
                    <p className="text-neutral-500 text-sm font-light">
                      {results.topTexter.count.toLocaleString()} messages ({results.topTexter.percent}%)
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">👑 THE YAPPER</span>
                  <h3 className="font-serif text-4xl font-medium italic" style={{ color: '#1A1A1A' }}>{results.yapper?.name || 'N/A'}</h3>
                  <p className="text-neutral-500 text-sm font-light">
                    Sent {results.yapper?.count || 0} consecutive messages
                  </p>
                </div>

                {results.theGhoster && (
                  <div className="space-y-1">
                    <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">LONGEST REPLY GAP</span>
                    <h3 className="font-serif text-3xl font-light" style={{ color: '#1A1A1A' }}>{formatDuration(results.theGhoster.gapMs)}</h3>
                    <p className="text-neutral-500 text-sm font-light leading-relaxed font-serif italic">
                      By {results.theGhoster.senderB}
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">PEAK TRAFFIC</span>
                  <h3 className="font-serif text-3xl font-light truncate" style={{ color: '#1A1A1A' }}>{results.peakTraffic.text}</h3>
                  <p className="text-neutral-500 text-sm font-light leading-relaxed">
                    Most active hours of the week
                  </p>
                </div>

                {results.totalVoiceNotesCount > 0 && (
                  <>
                    <div className="space-y-1">
                      <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">🎙️ VOICE NOTES</span>
                      <h3 className="font-serif text-3xl font-light" style={{ color: '#1A1A1A' }}>
                        {results.totalVoiceNotesCount} files ({formatDuration(results.totalVoiceNotesDuration * 1000)})
                      </h3>
                      <p className="text-neutral-500 text-sm font-light">
                        Top: {results.topVoiceNoteSender?.name || 'N/A'} ({results.topVoiceNoteSender?.count || 0} sent)
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">⏱️ LONGEST MONOLOGUE</span>
                      <h3 className="font-serif text-3xl font-light" style={{ color: '#1A1A1A' }}>
                        {results.longestVoiceNote ? formatDuration(results.longestVoiceNote.durationSec * 1000) : '0s'}
                      </h3>
                      <p className="text-neutral-500 text-sm font-light leading-relaxed font-serif italic">
                        Sent by {results.longestVoiceNote?.name || 'N/A'}
                      </p>
                    </div>
                  </>
                )}

                <div
                  className="space-y-3 col-span-2 border-t pt-4"
                  style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
                >
                  <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">EMOJI DEPENDENCIES</span>
                  <div className="flex gap-12">
                    <div className="flex items-center gap-2">
                      <span className="text-4xl">{results.emojiDependency[senderA]?.emoji || "❤️"}</span>
                      <div>
                        <span className="text-xs font-mono block font-semibold truncate" style={{ color: '#1A1A1A' }}>{senderA}</span>
                        <span className="text-[11px] font-mono text-neutral-500 block truncate">x{results.emojiDependency[senderA]?.count || 0} times</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-4xl">{results.emojiDependency[senderB]?.emoji || "❤️"}</span>
                      <div>
                        <span className="text-xs font-mono block font-semibold truncate" style={{ color: '#1A1A1A' }}>{senderB}</span>
                        <span className="text-[11px] font-mono text-neutral-500 block truncate">x{results.emojiDependency[senderB]?.count || 0} times</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div
              className="flex justify-between items-center z-10 border-t pt-8"
              style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
            >
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase font-semibold">100% SECURE CLIENT-SIDE ANALYSIS</span>
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase font-semibold">MADE PRIVATELY</span>
            </div>
          </div>

          {/* 2. MULTI-PAGE SLIDES FOR PDF EXPORTS (1080x1920 each, matched to 19 slides) */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((slideIndex) => {
            const style = SLIDE_STYLES[slideIndex];
            return (
              <div
                key={slideIndex}
                id={`pdf-slide-export-${slideIndex}`}
                className="w-[1080px] h-[1920px] flex flex-col justify-between p-[90px] relative overflow-hidden"
                style={{ display: 'none', backgroundColor: style.bg, color: style.text }}
              >
                {/* Decorative shapes */}
                {style.shapes}

                <div className="absolute top-[40px] left-[40px] right-[40px] bottom-[40px] border pointer-events-none" style={{ borderColor: 'rgba(0, 0, 0, 0.04)' }} />
                <div className="absolute top-[35px] left-[35px] w-6 h-6 border-t-2 border-l-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />
                <div className="absolute top-[35px] right-[35px] w-6 h-6 border-t-2 border-r-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />
                <div className="absolute bottom-[35px] left-[35px] w-6 h-6 border-b-2 border-l-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />
                <div className="absolute bottom-[35px] right-[35px] w-6 h-6 border-b-2 border-r-2" style={{ borderColor: '#6C685F', opacity: 0.3 }} />

                {/* PDF Header Row */}
                <div className="flex justify-between items-center relative z-10 w-full mb-4 pt-2">
                  <div className="flex items-center gap-3">
                    {/* WhatsApp Custom Bubble Logo */}
                    <svg className="w-8 h-8 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm5.835-3.332c1.629.967 3.23 1.488 4.793 1.489 5.517 0 10.005-4.486 10.008-10.006.002-2.673-1.038-5.187-2.931-7.082C15.823 3.16 13.315 2.12 10.64 2.12 5.125 2.12.637 6.606.635 12.127c-.001 1.621.43 3.206 1.251 4.607L.947 20.898l4.945-1.23z" />
                    </svg>
                    <span className="text-lg font-sans font-bold tracking-[0.1em] uppercase" style={{ opacity: 0.8 }}>
                      Wrapped • Year in Review
                    </span>
                  </div>
                  <span className="font-mono text-sm tracking-widest uppercase" style={{ opacity: 0.7 }}>PAGE {slideIndex + 1 >= 10 ? slideIndex + 1 : '0' + (slideIndex + 1)} OF 21</span>
                </div>

                {/* PDF Progress Indicators */}
                <div className="flex gap-2 w-full relative z-10 mb-8">
                  {Array.from({ length: 21 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[5px] flex-grow rounded-full overflow-hidden"
                      style={{ backgroundColor: idx <= slideIndex ? style.text : 'rgba(0, 0, 0, 0.08)' }}
                    />
                  ))}
                </div>

                {/* PDF Content Body */}
                <div className="my-auto relative z-10 flex flex-col justify-between items-start text-left w-full h-[1400px] px-6 pointer-events-none">

                  {slideIndex === 0 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          {isGroup ? "Here is your year in review with your group." : "Here is your year in review with your favorite person."}
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[12rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            2026
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            Wrapped • Year in Review
                          </p>
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Unpack the reply logs, dialogue volumes, and habits that defined your {isGroup ? 'group chat' : 'chat thread'} this year.
                      </p>
                    </div>
                  )}

                  {slideIndex === 1 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          {isGroup ? "You all connected more than ever before. Every conversation, counted." : "You connected more than ever before. Every conversation, counted."}
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[10rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            {results.totalMessages.toLocaleString()}
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            messages exchanged
                          </p>
                        </div>
                      </div>

                      {/* PDF Card Slide 1 */}
                      {isGroup ? (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>TOP CONTRIBUTORS</span>
                            <span className="text-[#0066FF] font-bold">{results.sendersList.length} members</span>
                          </div>

                          <div className="space-y-6">
                            {results.sendersList.slice(0, 3).map((sender, idx) => {
                              const count = results.senderCounts[sender] || 0;
                              const pct = Math.round((count / results.totalMessages) * 100);
                              const barColors = ['bg-[#0066FF]', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                              return (
                                <div key={sender} className="space-y-2">
                                  <div className="flex justify-between text-xl font-semibold text-neutral-800">
                                    <span className="truncate max-w-[450px]">{idx + 1}. {sender}</span>
                                    <span className="font-mono text-base text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                  </div>
                                  <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColors[idx] || 'bg-neutral-400'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>MESSAGE SHARE</span>
                            <span className="text-[#0066FF] font-extrabold">{percentA}% vs {percentB}%</span>
                          </div>

                          <div className="h-8 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#0066FF]" style={{ width: `${percentA}%` }} />
                            <div className="h-full bg-[#E95D3C]" style={{ width: `${percentB}%` }} />
                          </div>

                          <div className="flex justify-between text-2xl font-sans">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderA}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{countA.toLocaleString()} texts</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderB}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{countB.toLocaleString()} texts</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Exchanged over <span className="font-semibold text-neutral-800">{results.longevityDays} days</span> of chatting. That's a total word count of <span className="font-semibold text-neutral-800">{results.totalWordCount.toLocaleString()}</span> words!
                      </p>
                    </div>
                  )}

                  {slideIndex === 2 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Your weekly peak traffic hour when the chat really came alive.
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[9rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            {results.peakTraffic.day}s
                          </h2>
                          <h2 className="font-sans text-[7rem] font-extrabold tracking-tighter leading-none" style={{ color: style.accent }}>
                            at {results.peakTraffic.hour}
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            peak connection window
                          </p>
                        </div>
                      </div>

                      {/* PDF Card Slide 2 */}
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                        <div className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                          WEEKLY RHYTHM
                        </div>

                        <div className="flex justify-between items-center px-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
                            const isActiveDay = results?.peakTraffic?.day?.startsWith(d);
                            return (
                              <div key={d} className="flex flex-col items-center gap-3">
                                <div
                                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${isActiveDay
                                      ? 'bg-[#0066FF] text-white shadow-lg ring-4 ring-white/50'
                                      : 'bg-neutral-100 text-neutral-400'
                                    }`}
                                >
                                  {d[0]}
                                </div>
                                <span className={`text-sm font-mono font-bold uppercase ${isActiveDay ? 'text-blue-600 font-extrabold' : 'text-neutral-500'}`}>{d}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center gap-6 bg-neutral-50/50 p-6 rounded-[24px] border border-neutral-100">
                          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-4xl shadow-inner">
                            ⏰
                          </div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-semibold text-neutral-800">Peak Hour: {results?.peakTraffic?.hour}</span>
                            <span className="text-lg text-neutral-500 font-medium mt-1">When your chat bursts into life</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        {results.peakTraffic.text}
                      </p>
                    </div>
                  )}

                  {slideIndex === 3 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          You amplified others' ideas, but someone usually took the stage.
                        </p>
                      </div>

                      <div className="relative w-full h-[700px] my-auto">
                        {/* Decorative black bubble */}
                        <div className="w-[330px] h-[250px] bg-[#1C1A17]/8 border border-[#1C1A17]/10 rounded-[70px] absolute right-[100px] bottom-[150px] shadow-md transform rotate-[-6deg]" />

                        {/* Decorative blue bubble */}
                        <div className="w-[360px] h-[280px] bg-[#0066FF]/10 border border-[#0066FF]/15 rounded-[80px] absolute left-[100px] bottom-[50px] shadow-md transform rotate-[4deg]" />

                        {/* Green bubble */}
                        <div className="absolute right-[50px] top-0 w-[420px] h-[300px] bg-[#224535] text-white rounded-[90px] p-8 flex flex-col justify-center items-center shadow-2xl z-20">
                          <span className="font-sans text-6xl font-extrabold tracking-tight">
                            {(results.doubleTexter[senderA] || 1.0).toFixed(1)} vs {(results.doubleTexter[senderB] || 1.0).toFixed(1)}
                          </span>
                          <span className="text-lg uppercase tracking-wider font-mono opacity-80 text-center leading-tight mt-3">
                            avg texts/turn
                          </span>
                        </div>

                        {/* Orange bubble */}
                        <div className="absolute left-[50px] top-[120px] w-[430px] h-[310px] bg-[#E95D3C] text-white rounded-[90px] p-8 flex flex-col justify-center items-center shadow-2xl z-20">
                          <span className="font-sans text-7xl font-extrabold tracking-tight">
                            {results.yapper.count}
                          </span>
                          <span className="text-lg uppercase tracking-wider font-mono opacity-80 text-center leading-tight mt-3 font-bold">
                            consecutive messages
                          </span>
                          <span className="text-sm uppercase tracking-widest font-sans opacity-70 text-center truncate w-full mt-2">
                            by {results.yapper.name}
                          </span>
                        </div>
                      </div>

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        "{results.yapper.name} once went on a monologue rampage of {results.yapper.count} messages in a row!"
                      </p>
                    </div>
                  )}

                  {slideIndex === 4 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Beyond a quick reply, your longest wait was...
                        </p>
                      </div>

                      {results.theGhoster ? (
                        <div className="my-auto space-y-12 w-full">
                          {/* Central White Card */}
                          <div className="bg-white rounded-[60px] p-12 shadow-2xl border border-neutral-100 flex flex-col items-center justify-center gap-4 relative z-20 w-[600px] mx-auto">
                            <svg className="w-20 h-20 text-[#E95D3C]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>

                            <h4 className="font-sans text-5xl font-extrabold tracking-tight text-neutral-900 leading-none text-center">
                              {formatDuration(results.theGhoster.gapMs)}
                            </h4>
                            <p className="text-sm text-neutral-500 font-sans font-bold uppercase tracking-wider text-center">
                              reply gap by {results.theGhoster.senderB}
                            </p>
                          </div>

                          {/* Snippet */}
                          <div className="border-l-4 pl-8 py-4 space-y-4 rounded-r-[36px] bg-white/70 shadow-md border-[#E95D3C] max-w-[650px] mx-auto w-full">
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-wider font-mono text-neutral-500">
                                {results.theGhoster.senderA} • {results.theGhoster.timestampA}
                              </p>
                              <p className="text-lg italic font-serif leading-tight text-neutral-800">
                                "{results.theGhoster.messageA}"
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs uppercase tracking-wider font-mono font-semibold text-[#E95D3C]">
                                {results.theGhoster.senderB} replied • {results.theGhoster.timestampB}
                              </p>
                              <p className="text-lg font-serif leading-tight text-neutral-800">
                                "{results.theGhoster.messageB}"
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-2xl font-light italic">No reply delays recorded.</p>
                      )}

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        It takes patience to build a connection. Or maybe they were just busy!
                      </p>
                    </div>
                  )}

                  {slideIndex === 5 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          The Response Hierarchy: Who is the Speed Racer and who is the Snail?
                        </p>
                      </div>
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full my-auto">
                        <div className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                          MEDIAN RESPONSE TIMES
                        </div>
                        <div className="space-y-6">
                          {results.sendersList.slice(0, 3).map((sender) => {
                            const time = results.medianResponseTimes[sender] || 0;
                            return (
                              <div key={sender} className="flex justify-between items-center text-2xl font-semibold text-neutral-800 border-b pb-4 border-neutral-100">
                                <span className="truncate max-w-[450px]">{sender}</span>
                                <span className="font-mono text-xl font-bold text-neutral-500">
                                  {time > 0 ? formatDuration(time * 1000) : "N/A"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Calculated during active hours (9 AM - 10 PM) for response delays under 6 hours.
                      </p>
                    </div>
                  )}

                  {slideIndex === 6 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          The Phone Buzzer: Who triggers the most lock screen cascades?
                        </p>
                      </div>
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto max-w-[800px] mx-auto">
                        <div className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                          NOTIFICATION BOMB CASCADES
                        </div>
                        <div className="space-y-6">
                          {results.sendersList.slice(0, 3).map((sender) => {
                            const count = results.notificationBombs[sender] || 0;
                            return (
                              <div key={sender} className="flex justify-between items-center text-2xl font-semibold text-neutral-800 border-b pb-4 border-neutral-100">
                                <span className="truncate max-w-[450px]">{sender}</span>
                                <span className="font-mono text-xl font-bold text-orange-605">{count} cascades</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Triggered when a user sends 5 or more rapid-fire messages within a 60-second window before getting a response.
                      </p>
                    </div>
                  )}

                  {slideIndex === 7 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          When the rest of the world went quiet, your chat kept going.
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[10rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            {results.totalMidnightMessages.toLocaleString()}
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            midnight messages exchanged
                          </p>
                        </div>
                      </div>

                      {/* PDF Card Slide 7 */}
                      {isGroup ? (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-indigo-600 font-bold uppercase">
                            <span>MIDNIGHT CHATS SPLIT</span>
                            <span className="text-indigo-600 font-bold">{results.totalMidnightMessages.toLocaleString()} texts</span>
                          </div>

                          <div className="space-y-6">
                            {results.sendersList.slice(0, 3).map((sender, idx) => {
                              const count = results.midnightCounts[sender] || 0;
                              const pct = results.totalMidnightMessages > 0 ? Math.round((count / results.totalMidnightMessages) * 100) : 0;
                              const barColors = ['bg-indigo-600', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                              return (
                                <div key={sender} className="space-y-2">
                                  <div className="flex justify-between text-xl font-semibold text-neutral-800">
                                    <span className="truncate max-w-[450px]">{idx + 1}. {sender}</span>
                                    <span className="font-mono text-base text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                  </div>
                                  <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColors[idx] || 'bg-neutral-400'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>MIDNIGHT CHATS SPLIT</span>
                            <span className="text-indigo-600 font-extrabold">{midPercentA}% vs {midPercentB}%</span>
                          </div>

                          <div className="h-8 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-indigo-600" style={{ width: `${midPercentA}%` }} />
                            <div className="h-full bg-[#E95D3C]" style={{ width: `${midPercentB}%` }} />
                          </div>

                          <div className="flex justify-between text-2xl font-sans">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderA}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{midA.toLocaleString()} texts</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderB}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{midB.toLocaleString()} texts</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Sent between 12 AM and 4 AM this year. Chief Sleep Evader: <span className="font-semibold text-neutral-800">{results.topMidnightPhilosopher?.name || 'N/A'}</span> (sent {results.topMidnightPhilosopher?.count.toLocaleString() || 0} messages).
                      </p>
                    </div>
                  )}

                  {slideIndex === 8 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Starting a conversation after a block of silence takes initiative.
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[10rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            {results.topInitiator?.count || 0}
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            conversations started by {results.topInitiator?.name || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* PDF Card Slide 8 */}
                      {isGroup ? (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-emerald-600 font-bold uppercase">
                            <span>CONVERSATION STARTERS</span>
                            <span className="text-emerald-600 font-bold">
                              {(Object.values(results.initiations).reduce((a, b) => a + b, 0) || 0).toLocaleString()} starts
                            </span>
                          </div>

                          <div className="space-y-6">
                            {results.sendersList.slice(0, 3).map((sender, idx) => {
                              const count = results.initiations[sender] || 0;
                              const totalInits = Object.values(results.initiations).reduce((a, b) => a + b, 0) || 1;
                              const pct = Math.round((count / totalInits) * 100);
                              const barColors = ['bg-emerald-600', 'bg-[#E95D3C]', 'bg-[#0066FF]'];

                              return (
                                <div key={sender} className="space-y-2">
                                  <div className="flex justify-between text-xl font-semibold text-neutral-800">
                                    <span className="truncate max-w-[450px]">{idx + 1}. {sender}</span>
                                    <span className="font-mono text-base text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                  </div>
                                  <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColors[idx] || 'bg-neutral-400'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>CONVERSATION STARTERS</span>
                            <span className="text-emerald-600 font-extrabold">{initPercentA}% vs {initPercentB}%</span>
                          </div>

                          <div className="h-8 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-600" style={{ width: `${initPercentA}%` }} />
                            <div className="h-full bg-[#E95D3C]" style={{ width: `${initPercentB}%` }} />
                          </div>

                          <div className="flex justify-between text-2xl font-sans">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderA}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{initA.toLocaleString()} times</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderB}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{initB.toLocaleString()} times</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Conversations are initiated after a block of silence lasting more than 8 hours.
                      </p>
                    </div>
                  )}

                  {slideIndex === 9 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          The Chat CPR Award: Who resuscitated the conversation when it was completely dead?
                        </p>
                      </div>
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto">
                        <div className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                          TOTAL RESUSCITATIONS (24H+ SILENCE)
                        </div>
                        <div className="space-y-6">
                          {results.sendersList.slice(0, 3).map((sender) => {
                            const count = results.resuscitationCounts[sender] || 0;
                            return (
                              <div key={sender} className="flex justify-between items-center text-2xl font-semibold text-neutral-800 border-b pb-4 border-neutral-100">
                                <span className="truncate max-w-[450px]">{sender}</span>
                                <span className="font-mono text-xl font-bold text-emerald-600">{count} CPRs</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Tracked when a chat had a dead spell of more than 24 hours, and who sends the very next message to bring it back to life.
                      </p>
                    </div>
                  )}

                  {slideIndex === 10 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          The Great Silence: What was your longest dry spell this year?
                        </p>
                        {results.drySpell ? (
                          <div className="space-y-0">
                            <h2 className="font-sans text-[10rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                              {results.drySpell.days} Days
                            </h2>
                            <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                              of absolute silence
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl font-light italic">No silence periods detected.</p>
                        )}
                      </div>
                      {results.drySpell && (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg z-20 my-auto text-center w-full">
                          <span className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase block mb-1">LONG TIME NO CHAT</span>
                          <span className="font-sans font-bold text-neutral-800 text-4xl">
                            {results.drySpell.startDate} — {results.drySpell.endDate}
                          </span>
                          <p className="text-xl text-neutral-500 mt-4 font-serif italic">
                            "You two literally forgot each other existed."
                          </p>
                        </div>
                      )}
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Your longest consecutive gap of absolute silence. No texts, no memes, no voice notes. Just pure peace.
                      </p>
                    </div>
                  )}

                  {slideIndex === 11 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          A picture is worth a thousand words, and your gallery proves it.
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[10rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            {results.topMediaMogul?.count || 0}
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            media files shared by {results.topMediaMogul?.name || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* PDF Card Slide 11 */}
                      {isGroup ? (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>GALLERY SPLIT</span>
                            <span className="text-[#0066FF] font-bold">
                              {(Object.values(results.mediaCounts).reduce((a, b) => a + b, 0) || 0).toLocaleString()} files
                            </span>
                          </div>

                          <div className="space-y-6">
                            {results.sendersList.slice(0, 3).map((sender, idx) => {
                              const count = results.mediaCounts[sender] || 0;
                              const totalMedia = Object.values(results.mediaCounts).reduce((a, b) => a + b, 0) || 1;
                              const pct = Math.round((count / totalMedia) * 100);
                              const barColors = ['bg-[#0066FF]', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                              return (
                                <div key={sender} className="space-y-2">
                                  <div className="flex justify-between text-xl font-semibold text-neutral-800">
                                    <span className="truncate max-w-[450px]">{idx + 1}. {sender}</span>
                                    <span className="font-mono text-base text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                  </div>
                                  <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColors[idx] || 'bg-neutral-400'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>GALLERY SPLIT</span>
                            <span className="text-[#0066FF] font-extrabold">{mediaPercentA}% vs {mediaPercentB}%</span>
                          </div>

                          <div className="h-8 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#0066FF]" style={{ width: `${mediaPercentA}%` }} />
                            <div className="h-full bg-[#E95D3C]" style={{ width: `${mediaPercentB}%` }} />
                          </div>

                          <div className="flex justify-between text-2xl font-sans">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderA}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{mediaA.toLocaleString()} files</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderB}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{mediaB.toLocaleString()} files</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Counting all photos, stickers, voice notes, and media attachments sent in this chat.
                      </p>
                    </div>
                  )}

                  {slideIndex === 12 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          {isGroup ? "Who relies on stickers and attachments rather than typing?" : "The Media Spammer: Who communicates entirely in stickers and GIFs?"}
                        </p>
                      </div>
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto">
                        <div className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                          MEDIA-TO-TEXT RATIO
                        </div>
                        <div className="space-y-6">
                          {results.sendersList.slice(0, 3).map((sender) => {
                            const ratio = results.mediaRatios[sender] || 0;
                            return (
                              <div key={sender} className="space-y-2 border-b pb-4 border-neutral-100">
                                <div className="flex justify-between text-2xl font-semibold text-neutral-800">
                                  <span className="truncate max-w-[450px]">{sender}</span>
                                  <span className="font-mono text-emerald-600 font-bold">{ratio}% media</span>
                                </div>
                                <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{ width: `${ratio}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        Percentage of sent messages that contain media attachments rather than plain text.
                      </p>
                    </div>
                  )}

                  {slideIndex === 13 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Sometimes typing is too much work. Your audio archives speak volumes.
                        </p>
                        <div className="space-y-0">
                          <h2 className="font-sans text-[10rem] font-extrabold tracking-tighter leading-none text-neutral-900">
                            {results.totalVoiceNotesCount.toLocaleString()}
                          </h2>
                          <p className="text-lg uppercase tracking-widest font-mono text-neutral-500 font-bold mt-2">
                            voice notes sent • {formatDuration(results.totalVoiceNotesDuration * 1000)}
                          </p>
                        </div>
                      </div>

                      {/* PDF Card Slide 13 */}
                      {isGroup ? (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-purple-600 font-bold uppercase">
                            <span>VOICE NOTE SPLIT</span>
                            <span className="text-purple-600 font-bold">{results.totalVoiceNotesCount} files</span>
                          </div>

                          <div className="space-y-6">
                            {results.sendersList.slice(0, 3).map((sender, idx) => {
                              const count = results.voiceNoteCounts[sender] || 0;
                              const pct = results.totalVoiceNotesCount > 0 ? Math.round((count / results.totalVoiceNotesCount) * 100) : 0;
                              const barColors = ['bg-purple-600', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                              return (
                                <div key={sender} className="space-y-2">
                                  <div className="flex justify-between text-xl font-semibold text-neutral-800">
                                    <span className="truncate max-w-[450px]">{idx + 1}. {sender}</span>
                                    <span className="font-mono text-base text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                                  </div>
                                  <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${barColors[idx] || 'bg-neutral-400'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-8 w-full">
                          <div className="flex justify-between items-center text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase">
                            <span>VOICE NOTE SPLIT</span>
                            <span className="text-purple-600 font-extrabold">
                              {Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}% vs {100 - Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}%
                            </span>
                          </div>

                          <div className="h-8 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                            <div className="h-full bg-purple-600" style={{ width: `${Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}%` }} />
                            <div className="h-full bg-[#E95D3C]" style={{ width: `${100 - Math.round(((results.voiceNoteCounts[senderA] || 0) / (results.totalVoiceNotesCount || 1)) * 100)}%` }} />
                          </div>

                          <div className="flex justify-between text-2xl font-sans">
                            <div className="flex flex-col">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderA}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{(results.voiceNoteCounts[senderA] || 0).toLocaleString()} VN</span>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderB}</span>
                              <span className="text-lg text-neutral-500 font-mono mt-1">{(results.voiceNoteCounts[senderB] || 0).toLocaleString()} VN</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-white/90 border border-purple-100 rounded-[32px] p-8 shadow-md flex items-center gap-6 w-full">
                        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-3xl text-purple-600 font-bold shrink-0">
                          🎙️
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-widest leading-none">LONGEST MONOLOGUE</span>
                          {results.longestVoiceNote ? (
                            <>
                              <span className="text-xl font-sans font-extrabold text-neutral-800 truncate mt-2">
                                {results.longestVoiceNote.name}'s voice note
                              </span>
                              <span className="text-sm font-mono text-neutral-500 font-bold mt-1">
                                Lasted {formatDuration(results.longestVoiceNote.durationSec * 1000)}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-neutral-500 italic mt-1">No voice notes parsed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {slideIndex === 14 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Your signature reactions and favorite words of the year.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-8 my-auto w-full z-20">
                        {/* Sender A */}
                        <div className="bg-white/95 rounded-[40px] p-8 space-y-6 shadow-xl border border-neutral-100 flex flex-col justify-between h-[450px]">
                          <div className="border-b pb-4 border-neutral-105">
                            <h4 className="font-sans text-3xl font-bold truncate text-neutral-800">{senderA}</h4>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-6xl">{results.emojiDependency[senderA]?.emoji || "❤️"}</span>
                              <span className="text-sm font-mono uppercase tracking-wider text-neutral-500 font-semibold">x{results.emojiDependency[senderA]?.count || 0}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <span className="text-xs font-mono uppercase tracking-wider block font-bold text-neutral-400">TOP DIALECT</span>
                            {(results.vocabulary[senderA] || []).slice(0, 3).map((w, idx) => (
                              <div key={w.word} className="flex justify-between text-lg items-center text-neutral-700">
                                <span className="capitalize truncate font-medium">{idx + 1}. {w.word}</span>
                                <span className="font-mono text-neutral-500">{w.count}x</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sender B */}
                        <div className="bg-[#1C1A17] rounded-[40px] p-8 space-y-6 shadow-xl flex flex-col justify-between h-[450px] text-white">
                          <div className="border-b pb-4 border-white/10">
                            <h4 className="font-sans text-3xl font-bold truncate text-neutral-100">{senderB}</h4>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-6xl">{results.emojiDependency[senderB]?.emoji || "❤️"}</span>
                              <span className="text-sm font-mono uppercase tracking-wider text-neutral-500 font-semibold">x{results.emojiDependency[senderB]?.count || 0}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <span className="text-xs font-mono uppercase tracking-wider block font-bold text-neutral-500">TOP DIALECT</span>
                            {(results.vocabulary[senderB] || []).slice(0, 3).map((w, idx) => (
                              <div key={w.word} className="flex justify-between text-lg items-center text-neutral-300">
                                <span className="capitalize truncate font-medium">{idx + 1}. {w.word}</span>
                                <span className="font-mono text-neutral-400">{w.count}x</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        {isGroup ? "Everyone speaks their own unique dialect. What a vibrant dynamic!" : "You both speak your own unique dialect. What a perfect dynamic!"}
                      </p>
                    </div>
                  )}

                  {slideIndex === 15 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Slang Lord vs. Corporate Dictator: Who writes like they are cold-emailing KPMG?
                        </p>
                      </div>
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto">
                        <div className="text-xl font-mono tracking-wider text-neutral-500 font-bold uppercase block mb-1">DIALECT BREAKDOWN</div>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4 border-r pr-4 border-neutral-100">
                            <span className="text-lg font-mono font-bold text-yellow-600 uppercase">💬 SLANG TERMS</span>
                            {results.sendersList.slice(0, 3).map((sender) => (
                              <div key={sender} className="flex justify-between text-xl text-neutral-700">
                                <span className="truncate max-w-[200px]">{sender}</span>
                                <span className="font-mono font-bold">{results.slangCounts[sender] || 0}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-4 pl-2">
                            <span className="text-lg font-mono font-bold text-blue-600 uppercase">💼 CORPORATE TERMS</span>
                            {results.sendersList.slice(0, 3).map((sender) => (
                              <div key={sender} className="flex justify-between text-xl text-neutral-700">
                                <span className="truncate max-w-[200px]">{sender}</span>
                                <span className="font-mono font-bold">{results.corporateCounts[sender] || 0}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        One of you communicates entirely in text slang acronyms (fr, rn, idk). The other ends every message with full punctuation.
                      </p>
                    </div>
                  )}

                  {slideIndex === 16 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Who is Always Panicking? The Punctuation Chain Count.
                        </p>
                      </div>
                      <div className="bg-white/80 border-2 border-white/40 rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto">
                        <div className="text-xl font-mono tracking-wider text-red-500 font-bold uppercase">PANIC INDEX (??? or !!! counts)</div>
                        <div className="space-y-6">
                          {results.sendersList.slice(0, 3).map((sender) => {
                            const count = results.panicCounts[sender] || 0;
                            return (
                              <div key={sender} className="flex justify-between items-center text-2xl font-semibold text-neutral-800 border-b pb-4 border-neutral-100">
                                <span className="truncate max-w-[450px]">{sender}</span>
                                <span className="font-mono text-red-600 font-bold">{count} marks</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        When things go sideways, someone loses their mind first. Total pure punctuation chains sent.
                      </p>
                    </div>
                  )}

                  {slideIndex === 17 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full">
                      <div className="space-y-8">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Your Word Hyper-Fixation Phase: A linguistic spike that disappeared.
                        </p>
                      </div>
                      {results.hyperFixation ? (
                        <div className="bg-white/40 border border-white/20 rounded-[40px] p-10 shadow-lg z-20 my-auto text-center w-full">
                          <h3 className="font-mono text-lg uppercase tracking-widest text-neutral-500 font-bold">IN {results.hyperFixation.monthName.toUpperCase()} YOU WENT CRAZY FOR</h3>
                          <h2 className="font-sans text-6xl font-extrabold tracking-tighter text-pink-600 my-4">
                            "{results.hyperFixation.word}"
                          </h2>
                          <p className="text-xl text-neutral-500 font-mono">
                            Used {results.hyperFixation.count} times in one month
                          </p>
                        </div>
                      ) : (
                        <p className="text-2xl font-light italic">No hyper-fixations detected.</p>
                      )}
                      <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                        The single word that had a massive percentage spike in one specific month but virtually disappeared afterward. What happened there?
                      </p>
                    </div>
                  )}

                  {slideIndex === 18 && (() => {
                    const aura = calculateChatAura(results);
                    if (!aura) return null;

                    const config = {
                      midnight: {
                        title: "Night Owl Violet",
                        gradient: "from-violet-600 via-indigo-700 to-blue-900",
                        desc: "Mysterious, reflective, late-night deep talks. Your chat thrives under the cover of darkness, fueled by midnight monologues and deep-night disclosures.",
                        vibe: "Reflective & Intimate"
                      },
                      active: {
                        title: "Daylight Flame",
                        gradient: "from-orange-500 via-red-600 to-amber-500",
                        desc: "High-energy, fast-paced, daytime chaos. You trigger lock-screens, cascade notifications, and communicate in rapid-fire bursts of excitement.",
                        vibe: "Electric & Chaotic"
                      },
                      balanced: {
                        title: "Zenith Emerald",
                        gradient: "from-emerald-500 via-teal-600 to-blue-600",
                        desc: "Calm, steady, balanced connection. A harmonious pace of chat, with reliable response rhythms and structured, meaningful engagement.",
                        vibe: "Harmonious & Grounded"
                      }
                    }[aura.theme];

                    return (
                      <div className="flex flex-col justify-between h-full py-12 text-left w-full relative overflow-hidden">
                        <div className="space-y-8 z-10 w-full">
                          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-white">
                            Your Sensory Visualization: What does your chat vibe feel like?
                          </p>
                        </div>

                        {/* Static Glow Orb in Background */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
                          <div className={`w-[600px] h-[600px] rounded-full blur-[80px] opacity-75 bg-gradient-to-tr ${config.gradient}`} />
                        </div>

                        {/* Frosted Lens Card */}
                        <div className="bg-white/10 border border-white/20 rounded-[45px] p-12 shadow-2xl z-10 w-[750px] my-auto mx-auto flex flex-col gap-6 text-white" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
                          <div className="border-b border-white/10 pb-4">
                            <span className="text-sm font-mono tracking-widest text-[#8B5CF6] font-bold uppercase block">YOUR CHAT AURA</span>
                            <h2 className="font-sans text-6xl font-extrabold tracking-tight mt-2 text-white">
                              {config.title}
                            </h2>
                            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full border border-white/5">
                              Vibe: {config.vibe}
                            </span>
                          </div>

                          <p className="text-xl leading-relaxed text-neutral-200 font-sans font-light">
                            {config.desc}
                          </p>
                        </div>

                        {/* Stats breakdown */}
                        <div className="bg-black/25 rounded-[32px] p-8 border border-white/5 space-y-3 z-10 w-full text-base text-neutral-300 font-sans max-w-[800px]">
                          <div className="flex justify-between items-center border-b pb-3 border-white/5">
                            <span className="font-mono uppercase text-xs text-neutral-400 tracking-wider">MIDNIGHT CONVERSATIONS</span>
                            <span className="font-mono font-bold text-neutral-100 text-lg">{Math.round(aura.midnightRatio * 100)}% of chat</span>
                          </div>
                          <div className="flex justify-between items-center border-b pb-3 border-white/5">
                            <span className="font-mono uppercase text-xs text-neutral-400 tracking-wider">NOTIFICATION BOMBS</span>
                            <span className="font-mono font-bold text-neutral-100 text-lg">{aura.totalBombs} lock-screen spikes</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-mono uppercase text-xs text-[#8B5CF6] tracking-wider font-bold">PULSE RATE FREQUENCY</span>
                            <span className="font-mono font-bold text-[#8B5CF6] text-lg">{Math.min(3, 1 + (aura.panicRatio * 15)).toFixed(1)}x speed</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {slideIndex === 19 && (() => {
                    const timeline = results.monthlyTimeline || [];
                    const maxMonthCount = Math.max(...timeline.map(t => t.totalCount || 1));

                    let maxVal = -1;
                    let maxIdx = 0;
                    timeline.forEach((t, idx) => {
                      if (t.totalCount > maxVal) {
                        maxVal = t.totalCount;
                        maxIdx = idx;
                      }
                    });
                    const activeMonth = timeline[maxIdx];

                    return (
                      <div className="flex flex-col justify-between h-full py-12 text-left w-full relative z-20">
                        <div className="space-y-8 z-10 w-full">
                          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                            Your Chat Heatmap: Scrub over the months to reveal memories.
                          </p>
                        </div>

                        {/* Floating Peak Month Tooltip Memory Flashback Card */}
                        <div className="w-[700px] bg-white rounded-[40px] p-8 shadow-2xl border border-neutral-100 flex flex-col gap-5 mx-auto my-auto z-30">
                          <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                            <div>
                              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block">YEAR ABSOLUTE PEAK</span>
                              <h4 className="text-2xl font-sans font-extrabold text-neutral-800 leading-none mt-1">{activeMonth?.peakDay?.dateStr || 'N/A'}</h4>
                            </div>
                            <span className="font-mono text-xl font-bold text-neutral-500 bg-neutral-100 px-4 py-1.5 rounded-full">{activeMonth?.peakDay?.count || 0} texts</span>
                          </div>

                          {/* Flashback message bubble */}
                          <div className="flex flex-col text-left bg-orange-50/50 rounded-[28px] p-6 border border-orange-100/50">
                            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest leading-none mb-2">FLASHBACK MESSAGE</span>
                            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">{activeMonth?.peakDay?.flashback?.sender || 'N/A'}</p>
                            <p className="text-lg font-serif italic leading-snug text-neutral-850">
                              "${activeMonth?.peakDay?.flashback?.message || 'N/A'}"
                            </p>
                          </div>
                        </div>

                        {/* Static Bar Chart */}
                        <div className="space-y-4 w-full z-20 max-w-[900px] mx-auto">
                          <div className="h-64 flex items-end justify-between gap-3 w-full bg-neutral-900/5 rounded-[36px] p-8 border border-black/5">
                            {timeline.map((t, idx) => {
                              const heightPct = Math.max(10, Math.round((t.totalCount / maxMonthCount) * 100));
                              const isActive = idx === maxIdx;
                              return (
                                <div key={t.monthIndex} className="flex-grow flex flex-col items-center h-full justify-end">
                                  <div
                                    className="w-full rounded-t-xl"
                                    style={{
                                      height: `${heightPct}%`,
                                      backgroundColor: isActive ? '#E95D3C' : 'rgba(47, 35, 29, 0.2)'
                                    }}
                                  />
                                  <span className="text-xs font-mono mt-2 font-bold" style={{ color: isActive ? '#E95D3C' : '#7A6458' }}>
                                    {t.monthName.substring(0, 3)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
                          Timeline represents monthly text volumes. Scrubbing highlights the peak day of the month and pulls a random flashback message sent on that day.
                        </p>
                      </div>
                    );
                  })()}

                  {slideIndex === 20 && (
                    <div className="flex flex-col justify-between h-full py-12 text-left w-full items-center">
                      <div className="space-y-4 text-left w-full">
                        <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
                          Now you're wrapping the year. Here is your conversational retro.
                        </p>
                      </div>

                      {/* Summary Table Card */}
                      <div className="border p-12 rounded-[45px] space-y-8 shadow-2xl w-[700px] relative overflow-hidden bg-white/95 z-20" style={{ borderColor: 'rgba(0,0,0,0.02)' }}>
                        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-neutral-400" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-neutral-400" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-neutral-400" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-neutral-400" />

                        <div className="text-center border-b pb-6" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                          <span className="font-serif italic text-3xl font-bold text-neutral-800">2026 Retro Summary</span>
                        </div>

                        <div className="space-y-5 text-lg text-neutral-700 font-sans">
                          <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">MESSAGES</span>
                            <span className="font-mono font-bold text-neutral-800 text-2xl">{results.totalMessages.toLocaleString()}</span>
                          </div>

                          <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">DAYS TEXTING</span>
                            <span className="font-serif italic font-medium text-neutral-800 text-2xl">{results.longevityDays} Days</span>
                          </div>

                          <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">👑 THE YAPPER</span>
                            <span className="font-serif font-medium text-neutral-800 text-2xl">{results.yapper?.name || 'N/A'}</span>
                          </div>

                          <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">MAX REPLY GAP</span>
                            <span className="font-mono font-bold text-neutral-800 text-xl">
                              {results.theGhoster ? formatDuration(results.theGhoster.gapMs) : '0 mins'}
                            </span>
                          </div>

                          <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">PEAK HOUR</span>
                            <span className="font-serif text-xl font-medium text-neutral-800">{results.peakTraffic.text}</span>
                          </div>

                          {results.totalVoiceNotesCount > 0 && (
                            <>
                              <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">🎙️ VOICE NOTES</span>
                                <span className="font-mono font-bold text-neutral-800 text-2xl">
                                  {results.totalVoiceNotesCount} ({formatDuration(results.totalVoiceNotesDuration * 1000)})
                                </span>
                              </div>

                              <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">👑 PODCASTER</span>
                                <span className="font-serif font-medium text-neutral-800 text-2xl truncate max-w-[320px]">
                                  {results.topVoiceNoteSender?.name || 'N/A'} ({results.topVoiceNoteSender?.count} VNs)
                                </span>
                              </div>

                              <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                                <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">⏱️ LONGEST VN</span>
                                <span className="font-serif font-medium text-neutral-800 text-2xl truncate max-w-[320px]">
                                  {results.longestVoiceNote ? `${results.longestVoiceNote.name} (${formatDuration(results.longestVoiceNote.durationSec * 1000)})` : 'N/A'}
                                </span>
                              </div>
                            </>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">TOP EMOJIS</span>
                            <span className="flex gap-4 font-medium text-neutral-800 text-xl">
                              <span>{senderA}: {results.emojiDependency[senderA]?.emoji || "❤️"}</span>
                              <span>{senderB}: {results.emojiDependency[senderB]?.emoji || "❤️"}</span>
                              {isGroup && senderC && <span>{senderC}: {results.emojiDependency[senderC]?.emoji || "❤️"}</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* PDF Home indicator decoration */}
                <div className="w-full z-10 flex justify-center pb-8">
                  <div className="h-2 w-48 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.08)' }} />
                </div>
              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default App;
