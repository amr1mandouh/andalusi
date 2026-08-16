/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_BUTCHER_VOICE_ID: string;
  readonly VITE_TOKYO_VOICE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
