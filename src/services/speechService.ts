export type Language = 'en' | 'es';

interface VoiceConfig {
  lang: string;
  preferredVoiceNames: string[];
  gender: 'male' | 'female';
  pitch: number;
  rate: number;
}

const VOICE_CONFIGS: Record<Language, VoiceConfig> = {
  en: {
    lang: 'en-GB',
    preferredVoiceNames: [
      'Google UK English Male',
      'Microsoft Ryan - English (United Kingdom)',
      'Microsoft George - English (United Kingdom)',
      'Daniel',
      'Arthur',
      'en-GB',
    ],
    gender: 'male',
    pitch: 0.9,
    rate: 0.9,
  },
  es: {
    lang: 'es-ES',
    preferredVoiceNames: [
      'Google español',
      'Google Spanish',
      'Microsoft Helena - Spanish (Spain)',
      'Microsoft Laura - Spanish (Spain)',
      'Microsoft Sabina - Spanish (Spain)',
      'Monica',
      'Paulina',
      'es-ES',
      'es-MX',
    ],
    gender: 'female',
    pitch: 1.1,
    rate: 0.9,
  },
};

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    const handler = () => {
      cachedVoices = synth.getVoices();
      synth.removeEventListener('voiceschanged', handler);
      resolve(cachedVoices);
    };
    synth.addEventListener('voiceschanged', handler);
  });
}

function pickVoice(lang: Language, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const config = VOICE_CONFIGS[lang];
  for (const name of config.preferredVoiceNames) {
    const match = voices.find((v) => v.name === name);
    if (match) return match;
  }
  const langMatch = voices.filter((v) => v.lang.startsWith(config.lang.split('-')[0]));
  if (langMatch.length > 0) {
    const genderMatch = langMatch.find((v) => {
      const n = v.name.toLowerCase();
      if (config.gender === 'male') return /male|ryan|george|daniel|arthur|jorge|miguel/.test(n);
      return /female|helena|laura|sabina|monica|paulina|marisol|elvira/.test(n);
    });
    return genderMatch ?? langMatch[0];
  }
  return undefined;
}

let initialized = false;

export async function initSpeech(): Promise<void> {
  if (initialized) return;
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  await loadVoices();
  initialized = true;
}

export function speak(text: string, lang: Language): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const config = VOICE_CONFIGS[lang];
  const voices = cachedVoices.length > 0 ? cachedVoices : synth.getVoices();
  const voice = pickVoice(lang, voices);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = config.lang;
  if (voice) utterance.voice = voice;
  utterance.pitch = config.pitch;
  utterance.rate = config.rate;
  utterance.volume = 1;

  synth.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getVoiceInfo(lang: Language): { accent: string; gender: string } {
  if (lang === 'en') return { accent: 'British', gender: 'Male' };
  return { accent: 'Native Spanish', gender: 'Female' };
}

// --- Speech recognition (used by the pronunciation quiz question type) ---

interface SpeechRecognitionResultLike {
  transcript: string;
}

type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>> }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

/**
 * Listens for a short spoken phrase and resolves with the best transcript.
 * Resolves with an empty string if recognition isn't supported, fails, or times out.
 */
export function listenOnce(lang: Language, timeoutMs = 6000): Promise<string> {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return Promise.resolve('');

  return new Promise((resolve) => {
    const recognition = new Ctor();
    recognition.lang = lang === 'es' ? 'es-ES' : 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let settled = false;
    const finish = (value: string) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const timer = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      finish('');
    }, timeoutMs);

    recognition.onresult = (event) => {
      clearTimeout(timer);
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      finish(transcript);
    };
    recognition.onerror = () => {
      clearTimeout(timer);
      finish('');
    };
    recognition.onend = () => {
      clearTimeout(timer);
      finish('');
    };

    try {
      recognition.start();
    } catch {
      clearTimeout(timer);
      finish('');
    }
  });
}

/** Normalizes text for lenient comparison: lowercase, strip accents/punctuation. */
export function normalizeForCompare(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/** Very small Levenshtein distance for fuzzy matching short words/phrases. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

/** Returns true if the spoken transcript is close enough to the target phrase. */
export function isCloseEnough(target: string, transcript: string): boolean {
  const a = normalizeForCompare(target);
  const b = normalizeForCompare(transcript);
  if (!a || !b) return false;
  if (a === b) return true;
  const distance = levenshtein(a, b);
  const tolerance = Math.max(1, Math.round(a.length * 0.3));
  return distance <= tolerance;
}
