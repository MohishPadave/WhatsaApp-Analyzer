import { motion, AnimatePresence } from 'framer-motion';
import { calculateChatAura, formatDuration } from '../../utils/helpers';

export function ChatAuraSlide({
  isExport,
  results,
  staggerContainer,
  slideFadeUp
}) {
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

  const radialGradients = {
    midnight: "radial-gradient(circle, rgba(124, 58, 237, 0.8) 0%, rgba(67, 56, 202, 0.4) 45%, rgba(30, 58, 138, 0) 70%)",
    active: "radial-gradient(circle, rgba(249, 115, 22, 0.8) 0%, rgba(220, 38, 38, 0.4) 45%, rgba(245, 158, 11, 0) 70%)",
    balanced: "radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(13, 148, 136, 0.4) 45%, rgba(37, 99, 235, 0) 70%)"
  };
  const radialGradient = radialGradients[aura.theme] || radialGradients.balanced;

  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full relative overflow-hidden">
        <div className="space-y-8 z-10 w-full">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-white">
            Your Sensory Visualization: What does your chat vibe feel like?
          </p>
        </div>

        {/* Static Glow Orb in Background using radial-gradient to support html2canvas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
          <div
            className="w-[800px] h-[800px] rounded-full opacity-75"
            style={{ background: radialGradient }}
          />
        </div>

        {/* Frosted Lens Card */}
        <div className="rounded-[45px] p-12 shadow-2xl z-10 w-[750px] my-auto mx-auto flex flex-col gap-6 text-white border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <div className="pb-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <span className="text-sm font-mono tracking-widest text-[#8B5CF6] font-bold uppercase block">YOUR CHAT AURA</span>
            <h2 className="font-sans text-6xl font-extrabold tracking-tight mt-2 text-white">
              {config.title}
            </h2>
            <span className="inline-block mt-4 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              Vibe: {config.vibe}
            </span>
          </div>

          <p className="text-xl leading-relaxed text-neutral-200 font-sans font-light">
            {config.desc}
          </p>
        </div>

        {/* Stats breakdown */}
        <div className="rounded-[32px] p-8 border space-y-3 z-10 w-full text-base text-neutral-300 font-sans max-w-[800px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
          <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
            <span className="font-mono uppercase text-xs text-neutral-400 tracking-wider">MIDNIGHT CONVERSATIONS</span>
            <span className="font-mono font-bold text-neutral-100 text-lg">{Math.round(aura.midnightRatio * 100)}% of chat</span>
          </div>
          <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
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
  }

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
}

export function HeatmapSlide({
  isExport,
  results,
  scrubMonth,
  setScrubMonth,
  setIsPaused,
  staggerContainer,
  slideFadeUp
}) {
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

  if (isExport) {
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
          <div className="flex flex-col text-left rounded-[28px] p-6 border" style={{ backgroundColor: 'rgba(255, 247, 237, 0.5)', borderColor: 'rgba(254, 215, 170, 0.5)' }}>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest leading-none mb-2">FLASHBACK MESSAGE</span>
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">{activeMonth?.peakDay?.flashback?.sender || 'N/A'}</p>
            <p className="text-lg font-serif italic leading-snug text-neutral-850">
              "{activeMonth?.peakDay?.flashback?.message || 'N/A'}"
            </p>
          </div>
        </div>

        {/* Static Bar Chart */}
        <div className="space-y-4 w-full z-20 max-w-[900px] mx-auto">
          <div className="h-64 flex items-end justify-between gap-3 w-full rounded-[36px] p-8 border" style={{ backgroundColor: 'rgba(23, 23, 23, 0.05)', borderColor: 'rgba(0, 0, 0, 0.05)' }}>
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
  }

  const activeIndex = scrubMonth !== null ? scrubMonth : maxIdx;
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
                <p className="text-[11px] font-serif italic leading-snug text-neutral-850">
                  "{activeMonth.peakDay.flashback.message}"
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
}

export function SummarySlide({
  isGroup,
  isExport,
  results,
  senderA,
  senderB,
  senderC,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full items-center">
        <div className="space-y-4 text-left w-full">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Now you're wrapping the year. Here is your conversational retro.
          </p>
        </div>

        {/* Summary Table Card Wrapper */}
        <div className="w-full flex justify-center my-auto">
          {/* Summary Table Card */}
          <div className="border p-12 rounded-[45px] space-y-8 shadow-2xl w-[700px] relative overflow-hidden z-20" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: 'rgba(0, 0, 0, 0.02)' }}>
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

              {results.yapper?.count > 0 && results.yapper?.name && (
                <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">👑 THE YAPPER</span>
                  <span className="font-serif font-medium text-neutral-800 text-2xl">{results.yapper.name}</span>
                </div>
              )}

              {results.theGhoster?.gapMs > 0 && (
                <div className="flex justify-between items-center border-b pb-3 border-neutral-100">
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-400 font-bold">MAX REPLY GAP</span>
                  <span className="font-mono font-bold text-neutral-800 text-xl">
                    {formatDuration(results.theGhoster.gapMs)}
                  </span>
                </div>
              )}

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
      </div>
    );
  }

  return (
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

      {/* On-screen Preview Card Wrapper */}
      <div className="my-auto flex justify-center w-full z-20">
        {/* On-screen Preview Card */}
        <div
          className={`border shadow-xl max-w-[320px] w-full relative overflow-hidden bg-white/95 ${results.totalVoiceNotesCount > 0 ? 'p-3 rounded-[16px] space-y-2' : 'p-4 rounded-[20px] space-y-3'
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

          {results.yapper?.count > 0 && results.yapper?.name && (
            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">👑 THE YAPPER</span>
              <span className="font-serif font-medium text-neutral-800 truncate max-w-[110px]">{results.yapper.name}</span>
            </div>
          )}

          {results.theGhoster?.gapMs > 0 && (
            <div className={`flex justify-between items-center border-b ${results.totalVoiceNotesCount > 0 ? 'pb-0.5' : 'pb-1'} border-neutral-100`}>
              <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 font-bold">MAX REPLY GAP</span>
              <span className="font-mono font-bold text-neutral-800 text-[10px]">
                {formatDuration(results.theGhoster.gapMs)}
              </span>
            </div>
          )}

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
    </div>
  </motion.div>
  );
}

export function ThankYouSlide({
  isExport,
  staggerContainer,
  slideFadeUp,
  onOpenFeedback
}) {
  if (isExport) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-between h-full py-12 px-6 text-center w-full z-10 relative"
    >
      <div className="flex-grow flex flex-col justify-center items-center space-y-6">
        <motion.div
          variants={slideFadeUp}
          className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-violet-500/20"
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </motion.div>

        <motion.h2
          variants={slideFadeUp}
          className="text-4xl font-serif font-black text-white tracking-tight"
        >
          That's a Wrap!
        </motion.h2>

        <motion.p
          variants={slideFadeUp}
          className="text-sm font-sans font-light text-neutral-300 leading-relaxed max-w-[280px]"
        >
          Thanks for reliving your chat chaos with us. We hope you're still speaking to each other!
        </motion.p>
        
        <motion.p
          variants={slideFadeUp}
          className="text-[10px] font-mono text-violet-400 font-bold uppercase tracking-wider"
        >
          Verdict: A relationship built on text messages and mutual yapping.
        </motion.p>
      </div>

      <motion.div
        variants={slideFadeUp}
        className="w-full flex flex-col space-y-3 items-center z-20"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenFeedback();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          className="w-full max-w-[280px] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-sans font-semibold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          Share Feedback
        </button>
      </motion.div>
    </motion.div>
  );
}

