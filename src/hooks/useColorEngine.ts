import { useMemo } from 'react';
import chroma from 'chroma-js';
import type { ColorValue, ShadeStep, HarmonyColor, DarkModeColor } from '../types';
import { generateShadeScale, generateHarmonyColors, generateDarkModePalette } from '../utils/colorGenerator';

interface ColorEngineResult {
  baseColor: ColorValue | null;
  shades: ShadeStep[];
  harmonies: HarmonyColor[];
  darkModePalette: DarkModeColor[];
  isValid: boolean;
}

export function useColorEngine(hex: string | null): ColorEngineResult {
  return useMemo(() => {
    if (!hex || !chroma.valid(hex)) {
      return {
        baseColor: null,
        shades: [],
        harmonies: [],
        darkModePalette: [],
        isValid: false,
      };
    }

    try {
      const c = chroma(hex);
      const [r, g, b] = c.rgb();
      const [h, s, l] = c.hsl();

      const baseColor: ColorValue = {
        hex: c.hex().toUpperCase(),
        rgb: { r, g, b },
        hsl: {
          h: Math.round(isNaN(h) ? 0 : h),
          s: Math.round(s * 100),
          l: Math.round(l * 100),
        },
      };

      const shades = generateShadeScale(hex);
      const harmonies = generateHarmonyColors(hex);
      const darkModePalette = generateDarkModePalette(hex);

      return {
        baseColor,
        shades,
        harmonies,
        darkModePalette,
        isValid: true,
      };
    } catch {
      return {
        baseColor: null,
        shades: [],
        harmonies: [],
        darkModePalette: [],
        isValid: false,
      };
    }
  }, [hex]);
}