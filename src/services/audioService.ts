import { speak, type Language } from './speechService';
import { VOICE_ID_BY_LANG } from '../config/voices';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
const ELEVENLABS_TTS_ENDPOINT = 'https://api.elevenlabs.io/v1/text-to-speech';

let currentAudio: HTMLAudioElement | null = null;
const audioUrlCache = new Map<string, string>();

function stopCurrentAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

async function fetchElevenLabsAudioUrl(text: string, voiceId: string): Promise<string> {
  const cacheKey = `${voiceId}::${text}`;
  const cached = audioUrlCache.get(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${ELEVENLABS_TTS_ENDPOINT}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
      'xi-api-key': ELEVENLABS_API_KEY ?? '',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs request failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  audioUrlCache.set(cacheKey, url);
  return url;
}

/**
 * Plays audio for the given text using ElevenLabs, selecting the voice based on
 * language (English -> Butcher voice, Spanish -> Tokyo voice).
 * Falls back to the browser's built-in speechSynthesis if no API key is configured
 * or if the ElevenLabs request fails for any reason, so audio playback never breaks.
 */
export async function getElevenLabsAudio(text: string, lang: Language): Promise<void> {
  stopCurrentAudio();

  if (!ELEVENLABS_API_KEY) {
    speak(text, lang);
    return;
  }

  const voiceId = VOICE_ID_BY_LANG[lang];

  try {
    const url = await fetchElevenLabsAudioUrl(text, voiceId);
    const audio = new Audio(url);
    currentAudio = audio;
    await audio.play();
  } catch (error) {
    console.error('ElevenLabs audio failed, falling back to browser speech synthesis:', error);
    speak(text, lang);
  }
}

export function stopElevenLabsAudio(): void {
  stopCurrentAudio();
}
