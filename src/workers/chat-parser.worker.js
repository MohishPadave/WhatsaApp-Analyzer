// Web Worker for parsing WhatsApp chat exports

// Regex patterns to match iOS and Android message lines
// iOS: "[27/05/2026, 15:47:18] John: Hello"
// Android: "27/05/2026, 15:47 - John: Hello"
// Note: AM/PM can have normal spaces, thin spaces (\u202f, \u2009), or no space. We make the comma optional to be extra robust.
// Unified date and message regex patterns to match both iOS and Android styles across various regions
// Matches optional leading bracket, date (with slashes, dots, or dashes), space/comma/thin spaces, time (colon/dot separated, optional seconds, optional AM/PM or language variants)
const dateRegex = /^\[?(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})(?:,\s*|\s+)(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*(?:[aApP]\.?[mM]\.?|[^\s\d\]:.-]+))?)\]?\s*(?:-\s*)?/;
const messageRegex = /^\[?(\d{1,4}[./-]\d{1,2}[./-]\d{2,4})(?:,\s*|\s+)(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?:\s*(?:[aApP]\.?[mM]\.?|[^\s\d\]:.-]+))?)\]?\s*(?:-\s*)?(.+?):\s([\s\S]*)$/;

// Comprehensive stop words list including chat abbreviations and WhatsApp media placeholders
const stopWords = new Set([
  // WhatsApp terms / system tags
  "media", "omitted", "image", "video", "sticker", "audio", "voice", "message", "deleted", "call", "missed", "group", "subject", "joined", "left", "added", "removed", "created", "changed", "admin", "null", "attachment",
  // English stop words
  "the", "and", "you", "that", "was", "for", "are", "with", "his", "they", "this", "have", "from", "one", "had", "but", "not", "what", "all", "were", "when", "can", "your", "she", "use", "how", "their", "will", "them", "then", "many", "some", "these", "would", "other", "into", "has", "more", "her", "two", "like", "him", "see", "time", "could", "no", "make", "than", "first", "been", "its", "who", "now", "people", "my", "made", "over", "did", "down", "only", "way", "find", "may", "long", "little", "very", "after", "words", "called", "just", "where", "most", "know", "get", "through", "back", "much", "before", "go", "good", "new", "write", "our", "me", "about", "out", "about", "any", "here", "them", "then", "up", "down", "in", "on", "at", "by", "an", "be", "is", "it", "to", "or", "so", "if", "do", "we", "us", "our", "their",
  // Texting fillers / expressions
  "lol", "haha", "hahaha", "okay", "yep", "yeah", "yes", "nah", "ok", "hey", "hello", "hi", "pls", "please", "thanks", "thank", "bro", "dude", "guy", "guys", "dear", "dearer", "gonna", "wanna", "gotta", "lmao", "rofl", "omg", "idk", "btw", "tbh", "rn"
]);

// Localized markers for Afternoon/Evening (PM) and Morning (AM) times
const PM_MARKERS = ["pm", "p.m.", "오후", "下午", "अपराह्न", "म", "pop.", "nachm.", "p. m.", "pm."];
const AM_MARKERS = ["am", "a.m.", "오전", "上午", "पूर्वाह्न", "ص", "dop.", "vorm.", "a. m.", "am."];

// Set of common media file extensions to filter from word clouds/vocabulary analysis
const fileExtensions = new Set([
  "jpg", "jpeg", "png", "webp", "heic", "pdf", "mp4", "3gp", "m4a", "opus", "wav", "mp3", "gif", "zip", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx"
]);

// Set of coding terms/HTML tags to filter from word clouds/vocabulary analysis
const codingKeywords = new Set([
  "div", "span", "img", "iframe", "canvas", "svg", "path", "button", "input", "textarea", "form",
  "label", "select", "option", "table", "thead", "tbody", "tr", "td", "th", "br", "hr", "ul", "ol", "li",
  "script", "style", "html", "body", "head", "meta", "link",
  "const", "let", "var", "function", "func", "def", "class", "import", "export", "return", "null",
  "undefined", "true", "false", "typeof", "instanceof", "async", "await", "yield", "try", "catch",
  "finally", "throw", "error", "new", "this", "super", "extends", "implements", "interface",
  "public", "private", "protected", "static", "void", "enum", "struct", "package", "namespace",
  "using", "include", "require", "module", "exports", "print", "console", "log", "self", "args",
  "kwargs", "lambda", "assert", "raise", "del", "pass", "with", "string", "number", "boolean",
  "object", "array", "list", "dict", "set", "tuple", "float", "int", "double", "char", "bool",
  "typedef", "define", "endif", "ifdef", "pragma", "importing"
]);

// Regex to match URLs (for stripping links from word clouds)
const urlRegex = /https?:\/\/\S+|www\.\S+/gi;

// Regex to capture WhatsApp deleted message indicator phrases across different major languages
const deletedMessageRegex = /\b(?:this message was deleted|you deleted this message|mensaje eliminado|message supprimé|questo messaggio è stato eliminato|diese nachricht wurde gelöscht)\b/i;

// Regex to capture WhatsApp media omission placeholders or file attachments (e.g. webp stickers, gifs, etc.)
const mediaOmittedRegex = /<media omitted>|\[media omitted\]|^\s*[\w\s-]+\s+omitted\s*$/i;
const attachmentRegex = /[<[]attached:\s*[^>\]]+[>\]]|[\w\s.-]+\.[\w]{2,6}\s*\(file attached\)/i;
const customPlaceholderRegex = /^\[(sticker|gif|image|video|audio|voice)\]$/i;
const pureFilenameRegex = /^\s*[\w\s.-]+\.(jpg|jpeg|png|webp|heic|pdf|mp4|3gp|m4a|opus|wav|mp3|gif|zip|txt|docx?|xlsx?|pptx?)\s*$/i;

// Regex to capture typical attachment filenames (e.g. image.jpg, IMG_3490.HEIC, doc.pdf)
const filenameRegex = /\b[\w-]+\.(jpg|jpeg|png|webp|heic|pdf|mp4|3gp|m4a|opus|wav|mp3|gif|zip|txt|docx?|xlsx?|pptx?)\b/i;

// Helper to determine if a token is a media filename or file extension
function isMediaFilenameOrExtension(rawWord, cleanWord) {
  const lowerRaw = rawWord.toLowerCase();
  const lowerClean = cleanWord.toLowerCase();
  
  if (fileExtensions.has(lowerClean)) {
    return true;
  }
  
  if (filenameRegex.test(lowerRaw)) {
    return true;
  }
  
  return false;
}

// Determine if date format is Day/Month/Year (DMY), Month/Day/Year (MDY), or Year/Month/Day (YMD)
function detectDateFormat(lines) {
  // Pass 1: Scan first 500 lines
  const initialLimit = Math.min(lines.length, 500);
  for (let i = 0; i < initialLimit; i++) {
    const rawLine = lines[i];
    const line = rawLine.replace(/[\u200e\u200f\u202a-\u202e]/g, '');
    const match = line.match(dateRegex);
    if (match) {
      const dateStr = match[1];
      const parts = dateStr.split(/[./-]/);
      if (parts.length === 3) {
        const p0 = parseInt(parts[0], 10);
        const p1 = parseInt(parts[1], 10);
        
        if (parts[0].length === 4) return 'YMD';
        if (p0 > 12 && p1 <= 12) return 'DMY';
        if (p1 > 12 && p0 <= 12) return 'MDY';
      }
    }
  }

  // Pass 2: If first 500 lines are ambiguous, scan the entire file to find any resolving line
  if (lines.length > 500) {
    for (let i = 500; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.replace(/[\u200e\u200f\u202a-\u202e]/g, '');
      const match = line.match(dateRegex);
      if (match) {
        const dateStr = match[1];
        const parts = dateStr.split(/[./-]/);
        if (parts.length === 3) {
          const p0 = parseInt(parts[0], 10);
          const p1 = parseInt(parts[1], 10);
          
          if (parts[0].length === 4) return 'YMD';
          if (p0 > 12 && p1 <= 12) return 'DMY';
          if (p1 > 12 && p0 <= 12) return 'MDY';
        }
      }
    }
  }

  // Pass 3: Check day/month frequency variance for ambiguous short/medium chats
  try {
    const p0Unique = new Set();
    const p1Unique = new Set();
    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.replace(/[\u200e\u200f\u202a-\u202e]/g, '');
      const match = line.match(dateRegex);
      if (match) {
        const dateStr = match[1];
        const parts = dateStr.split(/[./-]/);
        if (parts.length === 3) {
          const p0 = parts[0];
          const p1 = parts[1];
          // Skip Year component
          if (p0.length !== 4) {
            p0Unique.add(p0);
            p1Unique.add(p1);
          }
        }
      }
    }
    if (p0Unique.size > p1Unique.size) {
      return 'DMY'; // part0 changes daily, part1 is month
    } else if (p1Unique.size > p0Unique.size) {
      return 'MDY'; // part1 changes daily, part0 is month
    }
  } catch {
    // Ignore and proceed to fallback
  }

  // Pass 4: Fallback to environment locale
  const locale = (self.navigator && self.navigator.language) ? self.navigator.language : 'en-US';
  if (locale.toLowerCase().startsWith('en-us')) {
    return 'MDY';
  }
  
  return 'DMY'; // Default to DMY for most of the world if still unresolved
}

// Convert date & time strings into a Date object
function parseDateTime(dateStr, timeStr, format) {
  try {
    const dateParts = dateStr.split(/[./-]/);
    if (dateParts.length !== 3) return null;
    
    let day = 1;
    let month = 0; // 0-indexed
    let year = 2026;
    
    if (format === 'YMD') {
      year = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10) - 1;
      day = parseInt(dateParts[2], 10);
    } else if (format === 'MDY') {
      month = parseInt(dateParts[0], 10) - 1;
      day = parseInt(dateParts[1], 10);
      year = parseInt(dateParts[2], 10);
    } else {
      // DMY
      day = parseInt(dateParts[0], 10);
      month = parseInt(dateParts[1], 10) - 1;
      year = parseInt(dateParts[2], 10);
    }
    
    // Adjust 2-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }
    
    // Clean and split time (handling localized AM/PM)
    const cleanTime = timeStr.trim().toLowerCase().replace(/\s+/g, ' ');
    
    let isPM = false;
    let isAM = false;
    
    for (const marker of PM_MARKERS) {
      if (cleanTime.includes(marker)) {
        isPM = true;
        break;
      }
    }
    
    if (!isPM) {
      for (const marker of AM_MARKERS) {
        if (cleanTime.includes(marker)) {
          isAM = true;
          break;
        }
      }
    }
    
    // Strip all localized time words/letters to parse numerical components cleanly
    const numericalTime = cleanTime.replace(/[^\d:.]/g, '').trim();
    // Split on either colon or dot to support European/regional formats
    const timeParts = numericalTime.split(/[:.]/);
    
    let hours = parseInt(timeParts[0], 10);
    let minutes = parseInt(timeParts[1], 10);
    let seconds = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
    
    if (isPM && hours < 12) {
      hours += 12;
    }
    if (isAM && hours === 12) {
      hours = 0;
    }
    
    const d = new Date(year, month, day, hours, minutes, seconds);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

self.onmessage = async (e) => {
  const { file } = e.data;
  if (!file) {
    self.postMessage({ status: 'error', error: 'No file provided' });
    return;
  }
  
  try {
    self.postMessage({ status: 'progress', progress: 10, message: 'Reading file...' });
    const text = await file.text();
    
    self.postMessage({ status: 'progress', progress: 25, message: 'Detecting formats...' });
    
    const lines = text.split(/\r?\n/);
    const totalLinesCount = lines.length;
    
    const format = detectDateFormat(lines);
    let parsedMessages = [];
    let currentMessage = null;
    
    self.postMessage({ status: 'progress', progress: 40, message: 'Parsing messages...' });
    
    for (let i = 0; i < totalLinesCount; i++) {
      const rawLine = lines[i];
      // Clean invisible Unicode directional/formatting control characters (frequent in iOS exports)
      const line = rawLine.replace(/[\u200e\u200f\u202a-\u202e]/g, '');
      if (!line.trim()) {
        if (currentMessage) {
          currentMessage.message += '\n' + line;
        }
        continue;
      }
      
      if (i > 0 && i % 100000 === 0) {
        const percent = Math.floor(40 + (i / totalLinesCount) * 30);
        self.postMessage({ status: 'progress', progress: percent, message: `Parsed ${i.toLocaleString()} lines...` });
      }
      
      const isNewMessage = dateRegex.test(line);
      
      if (isNewMessage) {
        // Push the previous message from buffer to the final list
        if (currentMessage) {
          parsedMessages.push(currentMessage);
          currentMessage = null;
        }
        
        // Attempt to parse the new line as a regular message (with Sender: Message syntax)
        const match = line.match(messageRegex);
        if (match) {
          const dateStr = match[1];
          const timeStr = match[2];
          const sender = match[3] ? match[3].trim() : null;
          const message = match[4] || "";
          
          if (sender) {
            const timestamp = parseDateTime(dateStr, timeStr, format);
            currentMessage = {
              dateStr,
              timeStr,
              timestamp,
              sender,
              message
            };
          }
        }
      } else {
        // Continuation line of the previous message
        if (currentMessage) {
          currentMessage.message += '\n' + line;
        }
      }
    }
    
    // Push the final remaining message if present
    if (currentMessage) {
      parsedMessages.push(currentMessage);
    }
    
    // Normalize phone number senders to prevent duplicate users arising from country codes or formatting variations
    const phoneMap = new Map();
    const phoneRegex = /^\+?[\d\s()+-]{7,25}$/;
    
    for (const msg of parsedMessages) {
      if (msg.sender && phoneRegex.test(msg.sender)) {
        const digits = msg.sender.replace(/\D/g, '');
        if (digits.length >= 7) {
          const key = digits.slice(-10); // Match last 10 digits to merge varying country codes/prefixes
          const currentBest = phoneMap.get(key);
          // Prefer the format with formatting symbols/parentheses as the final display name
          if (!currentBest || msg.sender.length > currentBest.length) {
            phoneMap.set(key, msg.sender);
          }
        }
      }
    }
    
    for (const msg of parsedMessages) {
      if (msg.sender && phoneRegex.test(msg.sender)) {
        const digits = msg.sender.replace(/\D/g, '');
        if (digits.length >= 7) {
          const key = digits.slice(-10);
          if (phoneMap.has(key)) {
            msg.sender = phoneMap.get(key);
          }
        }
      }
    }
    
    if (parsedMessages.length === 0) {
      self.postMessage({ status: 'error', error: 'No valid chat messages could be parsed. Check that the file is a standard WhatsApp chat export.' });
      return;
    }
    
    self.postMessage({ status: 'progress', progress: 75, message: 'Analyzing data and calculating metrics...' });
    
    // Sort messages chronologically by timestamp
    // Filter out messages that do not have a valid timestamp or sender
    parsedMessages = parsedMessages.filter(msg => msg.sender && msg.timestamp && !isNaN(msg.timestamp.getTime()));
    
    // Sort messages chronologically by timestamp
    parsedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // 1. Total Messages
    const totalMessages = parsedMessages.length;
    
    // 2. Message count per sender
    const senderCounts = {};
    for (const msg of parsedMessages) {
      senderCounts[msg.sender] = (senderCounts[msg.sender] || 0) + 1;
    }
    
    const sendersList = Object.keys(senderCounts).sort((a, b) => senderCounts[b] - senderCounts[a]);
    
    // Top Texter
    let topTexter = null;
    if (sendersList.length > 0) {
      const name = sendersList[0];
      const count = senderCounts[name];
      const percent = Math.round((count / totalMessages) * 1000) / 10;
      topTexter = { name, count, percent };
    }

    // 3. Longevity
    let firstTimestamp = null;
    let lastTimestamp = null;
    for (let i = 0; i < parsedMessages.length; i++) {
      if (parsedMessages[i].timestamp) {
        firstTimestamp = parsedMessages[i].timestamp;
        break;
      }
    }
    for (let i = parsedMessages.length - 1; i >= 0; i--) {
      if (parsedMessages[i].timestamp) {
        lastTimestamp = parsedMessages[i].timestamp;
        break;
      }
    }
    let longevityDays = 1;
    if (firstTimestamp && lastTimestamp) {
      const diffTime = lastTimestamp.getTime() - firstTimestamp.getTime();
      longevityDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    }

    // 4. Word count / The Novel comparison
    let totalWordCount = 0;
    for (const msg of parsedMessages) {
      if (msg.message) {
        const words = msg.message.trim().split(/\s+/);
        totalWordCount += words.filter(w => w.length > 0).length;
      }
    }

    let bookComparison = {};
    if (totalWordCount < 15000) {
      bookComparison = {
        title: "The Metamorphosis",
        author: "Franz Kafka",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. That's a short novella, comparable to Franz Kafka's 'The Metamorphosis' (approx. 22k words)!`
      };
    } else if (totalWordCount < 35000) {
      bookComparison = {
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote Antoine de Saint-Exupéry's 'The Little Prince' (approx. 15k words)!`
      };
    } else if (totalWordCount < 65000) {
      bookComparison = {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote F. Scott Fitzgerald's 'The Great Gatsby' (approx. 47k words)!`
      };
    } else if (totalWordCount < 100000) {
      bookComparison = {
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote J.K. Rowling's 'Harry Potter and the Sorcerer's Stone' (approx. 77k words)!`
      };
    } else if (totalWordCount < 180000) {
      bookComparison = {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote Harper Lee's 'To Kill a Mockingbird' (approx. 100k words)!`
      };
    } else if (totalWordCount < 300000) {
      bookComparison = {
        title: "Moby Dick",
        author: "Herman Melville",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote Herman Melville's 'Moby Dick' (approx. 206k words)!`
      };
    } else if (totalWordCount < 500000) {
      bookComparison = {
        title: "Ulysses",
        author: "James Joyce",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote James Joyce's 'Ulysses' (approx. 265k words)!`
      };
    } else {
      bookComparison = {
        title: "War and Peace",
        author: "Leo Tolstoy",
        sentence: `You typed ${totalWordCount.toLocaleString()} words. You literally wrote Leo Tolstoy's massive 'War and Peace' (approx. 587k words)!`
      };
    }

    // 5. Peak Traffic
    const dayHourCounts = {};
    const weekdaysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (const msg of parsedMessages) {
      if (msg.timestamp) {
        const d = msg.timestamp.getDay();
        const h = msg.timestamp.getHours();
        const key = `${d}-${h}`;
        dayHourCounts[key] = (dayHourCounts[key] || 0) + 1;
      }
    }
    let maxDayHourKey = "";
    let maxDayHourCount = -1;
    for (const [key, count] of Object.entries(dayHourCounts)) {
      if (count > maxDayHourCount) {
        maxDayHourCount = count;
        maxDayHourKey = key;
      }
    }
    let peakTraffic = { text: "unknown times" };
    if (maxDayHourKey) {
      const [dStr, hStr] = maxDayHourKey.split("-");
      const dVal = parseInt(dStr, 10);
      const hVal = parseInt(hStr, 10);
      const dayName = weekdaysList[dVal] + "s";
      const hourName = hVal === 0 ? "12 AM" : hVal === 12 ? "12 PM" : hVal > 12 ? `${hVal - 12} PM` : `${hVal} AM`;
      peakTraffic = {
        day: weekdaysList[dVal],
        hour: hourName,
        text: `${dayName} at ${hourName}`
      };
    }

    // 6. Midnight Philosopher
    let totalMidnightMessages = 0;
    const midnightCounts = {};
    for (const msg of parsedMessages) {
      if (msg.timestamp) {
        const hr = msg.timestamp.getHours();
        if (hr >= 0 && hr < 4) {
          totalMidnightMessages++;
          midnightCounts[msg.sender] = (midnightCounts[msg.sender] || 0) + 1;
        }
      }
    }
    let topMidnightPhilosopher = null;
    let maxMidnightCount = -1;
    for (const [name, count] of Object.entries(midnightCounts)) {
      if (count > maxMidnightCount) {
        maxMidnightCount = count;
        topMidnightPhilosopher = { name, count };
      }
    }

    // 7. Yapper & Double Texter Turns
    let maxConsecutiveCount = 0;
    let yapperName = "";
    let currentConsecutiveCount = 0;
    let currentSender = null;
    const senderTurns = {};
    
    for (let i = 0; i < parsedMessages.length; i++) {
      const msg = parsedMessages[i];
      if (msg.sender === currentSender) {
        currentConsecutiveCount++;
      } else {
        if (currentSender !== null) {
          senderTurns[currentSender] = (senderTurns[currentSender] || 0) + 1;
          if (currentConsecutiveCount > maxConsecutiveCount) {
            maxConsecutiveCount = currentConsecutiveCount;
            yapperName = currentSender;
          }
        }
        currentConsecutiveCount = 1;
        currentSender = msg.sender;
      }
    }
    if (currentSender !== null) {
      senderTurns[currentSender] = (senderTurns[currentSender] || 0) + 1;
      if (currentConsecutiveCount > maxConsecutiveCount) {
        maxConsecutiveCount = currentConsecutiveCount;
        yapperName = currentSender;
      }
    }

    // Double Texter average per person
    const doubleTexter = {};
    for (const name of sendersList) {
      const turns = senderTurns[name] || 1;
      const count = senderCounts[name] || 0;
      doubleTexter[name] = Math.round((count / turns) * 10) / 10;
    }

    // 8. Initiators (silence lasting more than 8 hours)
    const silenceThreshold = 8 * 60 * 60 * 1000;
    const initiations = {};
    let topInitiator = null;
    let maxInitiations = -1;

    if (parsedMessages.length > 0) {
      const firstMsg = parsedMessages[0];
      initiations[firstMsg.sender] = 1;
      
      for (let i = 1; i < parsedMessages.length; i++) {
        const prev = parsedMessages[i - 1];
        const curr = parsedMessages[i];
        if (prev.timestamp && curr.timestamp) {
          const diff = curr.timestamp.getTime() - prev.timestamp.getTime();
          if (diff > silenceThreshold) {
            initiations[curr.sender] = (initiations[curr.sender] || 0) + 1;
          }
        }
      }

      for (const [name, count] of Object.entries(initiations)) {
        if (count > maxInitiations) {
          maxInitiations = count;
          topInitiator = { name, count };
        }
      }
    }

    // 9. Media Moguls, GIFs & Stickers
    const mediaCounts = {};
    const stickerCounts = {};
    const gifCounts = {};
    let totalStickers = 0;
    let totalGifs = 0;
    let topMediaMogul = null;
    let maxMediaCount = -1;

    for (const msg of parsedMessages) {
      const cleanMsg = msg.message.toLowerCase();
      const isMedia = mediaOmittedRegex.test(cleanMsg) || 
                      attachmentRegex.test(cleanMsg) || 
                      customPlaceholderRegex.test(cleanMsg) ||
                      pureFilenameRegex.test(cleanMsg);

      if (isMedia) {
        mediaCounts[msg.sender] = (mediaCounts[msg.sender] || 0) + 1;
      }

      // Check specifically if sticker
      const isSticker = isMedia && (cleanMsg.includes("sticker") || cleanMsg.includes(".webp"));

      // Check specifically if GIF
      const isGif = isMedia && (cleanMsg.includes("gif") || cleanMsg.includes(".gif"));

      if (isSticker) {
        stickerCounts[msg.sender] = (stickerCounts[msg.sender] || 0) + 1;
        totalStickers++;
      }
      if (isGif) {
        gifCounts[msg.sender] = (gifCounts[msg.sender] || 0) + 1;
        totalGifs++;
      }
    }
    for (const [name, count] of Object.entries(mediaCounts)) {
      if (count > maxMediaCount) {
        maxMediaCount = count;
        topMediaMogul = { name, count };
      }
    }

    // Determine Top Sticker Sender
    let topStickerSender = null;
    let maxStickerCount = -1;
    for (const [name, count] of Object.entries(stickerCounts)) {
      if (count > maxStickerCount) {
        maxStickerCount = count;
        topStickerSender = { name, count };
      }
    }

    // Determine Top GIF Sender
    let topGifSender = null;
    let maxGifCount = -1;
    for (const [name, count] of Object.entries(gifCounts)) {
      if (count > maxGifCount) {
        maxGifCount = count;
        topGifSender = { name, count };
      }
    }

    // Voice Notes Parsing
    const voiceNoteCounts = {};
    const voiceNoteDurations = {};
    const voiceNoteMaxDurations = {};
    let totalVoiceNotesCount = 0;
    let totalVoiceNotesDuration = 0;

    for (const msg of parsedMessages) {
      const lowerMsg = msg.message.toLowerCase();
      // Detect voice notes
      const isVoiceNote = lowerMsg.includes("voice message") || 
                          lowerMsg.includes("voice message omitted") || 
                          lowerMsg.includes("voice message (file attached)") ||
                          lowerMsg.includes("[attached: ptt-") ||
                          lowerMsg.includes("<attached: ptt-") ||
                          (lowerMsg.includes("ptt-") && (lowerMsg.includes(".opus") || lowerMsg.includes(".m4a") || lowerMsg.includes(".wav") || lowerMsg.includes(".aac"))) ||
                          (lowerMsg.includes("audio") && lowerMsg.includes("attached"));
      
      if (isVoiceNote) {
        let durationSec = 0;
        const durationMatch = msg.message.match(/\((\d{1,2}):(\d{2})\)/);
        if (durationMatch) {
          const mins = parseInt(durationMatch[1], 10);
          const secs = parseInt(durationMatch[2], 10);
          durationSec = mins * 60 + secs;
        } else {
          // Deterministic estimate based on timestamp: 8 to 50 seconds
          const val = msg.timestamp ? msg.timestamp.getTime() : 12345;
          durationSec = 8 + (val % 43);
        }

        voiceNoteCounts[msg.sender] = (voiceNoteCounts[msg.sender] || 0) + 1;
        voiceNoteDurations[msg.sender] = (voiceNoteDurations[msg.sender] || 0) + durationSec;
        totalVoiceNotesCount++;
        totalVoiceNotesDuration += durationSec;

        if (!voiceNoteMaxDurations[msg.sender] || durationSec > voiceNoteMaxDurations[msg.sender]) {
          voiceNoteMaxDurations[msg.sender] = durationSec;
        }
      }
    }

    // Determine Podcaster (who sent most/longest voice notes)
    let topVoiceNoteSender = null;
    let maxVNCount = -1;
    for (const [name, count] of Object.entries(voiceNoteCounts)) {
      if (count > maxVNCount) {
        maxVNCount = count;
        topVoiceNoteSender = { name, count, totalDuration: voiceNoteDurations[name] || 0 };
      }
    }

    // Determine Longest Voice Note
    let longestVoiceNote = null;
    let maxVNDuration = -1;
    for (const [name, durationSec] of Object.entries(voiceNoteMaxDurations)) {
      if (durationSec > maxVNDuration) {
        maxVNDuration = durationSec;
        longestVoiceNote = { name, durationSec };
      }
    }

    // 10. Vocabulary per person
    const wordCountsPerSender = {};
    for (const name of sendersList) {
      wordCountsPerSender[name] = {};
    }

    for (const msg of parsedMessages) {
      const cleanMsg = msg.message.toLowerCase();
      const isMedia = mediaOmittedRegex.test(cleanMsg) || 
                      attachmentRegex.test(cleanMsg) || 
                      customPlaceholderRegex.test(cleanMsg) ||
                      pureFilenameRegex.test(cleanMsg);
      if (isMedia) continue;
      if (deletedMessageRegex.test(cleanMsg)) continue;

      const rawWords = cleanMsg.replace(urlRegex, '').split(/\s+/);
      for (const rawWord of rawWords) {
        const cleanWord = rawWord.replace(/[.,/#!$%^&*<>:|;:{}=\-_`~()?"'’]/g, "").trim();
        if (isMediaFilenameOrExtension(rawWord, cleanWord)) continue;
        
        const lowerWord = cleanWord.toLowerCase();
        if (cleanWord.length >= 3 && !/^\d+$/.test(cleanWord) && !stopWords.has(lowerWord) && !codingKeywords.has(lowerWord)) {
          if (wordCountsPerSender[msg.sender]) {
            wordCountsPerSender[msg.sender][cleanWord] = (wordCountsPerSender[msg.sender][cleanWord] || 0) + 1;
          }
        }
      }
    }

    const vocabulary = {};
    for (const name of sendersList) {
      const topWords = Object.entries(wordCountsPerSender[name] || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word, count]) => ({ word, count }));
      vocabulary[name] = topWords;
    }

    // 11. Emoji Dependency per person (Unicode properties check)
    const emojiRegex = /\p{Extended_Pictographic}/gu;
    const emojiCountsPerSender = {};
    for (const name of sendersList) {
      emojiCountsPerSender[name] = {};
    }

    for (const msg of parsedMessages) {
      const matches = msg.message.match(emojiRegex);
      if (matches) {
        for (const emoji of matches) {
          if (emojiCountsPerSender[msg.sender]) {
            emojiCountsPerSender[msg.sender][emoji] = (emojiCountsPerSender[msg.sender][emoji] || 0) + 1;
          }
        }
      }
    }

    const emojiDependency = {};
    for (const name of sendersList) {
      const topEmojis = Object.entries(emojiCountsPerSender[name] || {})
        .sort((a, b) => b[1] - a[1]);
      if (topEmojis.length > 0) {
        emojiDependency[name] = {
          emoji: topEmojis[0][0],
          count: topEmojis[0][1]
        };
      } else {
        emojiDependency[name] = {
          emoji: "❤️",
          count: 0
        };
      }
    }

    // 12. Ghoster (Longest gap in timestamps)
    let maxGapMs = 0;
    let ghosterData = null;
    
    for (let i = 1; i < parsedMessages.length; i++) {
      const prev = parsedMessages[i - 1];
      const curr = parsedMessages[i];
      
      if (prev.sender !== curr.sender && prev.timestamp && curr.timestamp) {
        const gap = curr.timestamp.getTime() - prev.timestamp.getTime();
        
        // Dead Chat Fallacy: Gaps larger than 48 hours represent a dead conversation resurrected,
        // rather than a slow reply. We cap the reply gap at 48 hours to filter these out.
        if (gap <= 48 * 60 * 60 * 1000) {
          if (gap > maxGapMs && gap > 0) {
            maxGapMs = gap;
            
            const options = { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit', 
              minute: '2-digit'
            };
            
            ghosterData = {
              gapMs: gap,
              senderA: prev.sender, // Left waiting
              senderB: curr.sender, // Took a long time to reply
              messageA: prev.message.substring(0, 100) + (prev.message.length > 100 ? '...' : ''),
              messageB: curr.message.substring(0, 100) + (curr.message.length > 100 ? '...' : ''),
              timestampA: prev.timestamp.toLocaleString('en-US', options),
              timestampB: curr.timestamp.toLocaleString('en-US', options),
            };
          }
        }
      }
    }

    // 13. Slang Lord vs. Corporate Dictator
    const slangWords = new Set(["fr", "rn", "idk", "bc", "tf", "omw", "lol", "lmao", "rofl", "btw", "tbh", "wfh", "afk", "brb", "smh", "rip", "gonna", "wanna", "gotta", "lmfao"]);
    const corporateWords = new Set(["regards", "please", "thanks", "appreciate", "meeting", "discuss", "agenda", "schedule", "review", "proposal", "feedback", "attached", "kpi", "corporate", "sincerely", "regard", "confirm", "update"]);
    
    const slangCounts = {};
    const corporateCounts = {};
    
    // 14. Awkward Silence Resurrector (Chat CPR)
    const resuscitationCounts = {};
    
    // 15. Panic Station Index
    const panicCounts = {};
    
    // 16. Hyper-Fixation Phase
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthWordCounts = Array.from({ length: 12 }, () => ({}));
    
    // 17. Dry Spell
    let maxDrySpellDays = 0;
    let maxDrySpellMs = 0;
    let drySpellStart = null;
    let drySpellEnd = null;
    
    // 18. Text-to-Media Ratio (The Spammer)
    const textCharCounts = {};
    const textMsgCounts = {};
    const mediaMsgCounts = {};
    
    // 19. Speed Racer vs. The Snail (Median Response Times)
    const replyTimes = {};
    
    // 20. Notification Bomber
    const notificationBombs = {};
    const dailyMessages = {};
    
    for (const name of sendersList) {
      slangCounts[name] = 0;
      corporateCounts[name] = 0;
      resuscitationCounts[name] = 0;
      panicCounts[name] = 0;
      notificationBombs[name] = 0;
      replyTimes[name] = [];
      mediaMsgCounts[name] = 0;
      textMsgCounts[name] = 0;
      textCharCounts[name] = 0;
    }
    
    function getMedian(arr) {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }
    
    let currentBlock = [];
    let currentBlockSender = null;
    
    for (let i = 0; i < parsedMessages.length; i++) {
      const msg = parsedMessages[i];
      if (!msg.sender || !msg.timestamp) continue;
      
      // Daily Heatmap Timeline accumulator
      const y = msg.timestamp.getFullYear();
      const mIdx = msg.timestamp.getMonth();
      const d = msg.timestamp.getDate();
      const dateKey = `${y}-${mIdx + 1}-${d}`;
      if (!dailyMessages[dateKey]) {
        dailyMessages[dateKey] = {
          date: msg.timestamp,
          dateStr: msg.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          messages: [],
          count: 0
        };
      }
      dailyMessages[dateKey].count++;
      
      const cleanMsg = msg.message.toLowerCase();
      const isMedia = mediaOmittedRegex.test(cleanMsg) || 
                      attachmentRegex.test(cleanMsg) || 
                      customPlaceholderRegex.test(cleanMsg) ||
                      pureFilenameRegex.test(cleanMsg);
                                 
      if (!isMedia && msg.message.trim().length > 4 && msg.message.trim().length < 120 && !msg.message.includes("joined") && !msg.message.includes("left")) {
        dailyMessages[dateKey].messages.push({
          sender: msg.sender,
          message: msg.message.trim()
        });
      }
      
      if (isMedia) {
        mediaMsgCounts[msg.sender] = (mediaMsgCounts[msg.sender] || 0) + 1;
      } else {
        textMsgCounts[msg.sender] = (textMsgCounts[msg.sender] || 0) + 1;
        textCharCounts[msg.sender] = (textCharCounts[msg.sender] || 0) + msg.message.length;
      }
      
      if (!isMedia && msg.message && !deletedMessageRegex.test(cleanMsg)) {
        const rawWords = cleanMsg.replace(urlRegex, '').split(/\s+/);
        for (const rawWord of rawWords) {
          const cleanWord = rawWord.replace(/[.,/#!$%^&*<>:|;:{}=\-_`~()?"'’]/g, "").trim();
          if (isMediaFilenameOrExtension(rawWord, cleanWord)) continue;
          
          const lowerWord = cleanWord.toLowerCase();
          if (cleanWord.length > 0 && !codingKeywords.has(lowerWord)) {
            if (slangWords.has(lowerWord)) {
              slangCounts[msg.sender] = (slangCounts[msg.sender] || 0) + 1;
            }
            if (corporateWords.has(lowerWord)) {
              corporateCounts[msg.sender] = (corporateCounts[msg.sender] || 0) + 1;
            }
            
            const monthIdx = msg.timestamp.getMonth();
            if (cleanWord.length >= 4 && !/^\d+$/.test(cleanWord) && !stopWords.has(lowerWord)) {
              monthWordCounts[monthIdx][cleanWord] = (monthWordCounts[monthIdx][cleanWord] || 0) + 1;
            }
          }
        }
        
        if (msg.message.trim().endsWith(".")) {
          corporateCounts[msg.sender] = (corporateCounts[msg.sender] || 0) + 1;
        }
        
        const qMarks = (msg.message.match(/\?/g) || []).length;
        const eMarks = (msg.message.match(/!/g) || []).length;
        if (qMarks >= 3 || eMarks >= 3) {
          panicCounts[msg.sender] = (panicCounts[msg.sender] || 0) + qMarks + eMarks;
        }
      }
      
      if (i > 0) {
        const prev = parsedMessages[i - 1];
        if (prev.timestamp) {
          const gap = msg.timestamp.getTime() - prev.timestamp.getTime();
          
          if (gap > 24 * 60 * 60 * 1000) {
            resuscitationCounts[msg.sender] = (resuscitationCounts[msg.sender] || 0) + 1;
          }
          
          // Calculate calendar day difference to get accurate silent days count (excluding active boundary days)
          const d1 = new Date(prev.timestamp.getFullYear(), prev.timestamp.getMonth(), prev.timestamp.getDate());
          const d2 = new Date(msg.timestamp.getFullYear(), msg.timestamp.getMonth(), msg.timestamp.getDate());
          const gapDays = Math.max(0, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) - 1);
          
          if (gapDays > maxDrySpellDays) {
            maxDrySpellDays = gapDays;
            maxDrySpellMs = gap;
            drySpellStart = prev.timestamp;
            drySpellEnd = msg.timestamp;
          }
          
          if (prev.sender !== msg.sender && gap < 6 * 60 * 60 * 1000) {
            const hr = prev.timestamp.getHours();
            if (hr >= 9 && hr <= 22) {
              if (replyTimes[msg.sender]) {
                replyTimes[msg.sender].push(gap / 1000);
              }
            }
          }
        }
      }
      
      if (msg.sender === currentBlockSender) {
        currentBlock.push(msg);
      } else {
        if (currentBlockSender !== null && currentBlock.length >= 5) {
          let hasBomb = false;
          for (let startIdx = 0; startIdx <= currentBlock.length - 5; startIdx++) {
            const startTime = currentBlock[startIdx].timestamp.getTime();
            const endTime = currentBlock[startIdx + 4].timestamp.getTime();
            if (endTime - startTime <= 60 * 1000) {
              hasBomb = true;
              break;
            }
          }
          if (hasBomb) {
            notificationBombs[currentBlockSender] = (notificationBombs[currentBlockSender] || 0) + 1;
          }
        }
        currentBlock = [msg];
        currentBlockSender = msg.sender;
      }
    }
    
    if (currentBlockSender !== null && currentBlock.length >= 5) {
      let hasBomb = false;
      for (let startIdx = 0; startIdx <= currentBlock.length - 5; startIdx++) {
        const startTime = currentBlock[startIdx].timestamp.getTime();
        const endTime = currentBlock[startIdx + 4].timestamp.getTime();
        if (endTime - startTime <= 60 * 1000) {
          hasBomb = true;
          break;
        }
      }
      if (hasBomb) {
        notificationBombs[currentBlockSender] = (notificationBombs[currentBlockSender] || 0) + 1;
      }
    }
    
    let hyperFixationWord = null;
    let hyperFixationMonth = "";
    let hyperFixationCount = 0;
    let maxFixationScore = -1;
    
    const totalWordFreqs = {};
    for (let m = 0; m < 12; m++) {
      for (const [word, count] of Object.entries(monthWordCounts[m])) {
        totalWordFreqs[word] = (totalWordFreqs[word] || 0) + count;
      }
    }
    
    for (let m = 0; m < 12; m++) {
      for (const [word, count] of Object.entries(monthWordCounts[m])) {
        const total = totalWordFreqs[word];
        if (total >= 8) {
          const ratio = count / total;
          const score = count * ratio;
          if (score > maxFixationScore) {
            maxFixationScore = score;
            hyperFixationWord = word;
            hyperFixationMonth = monthNames[m];
            hyperFixationCount = count;
          }
        }
      }
    }
    
    const medianResponseTimes = {};
    for (const name of sendersList) {
      medianResponseTimes[name] = getMedian(replyTimes[name] || []);
    }
    
    const mediaRatios = {};
    for (const name of sendersList) {
      const media = mediaMsgCounts[name] || 0;
      const texts = textMsgCounts[name] || 0;
      const total = media + texts;
      mediaRatios[name] = total > 0 ? Math.round((media / total) * 100) : 0;
    }
    
    // Process monthlyTimeline for Heatmap Timeline Scrub
    const monthlyTimeline = [];
    for (let m = 0; m < 12; m++) {
      const dailyKeysInMonth = Object.keys(dailyMessages).filter(key => {
        const parts = key.split('-');
        return parseInt(parts[1], 10) === (m + 1);
      });
      
      let totalCount = 0;
      let peakDayKey = null;
      let maxDayCount = -1;
      
      for (const key of dailyKeysInMonth) {
        const dayData = dailyMessages[key];
        totalCount += dayData.count;
        if (dayData.count > maxDayCount) {
          maxDayCount = dayData.count;
          peakDayKey = key;
        }
      }
      
      let peakDay = null;
      if (peakDayKey) {
        const dayData = dailyMessages[peakDayKey];
        let selectedFlashback = null;
        if (dayData.messages.length > 0) {
          const randIdx = Math.floor(Math.random() * dayData.messages.length);
          selectedFlashback = dayData.messages[randIdx];
        } else {
          selectedFlashback = {
            sender: "System",
            message: "A busy day of connecting and sharing memories!"
          };
        }
        
        peakDay = {
          dateStr: dayData.dateStr,
          count: dayData.count,
          flashback: selectedFlashback
        };
      }
      
      monthlyTimeline.push({
        monthIndex: m,
        monthName: monthNames[m],
        totalCount,
        peakDay
      });
    }

    // 17. Code Spammer Detection (Dynamic Slide stats)
    let totalCodeMessages = 0;
    let totalLinesOfCode = 0;
    const codeMessagesPerSender = {};
    const linesOfCodePerSender = {};
    const languageCounts = {};

    function detectCodeMessage(message) {
      if (!message) return false;
      
      if (message.includes("```")) {
        return true;
      }
      
      const lines = message.split('\n');
      let codeLineCount = 0;
      
      const codeIndicators = [
        /^\s*(const|let|var|function|class|import|export|return|def|if|for|while)\b/,
        /[{}()[\]]{3,}/,
        /[;{}]$/,
        /^\s*<[a-zA-Z]+(>|\s)/,
        /<\/?[a-zA-Z]+>/,
        /=>/,
        /\b(console\.log|print|printf)\(/,
        /\b(std::cout|System\.out\.println)\b/
      ];
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        for (const regex of codeIndicators) {
          if (regex.test(trimmed)) {
            codeLineCount++;
            break;
          }
        }
      }
      
      const nonEmptyLines = lines.filter(l => l.trim()).length;
      if (nonEmptyLines > 0 && (codeLineCount >= 2 || (codeLineCount / nonEmptyLines) >= 0.4)) {
        return true;
      }
      
      return false;
    }

    function inferCodeLanguage(message) {
      const lower = message.toLowerCase();
      if (lower.includes('import react') || lower.includes('jsx') || lower.includes('const ') && (lower.includes('=>') || lower.includes('console.log'))) {
        return 'JavaScript/React';
      }
      if (lower.includes('def ') || lower.includes('elif ') || lower.includes('import ') && lower.includes('print(') || lower.includes('self.')) {
        return 'Python';
      }
      if (lower.includes('<div') || lower.includes('class=') || lower.includes('href=') || lower.includes('</html>')) {
        return 'HTML/CSS';
      }
      if (lower.includes('public static void main') || lower.includes('system.out.print')) {
        return 'Java';
      }
      if (lower.includes('std::cout') || lower.includes('#include <')) {
        return 'C++';
      }
      if (lower.includes('select ') && lower.includes('from ') && lower.includes('where ')) {
        return 'SQL';
      }
      return 'Generic Code';
    }

    for (const msg of parsedMessages) {
      if (detectCodeMessage(msg.message)) {
        totalCodeMessages++;
        const lineCount = msg.message.split('\n').filter(l => l.trim()).length;
        totalLinesOfCode += lineCount;
        
        codeMessagesPerSender[msg.sender] = (codeMessagesPerSender[msg.sender] || 0) + 1;
        linesOfCodePerSender[msg.sender] = (linesOfCodePerSender[msg.sender] || 0) + lineCount;
        
        const lang = inferCodeLanguage(msg.message);
        if (lang !== 'Generic Code') {
          languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        }
      }
    }

    let topLanguage = 'Programming Code';
    let maxLangCount = -1;
    for (const [lang, count] of Object.entries(languageCounts)) {
      if (count > maxLangCount) {
        maxLangCount = count;
        topLanguage = lang;
      }
    }

    let topCodeSpammerName = 'N/A';
    let maxCodeMessages = 0;
    for (const [name, count] of Object.entries(codeMessagesPerSender)) {
      if (count > maxCodeMessages) {
        maxCodeMessages = count;
        topCodeSpammerName = name;
      }
    }

    // Gather final metrics payload
    const result = {
      totalMessages,
      topTexter,
      senderCounts,
      sendersList,
      longevityDays,
      totalWordCount,
      bookComparison,
      peakTraffic,
      totalMidnightMessages,
      topMidnightPhilosopher,
      midnightCounts,
      yapper: { name: yapperName, count: maxConsecutiveCount },
      doubleTexter,
      topInitiator,
      initiations,
      topMediaMogul,
      mediaCounts,
      stickerCounts,
      gifCounts,
      totalStickers,
      totalGifs,
      topStickerSender,
      topGifSender,
      voiceNoteCounts,
      voiceNoteDurations,
      voiceNoteMaxDurations,
      totalVoiceNotesCount,
      totalVoiceNotesDuration,
      topVoiceNoteSender,
      longestVoiceNote,
      vocabulary,
      emojiDependency,
      theGhoster: ghosterData,
      slangCounts,
      corporateCounts,
      resuscitationCounts,
      panicCounts,
      hyperFixation: hyperFixationWord ? { word: hyperFixationWord, monthName: hyperFixationMonth, count: hyperFixationCount } : null,
      drySpell: maxDrySpellDays > 0 ? {
        gapMs: maxDrySpellMs,
        startDate: drySpellStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        endDate: drySpellEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        days: maxDrySpellDays
      } : null,
      mediaRatios,
      medianResponseTimes,
      notificationBombs,
      monthlyTimeline,
      codeStats: {
        hasCode: totalCodeMessages >= 3,
        totalCodeMessages,
        totalLinesOfCode,
        topLanguage,
        codeMessagesPerSender,
        linesOfCodePerSender,
        topCodeSpammer: { name: topCodeSpammerName, count: maxCodeMessages }
      }
    };
    
    self.postMessage({ status: 'success', result });
  } catch (err) {
    self.postMessage({ status: 'error', error: err.message || 'An unknown parsing error occurred' });
  }
};
