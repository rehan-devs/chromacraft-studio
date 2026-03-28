import { useState, useCallback, useEffect } from 'react';
import type { SavedPalette } from '../types';

const STORAGE_KEY = 'chromacraft-palettes';

function loadFromStorage(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SavedPalette[];
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(palettes: SavedPalette[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
}

export function useSavedPalettes() {
  const [palettes, setPalettes] = useState<SavedPalette[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(palettes);
  }, [palettes]);

  const savePalette = useCallback((name: string, baseColor: string) => {
    const newPalette: SavedPalette = {
      id: crypto.randomUUID(),
      name,
      baseColor,
      createdAt: Date.now(),
    };
    setPalettes((prev) => [newPalette, ...prev]);
  }, []);

  const deletePalette = useCallback((id: string) => {
    setPalettes((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const loadPalette = useCallback(
    (id: string): string => {
      const found = palettes.find((p) => p.id === id);
      return found?.baseColor ?? '';
    },
    [palettes]
  );

  return { palettes, savePalette, deletePalette, loadPalette };
}