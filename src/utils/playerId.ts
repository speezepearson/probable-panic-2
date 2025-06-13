const PLAYER_ID_KEY = 'probable-panic-player-id';

export function generatePlayerId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(PLAYER_ID_KEY);
  if (existing) {
    return existing;
  }
  
  const newId = generatePlayerId();
  localStorage.setItem(PLAYER_ID_KEY, newId);
  return newId;
}

export function getPlayerId(): string | null {
  return localStorage.getItem(PLAYER_ID_KEY);
}