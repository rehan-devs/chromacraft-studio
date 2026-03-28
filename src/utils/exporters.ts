import type { ShadeStep, HarmonyColor, DarkModeColor } from '../types';

function harmonyTypeName(type: string): string {
  return type.replace(/-/g, '-');
}

export function exportAsCSS(
  shades: ShadeStep[],
  harmonies: HarmonyColor[],
  darkMode: DarkModeColor[],
  baseName: string
): string {
  let output = `/* ChromaCraft Studio — CSS Custom Properties */\n`;
  output += `/* Generated color system */\n\n`;
  output += `:root {\n`;
  output += `  /* ${baseName} shade scale */\n`;

  for (const shade of shades) {
    output += `  --color-${baseName}-${shade.step}: ${shade.color.hex};\n`;
  }

  output += `\n  /* Harmony colors */\n`;
  for (const harmony of harmonies) {
    output += `  --color-${baseName}-${harmonyTypeName(harmony.type)}: ${harmony.color.hex};\n`;
  }

  output += `}\n\n`;
  output += `/* Dark mode */\n`;
  output += `.dark {\n`;

  for (const dm of darkMode) {
    output += `  --color-${baseName}-${dm.role}: ${dm.color.hex};\n`;
  }

  output += `}\n`;

  return output;
}

export function exportAsTailwind(
  shades: ShadeStep[],
  harmonies: HarmonyColor[],
  baseName: string
): string {
  let output = `// ChromaCraft Studio — Tailwind Config\n`;
  output += `// Add to tailwind.config.js → theme.extend.colors\n\n`;
  output += `module.exports = {\n`;
  output += `  theme: {\n`;
  output += `    extend: {\n`;
  output += `      colors: {\n`;
  output += `        '${baseName}': {\n`;

  for (const shade of shades) {
    output += `          ${shade.step}: '${shade.color.hex}',\n`;
  }

  output += `        },\n`;

  for (const harmony of harmonies) {
    output += `        '${baseName}-${harmonyTypeName(harmony.type)}': {\n`;
    for (const shade of harmony.shades) {
      output += `          ${shade.step}: '${shade.color.hex}',\n`;
    }
    output += `        },\n`;
  }

  output += `      },\n`;
  output += `    },\n`;
  output += `  },\n`;
  output += `};\n`;

  return output;
}

export function exportAsSCSS(
  shades: ShadeStep[],
  harmonies: HarmonyColor[],
  darkMode: DarkModeColor[],
  baseName: string
): string {
  let output = `// ChromaCraft Studio — SCSS Variables\n\n`;
  output += `// ${baseName} shade scale\n`;

  for (const shade of shades) {
    output += `$color-${baseName}-${shade.step}: ${shade.color.hex};\n`;
  }

  output += `\n// Harmony colors\n`;
  for (const harmony of harmonies) {
    output += `$color-${baseName}-${harmonyTypeName(harmony.type)}: ${harmony.color.hex};\n`;
  }

  output += `\n// Dark mode tokens\n`;
  for (const dm of darkMode) {
    output += `$color-${baseName}-dark-${dm.role}: ${dm.color.hex};\n`;
  }

  return output;
}

export function exportAsJSON(
  shades: ShadeStep[],
  harmonies: HarmonyColor[],
  darkMode: DarkModeColor[]
): string {
  const data = {
    shades: shades.reduce(
      (acc, s) => ({ ...acc, [s.step]: { hex: s.color.hex, rgb: s.color.rgb, hsl: s.color.hsl } }),
      {} as Record<number, unknown>
    ),
    harmonies: harmonies.reduce(
      (acc, h) => ({
        ...acc,
        [h.type]: {
          base: { hex: h.color.hex, rgb: h.color.rgb, hsl: h.color.hsl },
          shades: h.shades.reduce(
            (sa, s) => ({ ...sa, [s.step]: { hex: s.color.hex, rgb: s.color.rgb, hsl: s.color.hsl } }),
            {} as Record<number, unknown>
          ),
        },
      }),
      {} as Record<string, unknown>
    ),
    darkMode: darkMode.reduce(
      (acc, d) => ({ ...acc, [d.role]: { hex: d.color.hex, rgb: d.color.rgb, hsl: d.color.hsl, label: d.label } }),
      {} as Record<string, unknown>
    ),
  };

  return JSON.stringify(data, null, 2);
}