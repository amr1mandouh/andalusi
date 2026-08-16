import { supabase } from './supabaseClient';

const WORDS_KEY = 'andalusi_starred_words';
const IDIOMS_KEY = 'andalusi_starred_idioms';

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeList(key: string, ids: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private mode, etc.) — fail silently
  }
}

type ItemType = 'word' | 'idiom';

export async function getStarredIds(type: ItemType, userId: string | null): Promise<string[]> {
  if (userId) {
    const { data, error } = await supabase
      .from('starred_items')
      .select('item_id')
      .eq('user_id', userId)
      .eq('item_type', type);
    if (error) {
      console.error('Failed to load starred items:', error.message);
      return [];
    }
    return (data ?? []).map((row) => row.item_id as string);
  }
  return readList(type === 'word' ? WORDS_KEY : IDIOMS_KEY);
}

export async function toggleStarred(type: ItemType, itemId: string, userId: string | null): Promise<string[]> {
  if (userId) {
    const current = await getStarredIds(type, userId);
    if (current.includes(itemId)) {
      const { error } = await supabase
        .from('starred_items')
        .delete()
        .eq('user_id', userId)
        .eq('item_type', type)
        .eq('item_id', itemId);
      if (error) console.error('Failed to unstar item:', error.message);
      return current.filter((id) => id !== itemId);
    }
    const { error } = await supabase
      .from('starred_items')
      .insert({ user_id: userId, item_type: type, item_id: itemId });
    if (error) console.error('Failed to star item:', error.message);
    return [...current, itemId];
  }

  const key = type === 'word' ? WORDS_KEY : IDIOMS_KEY;
  const current = readList(key);
  const next = current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId];
  writeList(key, next);
  return next;
}
