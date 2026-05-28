import { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import {
  FileText,
  Download,
  RefreshCw,
  Play,
  Pause,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { formatDuration } from './utils/helpers';
import {
  CoverSlide,
  VolumeSlide,
  PeakTrafficSlide,
  YapperSlide,
  GhosterSlide,
  SpeedRacerSlide,
  NotificationBomberSlide,
  MidnightPhilosopherSlide,
  InitiatorSlide,
  ChatCPRSlide,
  DrySpellSlide,
  MediaMogulSlide,
  TextMediaRatioSlide,
  VoiceNotesSlide,
  VocabularySlide,
  SlangCorporateSlide,
  PanicStationSlide,
  HyperFixationSlide,
  ChatAuraSlide,
  HeatmapSlide,
  SummarySlide,
  DeveloperSlide,
  ThankYouSlide
} from './components/slides';

const SLIDE_DURATION = 7000; // 7 seconds per slide for reading detailed roasts


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
  },
  { // Slide 21 (Optional: Developer Slide / Code Spammer)
    bg: '#0F172A',
    text: '#F8FAFC',
    secondaryText: '#94A3B8',
    accent: '#38BDF8',
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Futuristic circuit board loops */}
        <svg className="absolute bottom-[-100px] right-[-50px] w-[110%] h-[55%] opacity-15" viewBox="0 0 350 350" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="120" stroke="#38BDF8" strokeWidth="6" strokeDasharray="10 15" />
          <circle cx="200" cy="200" r="90" stroke="#38BDF8" strokeWidth="4" strokeDasharray="5 5" />
          <line x1="200" y1="200" x2="110" y2="110" stroke="#38BDF8" strokeWidth="4" />
          <rect x="100" y="100" width="20" height="20" fill="#38BDF8" fillOpacity="0.3" />
          <rect x="140" y="140" width="10" height="10" fill="#38BDF8" fillOpacity="0.3" />
        </svg>
      </div>
    )
  },
  { // Slide 22 (Thank You & Feedback Slide)
    bg: '#090D16', // Ultra deep space blue
    text: '#F8FAFC',
    secondaryText: '#94A3B8',
    accent: '#8B5CF6', // Purple/Violet accent
    shapes: (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft glowing circles and intersecting organic lines */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-emerald-600/10 blur-[150px]" />
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 360 640" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="180" cy="320" r="150" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="180" cy="320" r="220" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M 0 320 Q 180 180 360 320" stroke="#8B5CF6" strokeWidth="2" />
          <path d="M 0 320 Q 180 460 360 320" stroke="#10B981" strokeWidth="2" />
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

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackIssue, setFeedbackIssue] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [feedbackError, setFeedbackError] = useState('');

  const workerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const holdStartRef = useRef(0);
  const touchStartRef = useRef(null);
  const confettiFiredRef = useRef(false);

  const activeSlides = useMemo(() => {
    if (!results) return [];

    const allSlides = [
      { id: 'cover', styleIndex: 0 },
      { id: 'volume', styleIndex: 1 },
      { id: 'peak', styleIndex: 2 },
      {
        id: 'yapper',
        styleIndex: 3,
        show: results.yapper?.count > 0 && results.yapper?.name
      },
      {
        id: 'ghoster',
        styleIndex: 4,
        show: results.theGhoster?.gapMs > 0
      },
      {
        id: 'speedracer',
        styleIndex: 5,
        show: Object.values(results.medianResponseTimes || {}).some(t => t > 0)
      },
      {
        id: 'notificationbomber',
        styleIndex: 6,
        show: Object.values(results.notificationBombs || {}).some(c => c > 0)
      },
      {
        id: 'midnight',
        styleIndex: 7,
        show: results.totalMidnightMessages > 0
      },
      {
        id: 'initiator',
        styleIndex: 8,
        show: results.topInitiator?.count > 0 && results.topInitiator?.name
      },
      {
        id: 'cpr',
        styleIndex: 9,
        show: Object.values(results.resuscitationCounts || {}).some(c => c > 0)
      },
      {
        id: 'dryspell',
        styleIndex: 10,
        show: results.drySpell?.days > 0
      },
      {
        id: 'mediamogul',
        styleIndex: 11,
        show: results.topMediaMogul?.count > 0 && results.topMediaMogul?.name
      },
      {
        id: 'textmediaratio',
        styleIndex: 12,
        show: Object.values(results.mediaRatios || {}).some(r => r > 0)
      },
      {
        id: 'voicenotes',
        styleIndex: 13,
        show: results.totalVoiceNotesCount > 0
      },
      {
        id: 'vocabulary',
        styleIndex: 14,
        show: results.vocabulary && Object.values(results.vocabulary).some(arr => arr.length > 0)
      },
      {
        id: 'slangcorporate',
        styleIndex: 15,
        show: Object.values(results.slangCounts || {}).some(c => c > 0) || Object.values(results.corporateCounts || {}).some(c => c > 0)
      },
      {
        id: 'panicstation',
        styleIndex: 16,
        show: Object.values(results.panicCounts || {}).some(c => c > 0)
      },
      {
        id: 'hyperfixation',
        styleIndex: 17,
        show: results.hyperFixation?.count > 0
      },
      { id: 'chataura', styleIndex: 18 },
      { id: 'heatmap', styleIndex: 19 },
      {
        id: 'developer',
        styleIndex: 21,
        show: results.codeStats?.hasCode
      },
      { id: 'summary', styleIndex: 20 },
      { id: 'thankyou', styleIndex: 22 }
    ];

    return allSlides.filter(slide => slide.show !== false);
  }, [results]);

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
        confettiFiredRef.current = false;
      } else if (status === 'error') {
        setIsLoading(false);
        setError(error || 'An error occurred during parsing');
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Confetti trigger when first slide appears (only once per file upload)
  // Uses a dedicated canvas appended to document.body to bypass overflow:hidden on mobile
  useEffect(() => {
    if (activeSlide === 0 && results && !confettiFiredRef.current) {
      confettiFiredRef.current = true;

      // Create a dedicated full-screen canvas for confetti
      const canvas = document.createElement('canvas');
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '99999';
      // Set actual pixel dimensions for high-DPI / mobile screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      document.body.appendChild(canvas);

      // Create a confetti instance bound to our canvas
      const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

      // Staggered bursts for a production-grade effect
      // Burst 1: Left corner
      myConfetti({
        particleCount: 60,
        angle: 315,
        spread: 60,
        origin: { x: 0, y: 0 },
        colors: ['#25d366', '#3de273', '#66ff8e', '#ffffff', '#D4AF37'],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.2,
        drift: 0.5,
      });
      // Burst 2: Right corner
      myConfetti({
        particleCount: 60,
        angle: 225,
        spread: 60,
        origin: { x: 1, y: 0 },
        colors: ['#25d366', '#3de273', '#66ff8e', '#ffffff', '#D4AF37'],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.2,
        drift: -0.5,
      });

      // Burst 3: Delayed center shower
      setTimeout(() => {
        myConfetti({
          particleCount: 100,
          angle: 270,
          spread: 100,
          origin: { x: 0.5, y: -0.05 },
          colors: ['#25d366', '#3de273', '#66ff8e', '#ffffff', '#fe6a34', '#D4AF37'],
          ticks: 250,
          gravity: 1,
          scalar: 1.1,
        });
      }, 150);

      // Burst 4: Second wave for fullness
      setTimeout(() => {
        myConfetti({
          particleCount: 40,
          angle: 300,
          spread: 50,
          origin: { x: 0.15, y: 0 },
          colors: ['#25d366', '#3de273', '#D4AF37', '#ffffff'],
          ticks: 180,
          gravity: 0.9,
          scalar: 1,
        });
        myConfetti({
          particleCount: 40,
          angle: 240,
          spread: 50,
          origin: { x: 0.85, y: 0 },
          colors: ['#25d366', '#3de273', '#D4AF37', '#ffffff'],
          ticks: 180,
          gravity: 0.9,
          scalar: 1,
        });
      }, 350);

      // Clean up the canvas after all particles have settled
      setTimeout(() => {
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }, 5000);
    }
  }, [activeSlide, results]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => {
      const maxSlide = activeSlides.length > 0 ? activeSlides.length - 1 : 0;
      if (prev < maxSlide) {
        setSlideProgress(0);
        return prev + 1;
      } else {
        setIsPaused(true);
        return maxSlide;
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

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackName.trim() || !feedbackEmail.trim() || !feedbackIssue.trim()) {
      setFeedbackStatus('error');
      setFeedbackError('Please fill out all fields.');
      return;
    }

    setFeedbackStatus('loading');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'c6bf9d1d-641a-4813-aa81-feecea9a15d7',
          name: feedbackName,
          email: feedbackEmail,
          message: feedbackIssue,
          subject: 'WhatsApp Wrapped - User Feedback'
        })
      });

      const data = await response.json();
      if (data.success) {
        setFeedbackStatus('success');
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackIssue('');
      } else {
        setFeedbackStatus('error');
        setFeedbackError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setFeedbackStatus('error');
      setFeedbackError('Failed to submit. Please check your internet connection.');
    }
  };

  // Story playback timer
  useEffect(() => {
    const maxSlide = activeSlides.length > 0 ? activeSlides.length - 1 : 0;
    if (activeSlide < 0 || activeSlide > maxSlide || isPaused || isExporting) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSlide, isPaused, isExporting, activeSlides]);

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
    confettiFiredRef.current = false;
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

      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const scale = isMobile ? 2 : 3;

      const canvas = await html2canvas(cardElement, {
        scale: scale,
        backgroundColor: '#F4F1EA',
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: 1080,
        windowHeight: 1920,
        width: 1080,
        height: 1920,
        x: 0,
        y: 0
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

      const pdfSlides = activeSlides.filter(s => s.id !== 'thankyou');
      const totalSlides = pdfSlides.length;
      for (let i = 0; i < totalSlides; i++) {
        setExportMessage(`Capturing slide ${i + 1} of ${totalSlides}...`);
        const slideEl = document.getElementById(`pdf-slide-export-${i}`);
        if (slideEl) {
          // On mobile, display:none → display:flex inside overflow:hidden
          // causes the browser to lay out at viewport width, not 1080px.
          // Fix: position the element off-screen with fixed positioning and
          // explicit dimensions so the browser renders it at full 1080x1920.
          slideEl.style.display = 'flex';
          slideEl.style.position = 'fixed';
          slideEl.style.left = '-9999px';
          slideEl.style.top = '0';
          slideEl.style.width = '1080px';
          slideEl.style.minWidth = '1080px';
          slideEl.style.height = '1920px';
          slideEl.style.minHeight = '1920px';
          slideEl.style.overflow = 'hidden';
          slideEl.style.zIndex = '-1';
          await new Promise(r => setTimeout(r, 400));

          const currentStyle = SLIDE_STYLES[pdfSlides[i].styleIndex];

          const canvas = await html2canvas(slideEl, {
            scale: 2,
            backgroundColor: currentStyle.bg,
            useCORS: true,
            logging: false,
            windowWidth: 1080,
            windowHeight: 1920,
            width: 1080,
            height: 1920,
            x: 0,
            y: 0
          });

          // Reset element back to hidden
          slideEl.style.display = 'none';
          slideEl.style.position = '';
          slideEl.style.left = '';
          slideEl.style.top = '';
          slideEl.style.width = '';
          slideEl.style.minWidth = '';
          slideEl.style.height = '';
          slideEl.style.minHeight = '';
          slideEl.style.overflow = '';
          slideEl.style.zIndex = '';

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



  const activeStyle = (activeSlide >= 0 && activeSlides[activeSlide])
    ? SLIDE_STYLES[activeSlides[activeSlide].styleIndex]
    : { bg: '#050505', text: '#FFFFFF', secondaryText: '#999999', accent: '#0066FF', shapes: null };

  const activeSlideId = activeSlides[activeSlide]?.id;

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
                {Array.from({ length: activeSlides.length }).map((_, idx) => (
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
                    {activeSlideId === 'cover' && (
                      <CoverSlide
                        isGroup={isGroup}
                        isExport={false}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 1: Volume & Longevity */}
                    {activeSlideId === 'volume' && (
                      <VolumeSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        percentA={percentA}
                        percentB={percentB}
                        senderA={senderA}
                        senderB={senderB}
                        countA={countA}
                        countB={countB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 2: Peak Traffic */}
                    {activeSlideId === 'peak' && (
                      <PeakTrafficSlide
                        isExport={false}
                        results={results}
                        activeStyle={activeStyle}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 3: Speed & The Yapper */}
                    {activeSlideId === 'yapper' && (
                      <YapperSlide
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 4: Response Timings (The Ghoster) */}
                    {activeSlideId === 'ghoster' && (
                      <GhosterSlide
                        isExport={false}
                        results={results}
                        activeStyle={activeStyle}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 5: Speed Racer vs Snail */}
                    {activeSlideId === 'speedracer' && (
                      <SpeedRacerSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 6: Notification Bomber */}
                    {activeSlideId === 'notificationbomber' && (
                      <NotificationBomberSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 7: Midnight Philosopher */}
                    {activeSlideId === 'midnight' && (
                      <MidnightPhilosopherSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 8: The Initiator */}
                    {activeSlideId === 'initiator' && (
                      <InitiatorSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 9: Chat CPR Award */}
                    {activeSlideId === 'cpr' && (
                      <ChatCPRSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 10: Dry Spell Milestone */}
                    {activeSlideId === 'dryspell' && (
                      <DrySpellSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 11: The Media Mogul */}
                    {activeSlideId === 'mediamogul' && (
                      <MediaMogulSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 12: Text-to-Media Ratio */}
                    {activeSlideId === 'textmediaratio' && (
                      <TextMediaRatioSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 13: Voice Notes */}
                    {activeSlideId === 'voicenotes' && (
                      <VoiceNotesSlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 14: Vocabulary & Emojis */}
                    {activeSlideId === 'vocabulary' && (
                      <VocabularySlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 15: Slang Lord vs Corporate Dictator */}
                    {activeSlideId === 'slangcorporate' && (
                      <SlangCorporateSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 16: The Panic Station Index */}
                    {activeSlideId === 'panicstation' && (
                      <PanicStationSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 17: The Hyper-Fixation Phase */}
                    {activeSlideId === 'hyperfixation' && (
                      <HyperFixationSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 18: Chat Aura */}
                    {activeSlideId === 'chataura' && (
                      <ChatAuraSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 19: Heatmap Timeline */}
                    {activeSlideId === 'heatmap' && (
                      <HeatmapSlide
                        isExport={false}
                        results={results}
                        scrubMonth={scrubMonth}
                        setScrubMonth={setScrubMonth}
                        setIsPaused={setIsPaused}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 20: Developer Slide */}
                    {activeSlideId === 'developer' && (
                      <DeveloperSlide
                        isExport={false}
                        results={results}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 21: Summary Slide */}
                    {activeSlideId === 'summary' && (
                      <SummarySlide
                        isGroup={isGroup}
                        isExport={false}
                        results={results}
                        senderA={senderA}
                        senderB={senderB}
                        senderC={senderC}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                      />
                    )}

                    {/* Slide 22: Thank You Slide */}
                    {activeSlideId === 'thankyou' && (
                      <ThankYouSlide
                        isExport={false}
                        staggerContainer={staggerContainer}
                        slideFadeUp={slideFadeUp}
                        onOpenFeedback={() => {
                          setIsPaused(true);
                          setShowFeedbackModal(true);
                        }}
                      />
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Home indicator bar at bottom */}
              <div className="w-full z-20 pointer-events-none mt-1 flex justify-center pb-1">
                <div className="h-[4px] w-24 rounded-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }} />
              </div>

              {/* Pause Warning overlay */}
              {isPaused && !isExporting && activeSlide < activeSlides.length - 1 && (
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
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '0px',
            width: '1080px',
            height: '1920px',
            minWidth: '1080px',
            maxWidth: '1080px',
            minHeight: '1920px',
            maxHeight: '1920px',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: -1000
          }}
        >

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

                {results.yapper?.count > 0 && results.yapper?.name && (
                  <div className="space-y-1">
                    <span className="text-xs tracking-widest uppercase text-neutral-500 font-mono block">👑 THE YAPPER</span>
                    <h3 className="font-serif text-4xl font-medium italic" style={{ color: '#1A1A1A' }}>{results.yapper.name}</h3>
                    <p className="text-neutral-500 text-sm font-light">
                      Sent {results.yapper.count} consecutive messages
                    </p>
                  </div>
                )}

                {results.theGhoster?.gapMs > 0 && (
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

          {/* 2. MULTI-PAGE SLIDES FOR PDF EXPORTS (1080x1920 each, matched to slides count) */}
          {activeSlides.filter(s => s.id !== 'thankyou').map((slide, slideIndex, filteredSlides) => {
            const style = SLIDE_STYLES[slide.styleIndex];
            return (
              <div
                key={slide.id}
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
                  <span className="font-mono text-sm tracking-widest uppercase" style={{ opacity: 0.7 }}>
                    PAGE {slideIndex + 1 >= 10 ? slideIndex + 1 : '0' + (slideIndex + 1)} OF {filteredSlides.length}
                  </span>
                </div>

                {/* PDF Progress Indicators */}
                <div className="flex gap-2 w-full relative z-10 mb-8">
                  {Array.from({ length: filteredSlides.length }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[5px] flex-grow rounded-full overflow-hidden"
                      style={{ backgroundColor: idx <= slideIndex ? style.text : 'rgba(0, 0, 0, 0.08)' }}
                    />
                  ))}
                </div>

                {/* PDF Content Body */}
                <div className="my-auto relative z-10 flex flex-col justify-between items-start text-left w-full h-[1400px] px-6 pointer-events-none">
                  {slide.id === 'cover' && (
                    <CoverSlide
                      isGroup={isGroup}
                      isExport={true}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'volume' && (
                    <VolumeSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      percentA={percentA}
                      percentB={percentB}
                      senderA={senderA}
                      senderB={senderB}
                      countA={countA}
                      countB={countB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'peak' && (
                    <PeakTrafficSlide
                      isExport={true}
                      results={results}
                      activeStyle={style}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'yapper' && (
                    <YapperSlide
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'ghoster' && (
                    <GhosterSlide
                      isExport={true}
                      results={results}
                      activeStyle={style}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'speedracer' && (
                    <SpeedRacerSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'notificationbomber' && (
                    <NotificationBomberSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'midnight' && (
                    <MidnightPhilosopherSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'initiator' && (
                    <InitiatorSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'cpr' && (
                    <ChatCPRSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'dryspell' && (
                    <DrySpellSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'mediamogul' && (
                    <MediaMogulSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'textmediaratio' && (
                    <TextMediaRatioSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'voicenotes' && (
                    <VoiceNotesSlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'vocabulary' && (
                    <VocabularySlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'slangcorporate' && (
                    <SlangCorporateSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'panicstation' && (
                    <PanicStationSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'hyperfixation' && (
                    <HyperFixationSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'chataura' && (
                    <ChatAuraSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'heatmap' && (
                    <HeatmapSlide
                      isExport={true}
                      results={results}
                      scrubMonth={scrubMonth}
                      setScrubMonth={setScrubMonth}
                      setIsPaused={setIsPaused}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'developer' && (
                    <DeveloperSlide
                      isExport={true}
                      results={results}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
                  )}

                  {slide.id === 'summary' && (
                    <SummarySlide
                      isGroup={isGroup}
                      isExport={true}
                      results={results}
                      senderA={senderA}
                      senderB={senderB}
                      senderC={senderC}
                      staggerContainer={staggerContainer}
                      slideFadeUp={slideFadeUp}
                    />
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

      {/* Feedback Form Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#090D16]/95 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackStatus('idle');
                  setIsPaused(false);
                }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-sans font-bold">Feedback Form</h3>
                    <p className="text-xs text-neutral-400">We would love to hear your thoughts and improve!</p>
                  </div>
                </div>

                {feedbackStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-3"
                  >
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                      ✓
                    </div>
                    <h4 className="text-lg font-bold">Thank You!</h4>
                    <p className="text-sm text-neutral-300">Your feedback has been successfully submitted. We appreciate your support!</p>
                    <button
                      onClick={() => {
                        setShowFeedbackModal(false);
                        setFeedbackStatus('idle');
                        setIsPaused(false);
                      }}
                      className="mt-4 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      Close
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
                    <p className="text-xs text-neutral-300 italic bg-white/5 border border-white/5 p-3 rounded-2xl leading-relaxed">
                      Please let us know about any issues or bugs you faced while using the analyzer, so we can try to improve it in the future.
                    </p>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Name</label>
                      <input
                        type="text"
                        required
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="Your name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 text-white placeholder-neutral-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Email Address</label>
                      <input
                        type="email"
                        required
                        value={feedbackEmail}
                        onChange={(e) => setFeedbackEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 text-white placeholder-neutral-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Issues & Suggestions</label>
                      <textarea
                        required
                        rows="4"
                        value={feedbackIssue}
                        onChange={(e) => setFeedbackIssue(e.target.value)}
                        placeholder="Describe the issues or improvements..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-sans focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all duration-200 text-white placeholder-neutral-500 resize-none"
                      />
                    </div>

                    {feedbackStatus === 'error' && (
                      <p className="text-xs text-red-400 font-medium">{feedbackError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={feedbackStatus === 'loading'}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-sans font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {feedbackStatus === 'loading' ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
