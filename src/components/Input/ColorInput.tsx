import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ColorFormatToggle from './ColorFormatToggle';
import { parseColorInput, formatColor } from '../../utils/colorParser';
import type { ColorInputFormat } from '../../types';

interface ColorInputProps {
  value: string;
  onChange: (hex: string) => void;
  parsedHex: string | null;
}

const SUGGESTIONS = [
  { name: 'Ocean', hex: '#0EA5E9' },
  { name: 'Sage', hex: '#6B8F71' },
  { name: 'Terracotta', hex: '#C2704E' },
  { name: 'Lavender', hex: '#8B7EC8' },
  { name: 'Charcoal', hex: '#3D3D3D' },
  { name: 'Coral', hex: '#E8735A' },
];

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange, parsedHex }) => {
  const [inputValue, setInputValue] = useState('');
  const [format, setFormat] = useState<ColorInputFormat>('hex');
  const [isFocused, setIsFocused] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const internalUpdateRef = useRef(false);

  useEffect(() => {
    if (!internalUpdateRef.current) {
      setInputValue(value ? formatColor(value, format) : '');
    }
    internalUpdateRef.current = false;
  }, [value, format]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const parsed = parseColorInput(raw);
        if (parsed) {
          internalUpdateRef.current = true;
          onChange(parsed);
        }
      }, 150);
    },
    [onChange]
  );

  const handleFormatChange = useCallback(
    (newFormat: ColorInputFormat) => {
      setFormat(newFormat);

      if (parsedHex) {
        internalUpdateRef.current = true;
        setInputValue(formatColor(parsedHex, newFormat));
      }
    },
    [parsedHex]
  );

  const handleSuggestionClick = useCallback(
    (hex: string) => {
      internalUpdateRef.current = true;
      setInputValue(formatColor(hex, format));
      onChange(hex);
    },
    [format, onChange]
  );

  const isInvalid = inputValue.trim().length > 0 && !parsedHex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      className="text-center"
    >
      <style>{`
        .color-input-text {
          color: #1A1A19 !important;
          -webkit-text-fill-color: #1A1A19 !important;
          caret-color: #1A1A19 !important;
        }
        .color-input-text::placeholder {
          color: #C5C2BD !important;
          -webkit-text-fill-color: #C5C2BD !important;
        }
      `}</style>

      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[#1A1A19] sm:text-4xl md:text-5xl">
        Start with a color
      </h1>

      <p className="mb-8 px-2 text-base leading-relaxed text-[#6B6965] sm:mb-10 sm:text-lg">
        Enter any color to craft your complete design system
      </p>

      <div className="mx-auto max-w-xl px-1">
        <div className="flex flex-col gap-3 sm:gap-0">
          <div
            className={`relative isolate flex flex-1 items-center rounded-xl border bg-white px-4 py-5 transition-all duration-300 sm:px-5 ${
              isFocused ? 'shadow-md' : 'shadow-sm'
            } ${
              isInvalid
                ? 'border-red-300/60'
                : isFocused && parsedHex
                  ? 'border-black/10'
                  : 'border-black/[0.06]'
            }`}
            style={
              isFocused && parsedHex
                ? {
                    borderColor: `${parsedHex}40`,
                    boxShadow: `0 4px 20px ${parsedHex}12`,
                  }
                : undefined
            }
          >
            <div className="flex-shrink-0 pr-3 sm:pr-4">
              <div
                className="h-5 w-5 rounded-full transition-all duration-300 sm:h-8 sm:w-8"
                style={{
                  backgroundColor: parsedHex || 'transparent',
                  border: parsedHex ? 'none' : '2px dashed rgba(0,0,0,0.15)',
                }}
              />
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="#3B82F6"
              aria-label="Color value input"
              spellCheck={false}
              autoComplete="off"
              className="color-input-text flex-1 min-w-0 bg-transparent font-mono text-base outline-none sm:text-lg"
            />

            <div className="hidden flex-shrink-0 pl-3 sm:block">
              <ColorFormatToggle
                format={format}
                onFormatChange={handleFormatChange}
                accentColor={parsedHex || '#1A1A19'}
              />
            </div>
          </div>

          <div className="flex justify-center sm:hidden">
            <ColorFormatToggle
              format={format}
              onFormatChange={handleFormatChange}
              accentColor={parsedHex || '#1A1A19'}
            />
          </div>
        </div>

        <AnimatePresence>
          {!parsedHex && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              {SUGGESTIONS.map((sug) => (
                <motion.button
                  key={sug.hex}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(sug.hex)}
                  className="group flex flex-col items-center gap-1.5"
                  aria-label={`Select ${sug.name} color ${sug.hex}`}
                >
                  <div
                    className="h-10 w-10 rounded-full shadow-sm transition-shadow duration-200 group-hover:shadow-md"
                    style={{ backgroundColor: sug.hex }}
                  />
                  <span className="text-xs text-[#9C9890] transition-colors duration-200 group-hover:text-[#6B6965]">
                    {sug.name}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ColorInput;