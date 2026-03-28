import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import type { ShadeStep } from '../../types';
import SectionTitle from '../Common/SectionTitle';
import { getContrastRatio, getWCAGRating } from '../../utils/contrastChecker';

interface ContrastGridProps {
  shades: ShadeStep[];
  accentColor: string;
}

function wcagColor(rating: string): string {
  switch (rating) {
    case 'AAA': return '#16A34A';
    case 'AA': return '#D97706';
    case 'AA Large': return '#EA580C';
    case 'Fail': return '#DC2626';
    default: return '#DC2626';
  }
}

function textColorForBg(hex: string): string {
  try {
    const luminance = chroma(hex).luminance();
    return luminance > 0.4 ? '#1A1A19' : '#F5F5F4';
  } catch {
    return '#1A1A19';
  }
}

const ContrastGrid: React.FC<ContrastGridProps> = ({ shades, accentColor }) => {
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');
  const [bgShadeIdx, setBgShadeIdx] = useState(0);
  const [fgMode, setFgMode] = useState<'white' | 'black' | 'shade'>('white');
  const [fgShadeIdx, setFgShadeIdx] = useState(10);
  const [fontSize, setFontSize] = useState(16);

  const passWhiteCount = useMemo(
    () => shades.filter((s) => s.wcagWhite === 'AAA' || s.wcagWhite === 'AA').length,
    [shades]
  );
  const passBlackCount = useMemo(
    () => shades.filter((s) => s.wcagBlack === 'AAA' || s.wcagBlack === 'AA').length,
    [shades]
  );

  const previewBg = shades[bgShadeIdx]?.color.hex || '#FFFFFF';
  const previewFg = useMemo(() => {
    if (fgMode === 'white') return '#FFFFFF';
    if (fgMode === 'black') return '#000000';
    return shades[fgShadeIdx]?.color.hex || '#000000';
  }, [fgMode, fgShadeIdx, shades]);

  const previewContrast = getContrastRatio(previewBg, previewFg);
  const previewRating = getWCAGRating(previewContrast);

  const previewTextId = 'input-preview-text';
  const bgSelectId = 'select-bg-shade';
  const fgSelectId = 'select-fg-shade';
  const fontSizeId = 'slider-font-size';

  return (
    <div>
      <SectionTitle
        title="Accessibility Audit"
        subtitle="WCAG 2.1 contrast ratings for every shade"
        accentColor={accentColor}
      />

      {/* Summary stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-4 mb-8"
      >
        <div className="bg-white rounded-xl border border-black/[0.06] px-4 sm:px-5 py-3">
          <p className="text-[11px] sm:text-xs text-[#6B6965] mb-0.5">Pass AA · white text</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#1A1A19]">
            {passWhiteCount}
            <span className="text-sm text-[#9C9890] font-normal"> / {shades.length}</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-black/[0.06] px-4 sm:px-5 py-3">
          <p className="text-[11px] sm:text-xs text-[#6B6965] mb-0.5">Pass AA · black text</p>
          <p className="text-xl sm:text-2xl font-semibold text-[#1A1A19]">
            {passBlackCount}
            <span className="text-sm text-[#9C9890] font-normal"> / {shades.length}</span>
          </p>
        </div>
      </motion.div>

      {/* Contrast grid — redesigned for mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-12 space-y-2"
      >
        {shades.map((shade, i) => {
          const autoTextColor = textColorForBg(shade.color.hex);
          const contrastWhiteNum = shade.contrastOnWhite.toFixed(1);
          const contrastBlackNum = shade.contrastOnBlack.toFixed(1);

          return (
            <motion.div
              key={shade.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-3"
            >
              {/* Step label */}
              <div className="w-full sm:w-14 flex-shrink-0 flex items-center sm:justify-end gap-2 sm:gap-0">
                <div
                  className="w-5 h-5 rounded sm:hidden flex-shrink-0"
                  style={{ backgroundColor: shade.color.hex }}
                />
                <span className="text-xs font-mono font-semibold text-[#1A1A19]">
                  {shade.step}
                </span>
                <span className="text-[10px] font-mono text-[#9C9890] sm:hidden">
                  {shade.color.hex}
                </span>
              </div>

              {/* White text preview */}
              <div
                className="flex-1 rounded-lg px-3 sm:px-4 py-2.5 flex items-center justify-between min-h-[42px]"
                style={{ backgroundColor: shade.color.hex }}
              >
                <span className="text-sm font-semibold text-white drop-shadow-sm">Aa</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className="text-xs font-mono font-medium"
                    style={{ color: autoTextColor, opacity: 0.7 }}
                  >
                    {contrastWhiteNum}
                  </span>
                  <span
                    className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: wcagColor(shade.wcagWhite) }}
                  >
                    {shade.wcagWhite}
                  </span>
                </div>
              </div>

              {/* Black text preview */}
              <div
                className="flex-1 rounded-lg px-3 sm:px-4 py-2.5 flex items-center justify-between min-h-[42px]"
                style={{ backgroundColor: shade.color.hex }}
              >
                <span className="text-sm font-semibold text-black">Aa</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span
                    className="text-xs font-mono font-medium"
                    style={{ color: autoTextColor, opacity: 0.7 }}
                  >
                    {contrastBlackNum}
                  </span>
                  <span
                    className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: wcagColor(shade.wcagBlack) }}
                  >
                    {shade.wcagBlack}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Live Text Preview */}
      <div className="bg-white rounded-xl border border-black/[0.06] p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-[#1A1A19] tracking-tight mb-1">
          Live Text Preview
        </h3>
        <p className="text-sm text-[#6B6965] mb-6">
          Test your real content against the palette
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label htmlFor={previewTextId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider mb-1.5 block">
                Preview Text
              </label>
              <input
                id={previewTextId}
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                aria-label="Preview text content"
                className="w-full h-10 px-3 rounded-lg border border-black/[0.06] bg-[#FAF9F7] text-sm text-[#1A1A19] outline-none focus:border-black/10 transition-colors"
              />
            </div>

            <div>
              <label htmlFor={bgSelectId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider mb-1.5 block">
                Background
              </label>
              <select
                id={bgSelectId}
                value={bgShadeIdx}
                onChange={(e) => setBgShadeIdx(+e.target.value)}
                aria-label="Background shade"
                className="w-full h-10 px-3 rounded-lg border border-black/[0.06] bg-[#FAF9F7] text-sm text-[#1A1A19] outline-none"
              >
                {shades.map((s, i) => (
                  <option key={s.step} value={i}>
                    {s.step} — {s.color.hex}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className="text-xs font-medium text-[#6B6965] uppercase tracking-wider mb-1.5 block">
                Text Color
              </span>
              <div className="flex gap-2 mb-2" role="radiogroup" aria-label="Text color mode">
                {(['white', 'black', 'shade'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFgMode(mode)}
                    role="radio"
                    aria-checked={fgMode === mode}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      fgMode === mode
                        ? 'bg-[#1A1A19] text-white'
                        : 'bg-black/[0.04] text-[#6B6965] hover:text-[#1A1A19]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              {fgMode === 'shade' && (
                <select
                  id={fgSelectId}
                  value={fgShadeIdx}
                  onChange={(e) => setFgShadeIdx(+e.target.value)}
                  aria-label="Foreground shade"
                  className="w-full h-10 px-3 rounded-lg border border-black/[0.06] bg-[#FAF9F7] text-sm text-[#1A1A19] outline-none"
                >
                  {shades.map((s, i) => (
                    <option key={s.step} value={i}>
                      {s.step} — {s.color.hex}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor={fontSizeId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider">
                  Font Size
                </label>
                <span className="text-xs font-mono text-[#6B6965]">{fontSize}px</span>
              </div>
              <input
                id={fontSizeId}
                type="range"
                min={12}
                max={48}
                value={fontSize}
                onChange={(e) => setFontSize(+e.target.value)}
                aria-label="Font size"
                className="w-full"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <div
              className="flex-1 min-h-[160px] rounded-xl flex items-center justify-center p-6"
              style={{ backgroundColor: previewBg }}
            >
              <p
                className="font-semibold text-center leading-snug break-words"
                style={{
                  color: previewFg,
                  fontSize: `${fontSize}px`,
                }}
              >
                {previewText || 'Type something above...'}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#6B6965]">
                Contrast:{' '}
                <span className="font-mono font-semibold text-[#1A1A19]">
                  {previewContrast.toFixed(2)}:1
                </span>
              </span>
              <span
                className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full"
                style={{ backgroundColor: wcagColor(previewRating) }}
              >
                {previewRating}
                {fontSize >= 18 && previewContrast >= 3 && previewContrast < 4.5 && ' (Large text)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContrastGrid;