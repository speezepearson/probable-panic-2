import { PlayerId, PlayerIdSchema } from '../../convex/shared/playerId';

const PLAYER_ID_KEY = 'probable-panic-player-id';

export function generatePlayerId(): PlayerId {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return PlayerIdSchema.parse(result);
}

export function getOrCreatePlayerId(): PlayerId {
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) {
    const parsed = PlayerIdSchema.safeParse(existing);
    if (parsed.success) {
      return parsed.data;
    }
  }
  
  const newId = generatePlayerId();
  localStorage.setItem(PLAYER_ID_KEY, newId);
  return newId;
}

export function getPlayerId(): PlayerId | null {
  const stored = localStorage.getItem(PLAYER_ID_KEY);
  if (!stored) return null;
  
  const parsed = PlayerIdSchema.safeParse(stored);
  return parsed.success ? parsed.data : null;
}