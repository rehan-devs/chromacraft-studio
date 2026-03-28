import React from 'react';
import { motion } from 'framer-motion';
import type { ColorInputFormat } from '../../types';

interface ColorFormatToggleProps {
  format: ColorInputFormat;
  onFormatChange: (format: ColorInputFormat) => void;
  accentColor: string;
}

const formats: ColorInputFormat[] = ['hex', 'rgb', 'hsl'];

const ColorFormatToggle: React.FC<ColorFormatToggleProps> = ({
  format,
  onFormatChange,
  accentColor,
}) => {
  return (
    <div className="flex items-center bg-black/[0.04] rounded-lg p-0.5 gap-0.5">
      {formats.map((f) => (
        <button
          key={f}
          onClick={() => onFormatChange(f)}
          className="relative px-2.5 py-1 text-xs font-medium uppercase tracking-wider rounded-md transition-colors duration-200"
          style={{
            color: format === f ? '#FFFFFF' : '#6B6965',
          }}
        >
          {format === f && (
            <motion.div
              layoutId="format-indicator"
              className="absolute inset-0 rounded-md"
              style={{ backgroundColor: accentColor || '#1A1A19' }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{f}</span>
        </button>
      ))}
    </div>
  );
};

export default ColorFormatToggle;