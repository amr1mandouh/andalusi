import type { Language } from '../services/speechService';

/**
 * ElevenLabs voice IDs used by the app.
 * English lessons use the "Butcher" voice, Spanish lessons use the "Tokyo" voice.
 */
export const BUTCHER_VOICE_ID: string =
  import.meta.env.VITE_BUTCHER_VOICE_ID || '85o4S4rAEvTIDGtpFNUq';

export const TOKYO_VOICE_ID: string =
  import.meta.env.VITE_TOKYO_VOICE_ID || 'jsCqWAovK2Lkecj7j73F';

export const VOICE_ID_BY_LANG: Record<Language, string> = {
  en: BUTCHER_VOICE_ID,
  es: TOKYO_VOICE_ID,
};