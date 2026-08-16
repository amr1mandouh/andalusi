import { supabase } from './supabaseClient';
import type { Level } from '../data/lessons';

export interface Profile {
  id: string;
  display_name: string | null;
  level: Level | null;
  placement_completed: boolean;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error) {
    console.error('Failed to load profile:', error.message);
    return null;
  }
  return (data as Profile) ?? null;
}

export async function upsertProfile(userId: string, updates: Partial<Omit<Profile, 'id'>>): Promise<void> {
  const { error } = await supabase.from('profiles').upsert(
    { id: userId, ...updates, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  );
  if (error) console.error('Failed to save profile:', error.message);
}
