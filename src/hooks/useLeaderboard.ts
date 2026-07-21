import { useState, useCallback } from 'react';
import type { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'textShooterLB';

function load(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function save(list: LeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function useLeaderboard() {
  const [list, setList] = useState<LeaderboardEntry[]>(load);

  const addEntry = useCallback((name: string, score: number): { entry: LeaderboardEntry; rank: number } => {
    const entry: LeaderboardEntry = { name, score, date: new Date().toISOString().slice(0, 10) };
    const updated = [...list, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    save(updated);
    setList(updated);
    const rank = updated.findIndex((e) => e === entry) + 1;
    return { entry, rank };
  }, [list]);

  return { list, addEntry };
}
