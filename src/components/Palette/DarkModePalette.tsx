import React from 'react';
import { motion } from 'framer-motion';
import type { DarkModeColor } from '../../types';
import SectionTitle from '../Common/SectionTitle';
import CopyButton from '../Common/CopyButton';
import { useToast } from '../Common/Toast';

interface DarkModePaletteProps {
  palette: DarkModeColor[];
  accentColor: string;
}

const DarkModePalette: React.FC<DarkModePaletteProps> = ({ palette, accentColor }) => {
  const { showToast } = useToast();

  const getColor = (role: string): string => {
    return palette.find((p) => p.role === role)?.color.hex || '#000000';
  };

  const handleCopyToken = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = hex;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(`Copied ${hex}`);
  };

  return (
    <div>
      <SectionTitle
        title="Dark Mode System"
        subtitle="A complete semantic dark palette derived from your brand"
        accentColor={accentColor}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Mock UI Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden shadow-lg order-1"
          style={{ backgroundColor: getColor('background') }}
        >
          <div className="p-4 sm:p-6">
            {/* Top bar */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400/60" />
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400/60" />
            </div>

            {/* Card */}
            <div
              className="rounded-xl p-4 sm:p-5 mb-3 sm:mb-4"
              style={{
                backgroundColor: getColor('surface'),
                border: `1px solid ${getColor('border-subtle')}`,
              }}
            >
              <h3
                className="text-base sm:text-lg font-semibold mb-1"
                style={{ color: getColor('text-primary') }}
              >
                Dashboard Overview
              </h3>
              <p
                className="text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed"
                style={{ color: getColor('text-secondary') }}
              >
                Analytics performing well this quarter with 12% increase.
              </p>
              <span
                className="text-[10px] sm:text-xs uppercase tracking-wider font-medium"
                style={{ color: getColor('text-muted') }}
              >
                Last updated: 2 hours ago
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-white"
                style={{ backgroundColor: getColor('primary') }}
              >
                View Report
              </button>
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
                style={{
                  backgroundColor: getColor('primary-subtle'),
                  color: getColor('primary'),
                }}
              >
                Settings
              </button>
            </div>

            {/* Elevated surface */}
            <div
              className="rounded-lg p-3"
              style={{
                backgroundColor: getColor('surface-elevated'),
                border: `1px solid ${getColor('border')}`,
              }}
            >
              <p
                className="text-[10px] sm:text-xs font-medium"
                style={{ color: getColor('text-secondary') }}
              >
                Quick Actions
              </p>
              <div className="flex gap-1.5 sm:gap-2 mt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-7 sm:h-8 rounded-md"
                    style={{
                      backgroundColor: getColor('surface'),
                      border: `1px solid ${getColor('border-subtle')}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Token list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-0.5 sm:space-y-1 order-2"
        >
          {palette.map((token, i) => (
            <motion.button
              key={token.role}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.03 }}
              onClick={() => handleCopyToken(token.color.hex)}
              className="w-full flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg hover:bg-black/[0.02] transition-colors duration-200 group text-left"
              aria-label={`Copy ${token.label} color ${token.color.hex}`}
            >
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 shadow-sm"
                style={{
                  backgroundColor: token.color.hex,
                  border: token.role.includes('border')
                    ? '1px solid rgba(255,255,255,0.1)'
                    : 'none',
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A19] truncate">{token.label}</p>
                <p className="text-[10px] sm:text-xs text-[#9C9890] truncate">{token.role}</p>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <span className="text-[10px] sm:text-xs font-mono text-[#6B6965]">
                  {token.color.hex}
                </span>
                <CopyButton text={token.color.hex} size={12} />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DarkModePalette;