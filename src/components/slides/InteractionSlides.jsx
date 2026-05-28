import { motion } from 'framer-motion';
import { formatDuration } from '../../utils/helpers';

export function YapperSlide({
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
            You amplified others' ideas, but someone usually took the stage.
          </p>
          <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
            Verdict: {results.yapper.name} has enough daily monologues to publish a best-selling trilogy.
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
          You amplified others' ideas, but someone usually took the stage.
        </p>
        <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
          Verdict: {results.yapper.name} has enough daily monologues to publish a best-selling trilogy.
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
  );
}

export function GhosterSlide({
  isExport,
  results,
  activeStyle,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    const ghostWinner = results.theGhoster?.senderB || "Someone";
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Beyond a quick reply, your longest wait was...
          </p>
          {results.theGhoster && (
            <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
              Verdict: {ghostWinner} treats chat notifications like optional terms-of-service agreements.
            </p>
          )}
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
          Beyond a quick reply, your longest wait was...
        </p>
        {results.theGhoster && (
          <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
            Verdict: {results.theGhoster.senderB} treats chat notifications like optional terms-of-service agreements.
          </p>
        )}
      </motion.div>

      {results.theGhoster ? (
        <div className="my-auto space-y-4 w-full">
          {/* Central White Card */}
          <motion.div
            variants={slideFadeUp}
            className="bg-white rounded-[24px] p-5 shadow-xl border border-neutral-100 flex flex-col items-center justify-center gap-1.5 relative z-20 w-[240px] mx-auto"
          >
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
            style={{ color: activeStyle?.secondaryText || '#5F6C61' }}
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
  );
}

export function SpeedRacerSlide({
  isGroup,
  isExport,
  results,
  senderA,
  senderB,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    const senders = results.sendersList || [];
    const times = results.medianResponseTimes || {};
    const fastReplier = senders.reduce((a, b) => {
      const tA = times[a] || Infinity;
      const tB = times[b] || Infinity;
      return tA < tB ? a : b;
    }, senders[0] || "Someone");
    
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            The Response Hierarchy: Who is the Speed Racer and who is the Snail?
          </p>
          <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
            Verdict: {fastReplier} replies at lightning speed, while others take business days.
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
          {isGroup ? "Who responds at lightning speed and who takes their sweet time?" : "The Response Hierarchy: Who is the Speed Racer and who is the Snail?"}
        </p>
        {(() => {
          const senders = results.sendersList || [];
          const times = results.medianResponseTimes || {};
          const fastReplier = senders.reduce((a, b) => {
            const tA = times[a] || Infinity;
            const tB = times[b] || Infinity;
            return tA < tB ? a : b;
          }, senders[0] || "Someone");
          return (
            <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
              Verdict: {fastReplier} replies at lightning speed, while others take business days.
            </p>
          );
        })()}
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
  );
}

export function NotificationBomberSlide({
  isGroup,
  isExport,
  results,
  staggerContainer,
  slideFadeUp
}) {
  if (isExport) {
    const bomber = results.sendersList.reduce((a, b) => (results.notificationBombs[a] || 0) > (results.notificationBombs[b] || 0) ? a : b, results.sendersList[0] || "Someone");
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            The Phone Buzzer: Who triggers the most lock screen cascades?
          </p>
          <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
            Verdict: {bomber}'s rapid-fire typing is the leading cause of phone battery drain.
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
                  <span className="font-mono text-xl font-bold text-orange-600">{count} cascades</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xl font-sans font-light leading-relaxed max-w-[800px] text-neutral-600">
          Triggered when a user sends 5 or more rapid-fire messages within a 60-second window before getting a response.
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
          {isGroup ? "Who causes your lock screen to explode with rapid-fire messages?" : "The Notification Bomber: Who triggers the most lock screen cascades?"}
        </p>
        {(() => {
          const bomber = results.sendersList.reduce((a, b) => (results.notificationBombs[a] || 0) > (results.notificationBombs[b] || 0) ? a : b, results.sendersList[0] || "Someone");
          return (
            <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
              Verdict: {bomber}'s typing style is the leading cause of battery drain.
            </p>
          );
        })()}
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
  );
}

export function MidnightPhilosopherSlide({
  isGroup,
  isExport,
  results,
  senderA,
  senderB,
  staggerContainer,
  slideFadeUp
}) {
  const midA = results?.midnightCounts?.[senderA] || 0;
  const midB = results?.midnightCounts?.[senderB] || 0;
  const midTotal = midA + midB || 1;
  const midPercentA = Math.round((midA / midTotal) * 100);
  const midPercentB = 100 - midPercentA;

  if (isExport) {
    const nightOwl = results.topMidnightPhilosopher?.name || "Someone";
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            When the rest of the world went quiet, your chat kept going.
          </p>
          <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
            Verdict: {nightOwl} needs to invest in a sleep schedule instead of debugging life at 3 AM.
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
          When the rest of the world went quiet, your chat kept going.
        </p>
        <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
          Verdict: {results.topMidnightPhilosopher?.name || "Someone"} needs to invest in a sleep schedule instead of debugging life at 3 AM.
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
            <span className="text-indigo-600 font-extrabold">{midPercentA}% vs {midPercentB}%</span>
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
  );
}

export function InitiatorSlide({
  isGroup,
  isExport,
  results,
  senderA,
  senderB,
  staggerContainer,
  slideFadeUp
}) {
  const initA = results?.initiations?.[senderA] || 0;
  const initB = results?.initiations?.[senderB] || 0;
  const initTotal = initA + initB || 1;
  const initPercentA = Math.round((initA / initTotal) * 100);
  const initPercentB = 100 - initPercentA;

  if (isExport) {
    const chiefInitiator = results.topInitiator?.name || "Someone";
    return (
      <div className="flex flex-col justify-between h-full py-12 text-left w-full">
        <div className="space-y-8">
          <p className="text-3xl font-sans font-medium leading-relaxed max-w-[800px] text-neutral-800">
            Starting a conversation after a block of silence takes initiative.
          </p>
          <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
            Verdict: Without {chiefInitiator}, this chat would have been archived in early February.
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
          Starting a conversation after a block of silence takes initiative.
        </p>
        <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
          Verdict: Without {results.topInitiator?.name || "Someone"}, this chat would have been archived in early February.
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
  );
}

export function ChatCPRSlide({
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
            The Chat CPR Award: Who resuscitated the conversation when it was completely dead?
          </p>
          {(() => {
            const resuscitator = results.sendersList.reduce((a, b) => (results.resuscitationCounts[a] || 0) > (results.resuscitationCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
            return (
              <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
                Verdict: {resuscitator} is single-handedly keeping this conversation on life support.
              </p>
            );
          })()}
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
          The Chat CPR Award: Who resuscitated the conversation when it was completely dead?
        </p>
        {(() => {
          const resuscitator = results.sendersList.reduce((a, b) => (results.resuscitationCounts[a] || 0) > (results.resuscitationCounts[b] || 0) ? a : b, results.sendersList[0] || "Someone");
          return (
            <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
              Verdict: {resuscitator} is single-handedly keeping this conversation on life support.
            </p>
          );
        })()}
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
  );
}

export function DrySpellSlide({
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
            The Great Silence: What was your longest dry spell this year?
          </p>
          {results.drySpell && (
            <p className="text-xl font-bold text-[#8B5CF6]/90 mt-2 leading-relaxed">
              Verdict: You literally forgot each other existed for {results.drySpell.days} days. Nature was healing.
            </p>
          )}
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
          The Great Silence: What was your longest dry spell this year?
        </p>
        {results.drySpell && (
          <p className="text-[11px] font-bold text-[#8B5CF6]/90 mt-1 leading-snug">
            Verdict: You literally forgot each other existed for {results.drySpell.days} days. Nature was healing.
          </p>
        )}
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
  );
}
