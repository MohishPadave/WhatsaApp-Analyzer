import { motion } from 'framer-motion';
import { formatDuration } from '../../utils/helpers';

export function MediaMogulSlide({
  isGroup,
  isExport,
  results,
  senderA,
  senderB,
  staggerContainer,
  slideFadeUp
}) {
  const mediaA = results?.mediaCounts?.[senderA] || 0;
  const mediaB = results?.mediaCounts?.[senderB] || 0;
  const mediaTotal = mediaA + mediaB || 1;
  const mediaPercentA = Math.round((mediaA / mediaTotal) * 100);
  const mediaPercentB = 100 - mediaPercentA;

  if (isExport) {
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            A picture is worth a thousand words, and your gallery proves it.
          </p>
          <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
            Verdict: {results.topMediaMogul?.name || "Someone"} is single-handedly filling up the other person's phone storage with sticker spam.
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
          <div className="rounded-[40px] p-10 shadow-lg space-y-8 w-full border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
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
          <div className="rounded-[40px] p-10 shadow-lg space-y-8 w-full border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
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
          A picture is worth a thousand words, and your gallery proves it.
        </p>
        <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
          Verdict: {results.topMediaMogul?.name || "Someone"} is single-handedly filling up the other person's phone storage with sticker spam.
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
  );
}

export function TextMediaRatioSlide({
  isGroup,
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
            {isGroup ? "Who relies on stickers and attachments rather than typing?" : "The Media Spammer: Who communicates entirely in stickers and GIFs?"}
          </p>
          {(() => {
            const spammer = results.sendersList.reduce((a, b) => (results.mediaRatios[a] || 0) > (results.mediaRatios[b] || 0) ? a : b, results.sendersList[0] || "Someone");
            return (
              <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
                Verdict: {spammer} prefers pixels over paragraphs. Why type when you can sticker?
              </p>
            );
          })()}
        </div>
        <div className="rounded-[40px] p-10 shadow-lg space-y-6 w-full my-auto border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
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
          {isGroup ? "Who relies on stickers and attachments rather than typing?" : "The Media Spammer: Who communicates entirely in stickers and GIFs?"}
        </p>
        {(() => {
          const spammer = results.sendersList.reduce((a, b) => (results.mediaRatios[a] || 0) > (results.mediaRatios[b] || 0) ? a : b, results.sendersList[0] || "Someone");
          return (
            <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
              Verdict: {spammer} prefers pixels over paragraphs. Why type when you can sticker?
            </p>
          );
        })()}
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
  );
}

export function VoiceNotesSlide({
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
            Sometimes typing is too much work. Your audio archives speak volumes.
          </p>
          <p className="text-xl font-bold mt-2 leading-relaxed" style={{ color: 'rgba(139, 92, 246, 0.9)' }}>
            Verdict: {results.topVoiceNoteSender?.name || "Someone"} should start a podcast instead of sending voice monologues.
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
          <div className="rounded-[40px] p-10 shadow-lg space-y-8 w-full border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
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
          <div className="rounded-[40px] p-10 shadow-lg space-y-8 w-full border-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: 'rgba(255, 255, 255, 0.4)' }}>
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
              <div className="flex flex-col text-left">
                <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderA}</span>
                <span className="text-lg text-neutral-500 font-mono mt-1">{(results.voiceNoteCounts[senderA] || 0).toLocaleString()} VN</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="font-semibold text-neutral-800 truncate max-w-[300px]">{senderB}</span>
                <span className="text-lg text-neutral-500 font-mono mt-1">{(results.voiceNoteCounts[senderB] || 0).toLocaleString()} VN</span>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[32px] p-8 shadow-md flex items-center gap-6 w-full border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'rgba(243, 232, 255, 1)' }}>
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
          Sometimes typing is too much work. Your audio archives speak volumes.
        </p>
        <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
          Verdict: {results.topVoiceNoteSender?.name || "Someone"} should start a podcast instead of sending voice monologues.
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
  );
}
