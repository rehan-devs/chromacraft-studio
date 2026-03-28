export interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface ShadeStep {
  step: number;
  color: ColorValue;
  contrastOnWhite: number;
  contrastOnBlack: number;
  wcagWhite: WCAGRating;
  wcagBlack: WCAGRating;
}

export type WCAGRating = 'AAA' | 'AA' | 'AA Large' | 'Fail';

export interface HarmonyColor {
  type:
    | 'complementary'
    | 'analogous-1'
    | 'analogous-2'
    | 'triadic-1'
    | 'triadic-2'
    | 'split-comp-1'
    | 'split-comp-2';
  color: ColorValue;
  shades: ShadeStep[];
}

export interface DarkModeColor {
  role:
    | 'background'
    | 'surface'
    | 'surface-elevated'
    | 'primary'
    | 'primary-subtle'
    | 'text-primary'
    | 'text-secondary'
    | 'text-muted'
    | 'border'
    | 'border-subtle';
  color: ColorValue;
  label: string;
}

export type ExportFormat = 'css' | 'tailwind' | 'scss' | 'json';

export interface SavedPalette {
  id: string;
  name: string;
  baseColor: string;
  createdAt: number;
}

export type ColorInputFormat = 'hex' | 'rgb' | 'hsl';