import { motion } from 'framer-motion';

export function CoverSlide({ isGroup, isExport, staggerContainer, slideFadeUp, creatorName, recipientName }) {
  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            {isGroup ? "Here is your year in review with your group." : "Here is your year in review with your favorite person."}
          </p>
          <div className="space-y-2">
            <h2 className="font-sans text-[120px] font-extrabold tracking-tighter leading-none text-neutral-900">
              2026
            </h2>
            <p className="text-xl uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
              Wrapped • Year in Review
            </p>
          </div>
        </div>

        {/* Center "ft. whatsapp" block for high-res export */}
        <div className="flex flex-col items-center justify-center flex-grow py-8 -translate-y-10">
          {(creatorName || recipientName) && (
            <p className="text-xl font-mono text-neutral-500 tracking-wide font-medium text-center mb-4">
              ❤️ Made with love {creatorName ? `by ${creatorName}` : ''}{recipientName ? ` for ${recipientName}` : ''}
            </p>
          )}
          <h1 className="font-sans text-[80px] font-black tracking-tighter text-neutral-900 leading-none text-center">
            ft. <span className="text-[#25D366]">whatsapp</span>
          </h1>
        </div>

        <div className="mb-12 space-y-4">
          <p className="text-xl font-sans font-light text-neutral-600 leading-relaxed max-w-[650px]">
            Unpack the reply logs, dialogue volumes, and habits that defined your {isGroup ? 'group chat' : 'chat thread'} this year.
          </p>
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

      {/* Center "ft. whatsapp" block for slideshow screen */}
      <motion.div 
        variants={slideFadeUp}
        className="flex flex-col items-center justify-center flex-grow py-4 -translate-y-6"
      >
        {(creatorName || recipientName) && (
          <p className="text-[10px] font-mono text-neutral-500 tracking-wide font-semibold text-center mb-2">
            ❤️ Made with love {creatorName ? `by ${creatorName}` : ''}{recipientName ? ` for ${recipientName}` : ''}
          </p>
        )}
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-neutral-900 leading-none select-none text-center">
          ft. <span className="text-[#25D366]">whatsapp</span>
        </h1>
      </motion.div>

      <motion.div variants={slideFadeUp} className="mb-8 space-y-2">
        <p className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px]">
          Unpack the reply logs, dialogue volumes, and habits that defined your {isGroup ? 'group chat' : 'chat thread'} this year.
        </p>
      </motion.div>
    </motion.div>
  );
}

export function VolumeSlide({
  isGroup,
  isExport,
  results,
  percentA,
  percentB,
  senderA,
  senderB,
  countA,
  countB,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            {isGroup ? "You all connected more than ever before. Every conversation, counted." : "You connected more than ever before. Every conversation, counted."}
          </p>
          <div className="space-y-2">
            <h2 className="font-sans text-[100px] font-extrabold tracking-tighter leading-none text-neutral-900">
              {results.totalMessages.toLocaleString()}
            </h2>
            <p className="text-xl uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
              messages exchanged
            </p>
          </div>
        </div>

        {isGroup ? (
          <div className="rounded-3xl p-8 shadow-md space-y-6 w-full max-w-[650px] mx-auto border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="flex justify-between items-center text-sm font-mono tracking-wider text-neutral-500 font-bold uppercase">
              <span>TOP CONTRIBUTORS</span>
              <span className="text-[#0066FF] font-bold">{results.sendersList.length} members</span>
            </div>

            <div className="space-y-4">
              {results.sendersList.slice(0, 3).map((sender, idx) => {
                const count = results.senderCounts[sender] || 0;
                const pct = Math.round((count / results.totalMessages) * 100);
                const barColors = ['bg-[#0066FF]', 'bg-[#E95D3C]', 'bg-[#10B981]'];

                return (
                  <div key={sender} className="space-y-2">
                    <div className="flex justify-between text-base font-semibold text-neutral-800">
                      <span className="truncate max-w-[350px]">{idx + 1}. {sender}</span>
                      <span className="font-mono text-sm text-neutral-500 font-bold">{count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div className={`h-full ${barColors[idx] || 'bg-neutral-400'} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl p-8 shadow-md space-y-6 w-full max-w-[650px] mx-auto border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
            <div className="flex justify-between items-center text-sm font-mono tracking-wider text-neutral-500 font-bold uppercase">
              <span>MESSAGE SHARE</span>
              <span className="text-[#0066FF] font-extrabold">{percentA}% vs {percentB}%</span>
            </div>

            <div className="h-6 w-full bg-neutral-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-[#0066FF] transition-all" style={{ width: `${percentA}%` }} />
              <div className="h-full bg-[#E95D3C] transition-all" style={{ width: `${percentB}%` }} />
            </div>

            <div className="flex justify-between text-base font-sans">
              <div className="flex flex-col text-left">
                <span className="font-semibold text-neutral-800 truncate max-w-[250px]">{senderA}</span>
                <span className="text-sm text-neutral-500 font-mono">{countA.toLocaleString()} texts</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="font-semibold text-neutral-800 truncate max-w-[250px]">{senderB}</span>
                <span className="text-sm text-neutral-500 font-mono">{countB.toLocaleString()} texts</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-xl font-sans font-light text-neutral-600 leading-relaxed max-w-[650px] mb-3">
          Exchanged over <span className="font-semibold text-neutral-800">{results.longevityDays} days</span> of chatting. That's a total word count of <span className="font-semibold text-neutral-800">{results.totalWordCount.toLocaleString()}</span> words!
        </p>
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
            <div className="flex flex-col text-left">
              <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderA}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{countA.toLocaleString()} texts</span>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="font-semibold text-neutral-800 truncate max-w-[120px]">{senderB}</span>
              <span className="text-[10px] text-neutral-500 font-mono">{countB.toLocaleString()} texts</span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.p
        variants={slideFadeUp}
        className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-1"
      >
        Exchanged over <span className="font-semibold text-neutral-800">{results.longevityDays} days</span> of chatting. That's a total word count of <span className="font-semibold text-neutral-800">{results.totalWordCount.toLocaleString()}</span> words!
      </motion.p>
    </motion.div>
  );
}

export function PeakTrafficSlide({
  isExport,
  results,
  activeStyle,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Your weekly peak traffic hour when the chat really came alive.
          </p>
          <div className="space-y-2">
            <h2 className="font-sans text-[100px] font-extrabold tracking-tighter leading-none text-neutral-900">
              {results.peakTraffic.day}s
            </h2>
            <h2 className="font-sans text-[75px] font-extrabold tracking-tighter leading-none" style={{ color: activeStyle.accent }}>
              at {results.peakTraffic.hour}
            </h2>
            <p className="text-xl uppercase tracking-widest font-mono text-neutral-500 font-bold mt-1">
              peak connection window
            </p>
          </div>
        </div>

        {/* Weekly Rhythm Grid */}
        <div className="rounded-3xl p-8 shadow-md space-y-8 w-full max-w-[650px] mx-auto border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
          <div className="text-sm font-mono tracking-wider text-neutral-500 font-bold uppercase">
            WEEKLY RHYTHM
          </div>

          <div className="flex justify-between items-center px-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => {
              const isActiveDay = results?.peakTraffic?.day?.startsWith(d);
              return (
                <div key={d} className="flex flex-col items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                      isActiveDay
                        ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 scale-110 ring-4 ring-white'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {d[0]}
                  </div>
                  <span className={`text-[11px] font-mono font-bold uppercase ${isActiveDay ? 'text-blue-600 font-extrabold' : 'text-neutral-500'}`}>{d}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-6 p-5 rounded-2xl border" style={{ backgroundColor: 'rgba(245, 245, 245, 0.5)', borderColor: 'rgba(244, 244, 245, 0.6)' }}>
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-4xl shadow-inner">
              ⏰
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-semibold text-neutral-800">Peak Hour: {results?.peakTraffic?.hour}</span>
              <span className="text-sm text-neutral-500 font-medium">When your chat bursts into life</span>
            </div>
          </div>
        </div>

        <p className="text-xl font-sans font-light text-neutral-600 leading-relaxed max-w-[650px] mb-12">
          {results.peakTraffic.text}
        </p>
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
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isActiveDay
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
          <div className="flex flex-col text-left">
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
  );
}
