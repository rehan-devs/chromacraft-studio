import chroma from 'chroma-js';
import type { ColorValue, ShadeStep, HarmonyColor, DarkModeColor } from '../types';
import { getContrastRatio, getWCAGRating } from './contrastChecker';

function toColorValue(hex: string): ColorValue {
  const c = chroma(hex);
  const [r, g, b] = c.rgb();
  const [h, s, l] = c.hsl();
  return {
    hex: c.hex().toUpperCase(),
    rgb: { r, g, b },
    hsl: {
      h: Math.round(isNaN(h) ? 0 : h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    },
  };
}

function createShadeStep(hex: string, step: number): ShadeStep {
  const onWhite = getContrastRatio(hex, '#FFFFFF');
  const onBlack = getContrastRatio(hex, '#000000');
  return {
    step,
    color: toColorValue(hex),
    contrastOnWhite: onWhite,
    contrastOnBlack: onBlack,
    wcagWhite: getWCAGRating(onWhite),
    wcagBlack: getWCAGRating(onBlack),
  };
}

export function generateShadeScale(hex: string): ShadeStep[] {
  const baseColor = chroma(hex);
  const warmWhite = '#FFFEF9';
  const warmBlack = '#121210';

  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // Create light scale from warm white to base using LAB
  const lightScale = chroma
    .scale([warmWhite, hex])
    .mode('lab')
    .colors(6); // produces 50, 100, 200, 300, 400, (500=base)

  // Create dark scale from base to warm black using LAB
  const darkScale = chroma
    .scale([hex, warmBlack])
    .mode('lab')
    .colors(6); // (500=base), 600, 700, 800, 900, 950

  const rawColors: string[] = [
    lightScale[0]!, // 50
    lightScale[1]!, // 100
    lightScale[2]!, // 200
    lightScale[3]!, // 300
    lightScale[4]!, // 400
    hex,            // 500
    darkScale[1]!,  // 600
    darkScale[2]!,  // 700
    darkScale[3]!,  // 800
    darkScale[4]!,  // 900
    darkScale[5]!,  // 950
  ];

  // Apply organic adjustments
  const baseHue = baseColor.get('hsl.h') || 0;

  return steps.map((step, i) => {
    let c = chroma(rawColors[i]!);

    // Very light tints: slightly desaturate for natural feel
    if (step <= 100) {
      const currentSat = c.get('hsl.s');
      c = c.set('hsl.s', currentSat * 0.7);
    } else if (step <= 200) {
      const currentSat = c.get('hsl.s');
      c = c.set('hsl.s', currentSat * 0.85);
    }

    // Very dark shades: shift hue slightly toward blue (natural shadow behavior)
    if (step >= 800) {
      const currentHue = c.get('hsl.h') || 0;
      const blueShift = step === 950 ? 8 : step === 900 ? 5 : 3;
      const targetHue = currentHue + (currentHue < 240 ? blueShift : -blueShift);
      c = c.set('hsl.h', targetHue);
    }

    return createShadeStep(c.hex(), step);
  });
}

export function generateHarmonyColors(hex: string): HarmonyColor[] {
  const base = chroma(hex);
  const hue = base.get('hsl.h') || 0;

  const harmonies: { type: HarmonyColor['type']; rotation: number }[] = [
    { type: 'complementary', rotation: 180 },
    { type: 'analogous-1', rotation: 30 },
    { type: 'analogous-2', rotation: -30 },
    { type: 'triadic-1', rotation: 120 },
    { type: 'triadic-2', rotation: -120 },
    { type: 'split-comp-1', rotation: 150 },
    { type: 'split-comp-2', rotation: -150 },
  ];

  return harmonies.map(({ type, rotation }) => {
    const newHue = (hue + rotation + 360) % 360;
    const harmonyHex = base.set('hsl.h', newHue).hex();
    return {
      type,
      color: toColorValue(harmonyHex),
      shades: generateShadeScale(harmonyHex),
    };
  });
}

export function generateDarkModePalette(hex: string): DarkModeColor[] {
  const base = chroma(hex);
  const hue = base.get('lch.h') || 0;

  const makeColor = (l: number, c: number, label: string, role: DarkModeColor['role']): DarkModeColor => {
    const color = chroma.lch(l, c, hue);
    return { role, color: toColorValue(color.hex()), label };
  };

  return [
    makeColor(9, 4, 'Background', 'background'),
    makeColor(13, 5, 'Surface', 'surface'),
    makeColor(17, 6, 'Surface Elevated', 'surface-elevated'),
    (() => {
      const adjusted = chroma.lch(63, base.get('lch.c') * 0.85, hue);
      return {
        role: 'primary' as const,
        color: toColorValue(adjusted.hex()),
        label: 'Primary',
      };
    })(),
    makeColor(20, 10, 'Primary Subtle', 'primary-subtle'),
    {
      role: 'text-primary' as const,
      color: toColorValue('#F0EFEB'),
      label: 'Text Primary',
    },
    (() => {
      const c = chroma.lch(70, 3, hue);
      return {
        role: 'text-secondary' as const,
        color: toColorValue(c.hex()),
        label: 'Text Secondary',
      };
    })(),
    (() => {
      const c = chroma.lch(45, 3, hue);
      return {
        role: 'text-muted' as const,
        color: toColorValue(c.hex()),
        label: 'Text Muted',
      };
    })(),
    makeColor(22, 6, 'Border', 'border'),
    makeColor(16, 4, 'Border Subtle', 'border-subtle'),
  ];
}