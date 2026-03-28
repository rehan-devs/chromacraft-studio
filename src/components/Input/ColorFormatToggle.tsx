import React from 'react';
import type { ColorInputFormat } from '../../types';

interface ColorFormatToggleProps {
  format: ColorInputFormat;
  onFormatChange: (format: ColorInputFormat) => void;
  accentColor: string;
}

const FORMATS: ColorInputFormat[] = ['hex', 'rgb', 'hsl'];

const ColorFormatToggle: React.FC<ColorFormatToggleProps> = ({
  format,
  onFormatChange,
  accentColor,
}) => {
  return (
    <div className="isolate flex items-center gap-0.5 rounded-lg bg-black/[0.04] p-0.5">
      {FORMATS.map((f) => {
        const isActive = format === f;

        return (
          <button
            key={f}
            type="button"
            onClick={() => onFormatChange(f)}
            className="rounded-md px-2.5 py-1 text-xs font-medium uppercase tracking-wider transition-colors duration-200"
            style={{
              backgroundColor: isActive ? accentColor || '#1A1A19' : 'transparent',
              color: isActive ? '#FFFFFF' : '#6B6965',
            }}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
};

export default ColorFormatToggle;