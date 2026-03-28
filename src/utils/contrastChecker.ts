import chroma from 'chroma-js';
import type { WCAGRating } from '../types';

export function getContrastRatio(color1: string, color2: string): number {
  try {
    return chroma.contrast(color1, color2);
  } catch {
    return 0;
  }
}

export function getWCAGRating(ratio: number): WCAGRating {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function getContrastInfo(hex: string): {
  onWhite: number;
  onBlack: number;
  wcagWhite: WCAGRating;
  wcagBlack: WCAGRating;
} {
  const onWhite = getContrastRatio(hex, '#FFFFFF');
  const onBlack = getContrastRatio(hex, '#000000');
  return {
    onWhite,
    onBlack,
    wcagWhite: getWCAGRating(onWhite),
    wcagBlack: getWCAGRating(onBlack),
  };
}