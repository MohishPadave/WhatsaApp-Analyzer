import { motion } from 'framer-motion';
import { formatDuration } from '../../utils/helpers';

export function VocabularySlide({
  isGroup,
  isExport,
  results,
  senderA,
  senderB,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Your signature reactions and favorite words of the year.
          </p>
          <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
            {isGroup ? "Verdict: Senders are developing their own unique dialects. A vibrant dynamic." : `Verdict: ${senderA} is powered by emojis while ${senderB} runs on raw vocabulary.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 my-auto w-full z-20">
          {/* Sender A */}
          <div
            className="rounded-[40px] p-8 space-y-6 shadow-xl border border-neutral-100 flex flex-col justify-between h-[450px]"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
          >
            <div className="border-b pb-4 border-neutral-100">
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
          <div
            className="rounded-[40px] p-8 space-y-6 shadow-xl flex flex-col justify-between h-[450px] text-white"
            style={{ backgroundColor: 'rgb(28, 26, 23)' }}
          >
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
    );
  }

  return (
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
        <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
          {isGroup ? "Verdict: Senders are developing their own unique dialects." : `Verdict: ${senderA} is powered by emojis while ${senderB} runs on raw vocabulary.`}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 my-auto w-full z-20">
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
  );
}

export function SlangCorporateSlide({
  isExport,
  results,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    const slangKing = results.sendersList.reduce((a, b) => (results.slangCounts[a] || 0) > (results.slangCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
    const corpDictator = results.sendersList.reduce((a, b) => (results.corporateCounts[a] || 0) > (results.corporateCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
    const totalSlang = Object.values(results.slangCounts || {}).reduce((a, b) => a + b, 0);
    const totalCorp = Object.values(results.corporateCounts || {}).reduce((a, b) => a + b, 0);

    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-6">
          <p className="text-[44px] font-sans font-semibold leading-[1.2] max-w-[850px] text-neutral-800">
            Slang Lord vs. Corporate Dictator: Who writes like they are cold-emailing KPMG?
          </p>
          <p className="text-[28px] font-bold mt-2 leading-relaxed max-w-[800px]" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
            Verdict: {corpDictator} is 8.8x more likely to send a perfectly formatted email disguised as a text.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center w-full max-w-[850px] mx-auto">
          <div className="flex items-center justify-center gap-8 my-6">
            <div
              className="border-2 rounded-[40px] px-12 py-8 shadow-lg flex flex-col items-center flex-1"
              style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: 'rgba(234, 179, 8, 0.3)' }}
            >
              <span className="text-[64px] leading-none">💬</span>
              <span className="text-[56px] font-sans font-extrabold tracking-tight text-yellow-700 mt-2">{totalSlang}</span>
              <span className="text-[20px] uppercase tracking-[0.15em] font-mono text-yellow-600 font-bold mt-2">SLANG TERMS</span>
              <span className="text-[18px] font-sans text-neutral-500 mt-1 truncate max-w-[300px]">👑 {slangKing}</span>
            </div>
            <div
              className="border-2 rounded-[40px] px-12 py-8 shadow-lg flex flex-col items-center flex-1"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.10)', borderColor: 'rgba(59, 130, 246, 0.25)' }}
            >
              <span className="text-[64px] leading-none">💼</span>
              <span className="text-[56px] font-sans font-extrabold tracking-tight text-blue-700 mt-2">{totalCorp}</span>
              <span className="text-[20px] uppercase tracking-[0.15em] font-mono text-blue-600 font-bold mt-2">CORPORATE TERMS</span>
              <span className="text-[18px] font-sans text-neutral-500 mt-1 truncate max-w-[300px]">👑 {corpDictator}</span>
            </div>
          </div>

          <div
            className="border-2 rounded-[40px] p-12 shadow-lg space-y-6 w-full"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}
          >
            <div className="text-[24px] font-mono tracking-wider text-neutral-500 font-bold uppercase block mb-2">DIALECT BREAKDOWN</div>
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-5 border-r pr-6 border-neutral-200">
                <span className="text-[22px] font-mono font-bold text-yellow-600 uppercase">💬 SLANG TERMS</span>
                {results.sendersList.slice(0, 3).map((sender) => (
                  <div key={sender} className="flex justify-between text-[26px] text-neutral-700">
                    <span className="truncate max-w-[260px]">{sender}</span>
                    <span className="font-mono font-bold">{results.slangCounts[sender] || 0}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-5 pl-4">
                <span className="text-[22px] font-mono font-bold text-blue-600 uppercase">💼 CORPORATE TERMS</span>
                {results.sendersList.slice(0, 3).map((sender) => (
                  <div key={sender} className="flex justify-between text-[26px] text-neutral-700">
                    <span className="truncate max-w-[260px]">{sender}</span>
                    <span className="font-mono font-bold">{results.corporateCounts[sender] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[24px] font-sans font-light leading-relaxed max-w-[800px] text-neutral-500 mt-4">
          One of you communicates entirely in text slang acronyms (fr, rn, idk). The other ends every message with full punctuation.
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
          Slang Lord vs. Corporate Dictator: Who writes like they are cold-emailing KPMG?
        </p>
        {(() => {
          const corpDictator = results.sendersList.reduce((a, b) => (results.corporateCounts[a] || 0) > (results.corporateCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
          return (
            <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
              Verdict: {corpDictator} is 8.8x more likely to send a perfectly formatted email disguised as a text.
            </p>
          );
        })()}
      </motion.div>

      <div className="my-auto space-y-4 w-full z-20 flex flex-col justify-center">
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
  );
}

export function PanicStationSlide({
  isExport,
  results,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Who is Always Panicking? The Punctuation Chain Count.
          </p>
          {(() => {
            const panicWinner = results.sendersList.reduce((a, b) => (results.panicCounts[a] || 0) > (results.panicCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
            return (
              <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
                Verdict: {panicWinner} communicates in a constant state of typing-induced high blood pressure!!!
              </p>
            );
          })()}
        </div>
        <div
          className="border-2 rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}
        >
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
          Who is Always Panicking? The Punctuation Chain Count.
        </p>
        {(() => {
          const panicWinner = results.sendersList.reduce((a, b) => (results.panicCounts[a] || 0) > (results.panicCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
          return (
            <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
              Verdict: {panicWinner} communicates in a constant state of typing-induced high blood pressure!!!
            </p>
          );
        })()}
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
  );
}

export function HyperFixationSlide({
  isExport,
  results,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    return (
      <div className="relative flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Your Word Hyper-Fixation Phase: A linguistic spike that disappeared.
          </p>
          {results.hyperFixation && (
            <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
              Verdict: The word "{results.hyperFixation.word}" was declared the official currency of your relationship.
            </p>
          )}
        </div>
        {results.hyperFixation ? (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-[40px] p-10 shadow-lg z-20 text-center w-[90%] max-w-[700px]"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)', borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <h3 className="font-mono text-lg uppercase tracking-widest text-neutral-500 font-bold">IN {results.hyperFixation.monthName.toUpperCase()} YOU WENT CRAZY FOR</h3>
            <h2 className="font-sans text-6xl font-extrabold tracking-tighter text-pink-600 my-4">
              "{results.hyperFixation.word}"
            </h2>
            <p className="text-xl text-neutral-500 font-mono">
              Used {results.hyperFixation.count} times in one month
            </p>
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
            <p className="text-2xl font-light italic">No hyper-fixations detected.</p>
          </div>
        )}
        <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
          The single word that had a massive percentage spike in one specific month but virtually disappeared afterward. What happened there?
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="relative flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left"
    >
      <motion.div variants={slideFadeUp} className="space-y-3">
        <p className="text-[17px] font-sans font-medium leading-relaxed text-neutral-800 max-w-[280px]">
          Your Word Hyper-Fixation Phase: A linguistic spike that disappeared.
        </p>
        {results.hyperFixation && (
          <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
            Verdict: The word "{results.hyperFixation.word}" was declared the official currency of your relationship.
          </p>
        )}
      </motion.div>

      {results.hyperFixation ? (
        <motion.div
          variants={slideFadeUp}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-24px)] max-w-[340px] text-center bg-white/40 rounded-2xl border border-white/20 p-4 shadow-sm z-10 space-y-0"
        >
          <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold">IN {results.hyperFixation.monthName.toUpperCase()} YOU WENT CRAZY FOR</h3>
          <h2 className="font-sans text-4xl font-extrabold tracking-tighter text-pink-600 my-2">
            "{results.hyperFixation.word}"
          </h2>
          <p className="text-xs text-neutral-500 font-mono">
            Used {results.hyperFixation.count} times in one month
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={slideFadeUp}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center"
        >
          <p className="text-xs font-mono text-neutral-500">No hyper-fixations detected.</p>
        </motion.div>
      )}

      <motion.p
        variants={slideFadeUp}
        className="text-xs font-sans font-light text-neutral-600 leading-relaxed max-w-[290px] mb-8"
      >
        The single word that had a massive percentage spike in one specific month but virtually disappeared afterward. What happened there?
      </motion.p>
    </motion.div>
  );
}

export function DeveloperSlide({
  isExport,
  results,
  staggerContainer,
  slideFadeUp
}) {
  const stats = results?.codeStats;
  if (!stats) return null;

  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full text-slate-100">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-slate-200">
            The Monospace Envoy: Who spams the chat with actual source code?
          </p>
          <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(56, 189, 248, 0.9)' }}>
            Verdict: {stats.topCodeSpammer.name} is treating this WhatsApp chat like a GitHub pull request code review.
          </p>
        </div>

        <div
          className="border rounded-[45px] p-12 shadow-2xl space-y-8 w-[780px] my-auto mx-auto font-mono text-left relative overflow-hidden"
          style={{ backgroundColor: 'rgba(15, 20, 28, 0.9)', borderColor: 'rgba(51, 65, 85, 0.6)' }}
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-6">
            <div className="flex gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ff5f56' }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#27c93f' }} />
            </div>
            <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">whatsapp-terminal.js</span>
            <div className="w-16" />
          </div>

          <div className="space-y-6 text-xl">
            <p className="text-emerald-400">
              $ npm run analyze -- --mode=developer
            </p>
            <p className="text-slate-400">
              &gt; Running heuristics check on chat messages...<br />
              &gt; Found <span className="text-sky-400 font-bold">{stats.totalCodeMessages} code snippets / files</span> containing <span className="text-sky-400 font-bold">{stats.totalLinesOfCode} lines of code</span>.<br />
              &gt; Primary Syntax Detected: <span className="text-yellow-400 font-bold">{stats.topLanguage}</span>
            </p>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              <span className="text-purple-400 font-bold">const developers = &#123;</span>
              {results.sendersList.map(sender => {
                const count = stats.codeMessagesPerSender[sender] || 0;
                const lines = stats.linesOfCodePerSender[sender] || 0;
                return (
                  <div key={sender} className="pl-8 text-slate-300 flex justify-between">
                    <span>"{sender}":</span>
                    <span className="text-sky-300">
                      &#123; snippets: {count}, loc: {lines} &#125;,
                    </span>
                  </div>
                );
              })}
              <span className="text-purple-400 font-bold">&#125;;</span>
            </div>

            <p
              className="text-slate-400 italic border-l-4 border-sky-500 pl-4 py-2 mt-4 rounded-r-xl"
              style={{ backgroundColor: 'rgba(15, 23, 42, 0.3)' }}
            >
              "Chief Code Spammer: {stats.topCodeSpammer.name} (sent {stats.topCodeSpammer.count} snippets / files this year)"
            </p>
          </div>
        </div>

        <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-slate-400">
          Detected by scanning for monospace code blocks (```) and lines containing programming syntax operators or structures.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-between h-full pt-6 pb-2 px-3 text-left text-slate-200"
    >
      <motion.div variants={slideFadeUp} className="space-y-3">
        <p className="text-[17px] font-sans font-medium leading-relaxed text-slate-200 max-w-[280px]">
          The Monospace Envoy: Who spams the chat with actual source code?
        </p>
        <p className="text-[11px] font-bold text-sky-400/90 mt-1 leading-snug">
          Verdict: {stats.topCodeSpammer.name} is treating this WhatsApp chat like a GitHub pull request.
        </p>
      </motion.div>

      <motion.div
        variants={slideFadeUp}
        className="bg-[#0f141c]/95 border border-slate-700/50 rounded-2xl p-4 shadow-xl z-20 my-auto w-full font-mono text-[10px] text-left leading-relaxed relative overflow-hidden"
      >
        <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
            <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">whatsapp-terminal.js</span>
          <div className="w-8" />
        </div>

        <div className="space-y-3">
          <p className="text-emerald-400">$ npm run analyze -- --dev</p>
          <p className="text-slate-400">
            &gt; Found <span className="text-sky-400 font-bold">{stats.totalCodeMessages} files/snippets</span> ({stats.totalLinesOfCode} LOC).<br />
            &gt; Syntax: <span className="text-yellow-400 font-bold">{stats.topLanguage}</span>
          </p>

          <div className="border-t border-slate-800/80 pt-2 space-y-1">
            <span className="text-purple-400">const devs = &#123;</span>
            {results.sendersList.map(sender => {
              const count = stats.codeMessagesPerSender[sender] || 0;
              const lines = stats.linesOfCodePerSender[sender] || 0;
              return (
                <div key={sender} className="pl-4 text-slate-300 flex justify-between">
                  <span className="truncate max-w-[110px]">"{sender}":</span>
                  <span className="text-sky-300">&#123; snips: {count}, loc: {lines} &#125;,</span>
                </div>
              );
            })}
            <span className="text-purple-400">&#125;;</span>
          </div>

          <p className="text-slate-400 italic border-l-2 border-sky-500 pl-2 py-1 mt-1 bg-slate-900/40 rounded-r-lg text-[9px]">
            "Chief Code Spammer: {stats.topCodeSpammer.name}"
          </p>
        </div>
      </motion.div>

      <motion.p
        variants={slideFadeUp}
        className="text-xs font-sans font-light text-slate-400 leading-relaxed max-w-[290px] mb-8"
      >
        Detected by scanning for monospace code blocks (```) and lines containing programming syntax operators or structures.
      </motion.p>
    </motion.div>
  );
}