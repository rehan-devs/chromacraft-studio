import React from 'react';
import { motion } from 'framer-motion';
import type { HarmonyColor } from '../../types';
import SectionTitle from '../Common/SectionTitle';
import CopyButton from '../Common/CopyButton';
import { getContrastRatio } from '../../utils/contrastChecker';

interface HarmonySectionProps {
  harmonies: HarmonyColor[];
  baseHex: string;
  accentColor: string;
  onSetBaseColor: (hex: string) => void;
}

const harmonyLabels: Record<string, string> = {
  complementary: 'Complementary',
  'analogous-1': 'Analogous +30°',
  'analogous-2': 'Analogous −30°',
  'triadic-1': 'Triadic +120°',
  'triadic-2': 'Triadic −120°',
  'split-comp-1': 'Split Comp +150°',
  'split-comp-2': 'Split Comp −150°',
};

const HarmonySection: React.FC<HarmonySectionProps> = ({
  harmonies,
  baseHex,
  accentColor,
  onSetBaseColor,
}) => {
  return (
    <div>
      <SectionTitle
        title="Color Harmonies"
        subtitle="Mathematically harmonious companions for your brand color"
        accentColor={accentColor}
      />

      {/* Harmony Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
        {harmonies.map((harmony, i) => (
          <motion.div
            key={harmony.type}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-white rounded-xl border border-black/[0.06] p-3 sm:p-4 group hover:shadow-sm transition-shadow duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0 cursor-pointer shadow-sm"
                style={{ backgroundColor: harmony.color.hex }}
                onClick={() => onSetBaseColor(harmony.color.hex)}
                title="Set as base color"
                aria-label={`Set ${harmonyLabels[harmony.type]} as base color`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-[#1A1A19] truncate">
                  {harmonyLabels[harmony.type]}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-xs font-mono text-[#6B6965]">
                    {harmony.color.hex}
                  </span>
                  <CopyButton text={harmony.color.hex} size={11} />
                </div>
              </div>
            </div>

            {/* Mini shade strip */}
            <div className="flex rounded-md overflow-hidden">
              {harmony.shades.map((s) => (
                <div
                  key={s.step}
                  className="flex-1 h-5 sm:h-6 first:rounded-l-md last:rounded-r-md"
                  style={{ backgroundColor: s.color.hex }}
                />
              ))}
            </div>

            <button
              onClick={() => onSetBaseColor(harmony.color.hex)}
              className="mt-2.5 sm:mt-3 text-[10px] sm:text-xs font-medium text-[#9C9890] hover:text-[#1A1A19] transition-colors duration-200 sm:opacity-0 sm:group-hover:opacity-100"
            >
              Use as base →
            </button>
          </motion.div>
        ))}
      </div>

      {/* Harmony Mixer */}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-[#1A1A19] tracking-tight mb-1">
          Harmony Mixer
        </h3>
        <p className="text-xs sm:text-sm text-[#6B6965] mb-5 sm:mb-6">
          Side-by-side pairing previews with contrast ratios
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
        {harmonies.map((harmony, i) => {
          const contrast = getContrastRatio(baseHex, harmony.color.hex);
          return (
            <motion.div
              key={`pair-${harmony.type}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.04 }}
              className="bg-white rounded-xl border border-black/[0.06] overflow-hidden"
            >
              <div className="flex h-12 sm:h-16">
                <div className="flex-1" style={{ backgroundColor: baseHex }} />
                <div className="flex-1" style={{ backgroundColor: harmony.color.hex }} />
              </div>
              <div className="px-2.5 sm:px-3 py-2 sm:py-2.5 flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs text-[#6B6965] truncate">
                  {harmonyLabels[harmony.type]}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-medium text-[#1A1A19] flex-shrink-0">
                  {contrast.toFixed(1)}:1
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HarmonySection;