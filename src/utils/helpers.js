/**
 * Formats a duration in milliseconds into a readable days/hours/minutes string
 */
export function formatDuration(ms) {
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

/**
 * Evaluates chat statistics to assign a sensory visual theme (aura)
 */
export function calculateChatAura(results) {
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
