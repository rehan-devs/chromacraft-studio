import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ShadeStep } from '../../types';
import { useToast } from '../Common/Toast';

interface ColorCardProps {
  shade: ShadeStep;
  isBase?: boolean;
  index?: number;
  totalCount?: number;
}

function wcagBadgeColor(rating: string): string {
  switch (rating) {
    case 'AAA': return '#16A34A';
    case 'AA': return '#D97706';
    case 'AA Large': return '#EA580C';
    case 'Fail': return '#DC2626';
    default: return '#DC2626';
  }
}

const ColorCard: React.FC<ColorCardProps> = ({ shade, isBase, index = 0, totalCount = 11 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const { showToast } = useToast();

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(shade.color.hex);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shade.color.hex;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(`Copied ${shade.color.hex}`);
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 300);
  };

  // Determine tooltip alignment to prevent clipping at edges
  const isNearLeft = index <= 1;
  const isNearRight = index >= totalCount - 2;

  let tooltipAlign = 'left-1/2 -translate-x-1/2'; // center by default
  if (isNearLeft) tooltipAlign = 'left-0';
  if (isNearRight) tooltipAlign = 'right-0';

  return (
    <div
      className="relative flex-1 min-w-0 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Color shade ${shade.step}, ${shade.color.hex}. Click to copy.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Base indicator */}
      {isBase && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <span className="text-[10px] font-semibold text-[#6B6965] uppercase tracking-wider mb-0.5">
            Base
          </span>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#6B6965]" />
        </div>
      )}

      {/* Color block */}
      <motion.div
        animate={{ scaleY: isHovered ? 1.15 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative h-[100px] rounded-t-md overflow-hidden"
        style={{ backgroundColor: shade.color.hex, transformOrigin: 'bottom' }}
      >
        {flashActive && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white"
          />
        )}
      </motion.div>

      {/* Info below */}
      <div className="pt-2 pb-1 px-0.5">
        <p className="text-xs font-medium text-[#1A1A19]">{shade.step}</p>
        <p className="text-[10px] font-mono text-[#6B6965] mt-0.5">{shade.color.hex}</p>
      </div>

      {/* Hover tooltip — properly positioned to avoid clipping */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bottom-full mb-2 z-30 bg-white rounded-xl shadow-lg border border-black/[0.06] p-3 w-48 pointer-events-none ${tooltipAlign}`}
        >
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6B6965]">HEX</span>
              <span className="font-mono text-[#1A1A19]">{shade.color.hex}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6965]">RGB</span>
              <span className="font-mono text-[#1A1A19]">
                {shade.color.rgb.r}, {shade.color.rgb.g}, {shade.color.rgb.b}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B6965]">HSL</span>
              <span className="font-mono text-[#1A1A19]">
                {shade.color.hsl.h}°, {shade.color.hsl.s}%, {shade.color.hsl.l}%
              </span>
            </div>
            <div className="border-t border-black/[0.06] pt-1.5 mt-1.5 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[#6B6965]">On white</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[#1A1A19]">{shade.contrastOnWhite.toFixed(2)}</span>
                  <span
                    className="text-[9px] font-bold text-white px-1 py-0.5 rounded"
                    style={{ backgroundColor: wcagBadgeColor(shade.wcagWhite) }}
                  >
                    {shade.wcagWhite}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6B6965]">On black</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[#1A1A19]">{shade.contrastOnBlack.toFixed(2)}</span>
                  <span
                    className="text-[9px] font-bold text-white px-1 py-0.5 rounded"
                    style={{ backgroundColor: wcagBadgeColor(shade.wcagBlack) }}
                  >
                    {shade.wcagBlack}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ColorCard;