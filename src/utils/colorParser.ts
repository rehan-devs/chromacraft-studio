import chroma from 'chroma-js';
import type { ColorInputFormat } from '../types';

export function parseColorInput(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try direct hex (with or without #)
  if (/^#?[0-9a-fA-F]{3}$/.test(trimmed) || /^#?[0-9a-fA-F]{6}$/.test(trimmed)) {
    const hex = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    try {
      if (chroma.valid(hex)) return chroma(hex).hex();
    } catch {
      return null;
    }
  }

  // Try rgb format: rgb(r, g, b) or r, g, b or r g b
  const rgbMatch = trimmed.match(
    /^rgb\s*\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)$/i
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    try {
      return chroma(+r!, +g!, +b!).hex();
    } catch {
      return null;
    }
  }

  const rgbPlainMatch = trimmed.match(
    /^(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})$/
  );
  if (rgbPlainMatch) {
    const [, r, g, b] = rgbPlainMatch;
    try {
      return chroma(+r!, +g!, +b!).hex();
    } catch {
      return null;
    }
  }

  // Try HSL format: hsl(h, s%, l%) or h, s, l
  const hslMatch = trimmed.match(
    /^hsl\s*\(\s*(\d{1,3}(?:\.\d+)?)\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*[,\s]\s*(\d{1,3}(?:\.\d+)?)%?\s*\)$/i
  );
  if (hslMatch) {
    const [, h, s, l] = hslMatch;
    try {
      return chroma.hsl(+h!, +s! / 100, +l! / 100).hex();
    } catch {
      return null;
    }
  }

  // Try chroma.js general parsing
  try {
    if (chroma.valid(trimmed)) {
      return chroma(trimmed).hex();
    }
  } catch {
    // fall through
  }

  return null;
}

export function detectFormat(input: string): ColorInputFormat {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.startsWith('hsl')) return 'hsl';
  if (trimmed.startsWith('rgb')) return 'rgb';
  return 'hex';
}

export function formatColor(hex: string, format: ColorInputFormat): string {
  try {
    const c = chroma(hex);
    switch (format) {
      case 'hex':
        return c.hex().toUpperCase();
      case 'rgb': {
        const [r, g, b] = c.rgb();
        return `rgb(${r}, ${g}, ${b})`;
      }
      case 'hsl': {
        const [h, s, l] = c.hsl();
        return `hsl(${Math.round(isNaN(h) ? 0 : h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }
    }
  } catch {
    return hex;
  }
}