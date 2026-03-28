import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import chroma from 'chroma-js';
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
  const [inputValue, setInputValue] = useState(value);
  const [format, setFormat] = useState<ColorInputFormat>('hex');
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInternalUpdate = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isInternalUpdate.current && value) {
      setInputValue(formatColor(value, format));
    }
    isInternalUpdate.current = false;
  }, [value, format]);

  // Force text color after format change
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.color = '#1A1A19';
      inputRef.current.style.webkitTextFillColor = '#1A1A19';
    }
  }, [inputValue, format]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setInputValue(raw);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const parsed = parseColorInput(raw);
        if (parsed) {
          isInternalUpdate.current = true;
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
        const newValue = formatColor(parsedHex, newFormat);
        setInputValue(newValue);
        // Force color update after state change
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.color = '#1A1A19';
            inputRef.current.style.webkitTextFillColor = '#1A1A19';
          }
        }, 0);
      }
    },
    [parsedHex]
  );

  const handleSuggestionClick = useCallback(
    (hex: string) => {
      setInputValue(formatColor(hex, format));
      isInternalUpdate.current = true;
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1A1A19] mb-3">
        Start with a color
      </h1>
      <p className="text-base sm:text-lg text-[#6B6965] mb-8 sm:mb-10 leading-relaxed px-2">
        Enter any color to craft your complete design system
      </p>

      <div className="max-w-xl mx-auto px-1">
        <div className="flex flex-col gap-3 sm:gap-0">
          <div
            className={`relative flex items-center rounded-xl border bg-white transition-all duration-300 flex-1 py-5 px-4 sm:py-5 sm:px-5 ${
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
                ? { borderColor: `${parsedHex}40`, boxShadow: `0 4px 20px ${parsedHex}12` }
                : undefined
            }
          >
            {/* Color swatch */}
            <div className="pr-3 sm:pr-4 flex-shrink-0">
              <div
                className="w-5 h-5 sm:w-8 sm:h-8 rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  backgroundColor: parsedHex || 'transparent',
                  border: parsedHex ? 'none' : '2px dashed rgba(0,0,0,0.15)',
                }}
              />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="#3B82F6"
              aria-label="Color value input"
              style={{
                color: '#1A1A19',
                caretColor: '#1A1A19',
                WebkitTextFillColor: '#1A1A19',
              }}
              className="flex-1 bg-transparent text-base sm:text-lg font-mono placeholder:text-[#C5C2BD] outline-none min-w-0"
              spellCheck={false}
              autoComplete="off"
            />

            {/* Format toggle — desktop only */}
            <div className="pl-3 flex-shrink-0 hidden sm:block">
              <ColorFormatToggle
                format={format}
                onFormatChange={handleFormatChange}
                accentColor={parsedHex || '#1A1A19'}
              />
            </div>
          </div>

          {/* Format toggle — mobile only */}
          <div className="flex justify-center sm:hidden">
            <ColorFormatToggle
              format={format}
              onFormatChange={handleFormatChange}
              accentColor={parsedHex || '#1A1A19'}
            />
          </div>
        </div>

        {/* Suggestions */}
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
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(sug.hex)}
                  className="group flex flex-col items-center gap-1.5"
                  aria-label={`Select ${sug.name} color ${sug.hex}`}
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-sm transition-shadow duration-200 group-hover:shadow-md"
                    style={{ backgroundColor: sug.hex }}
                  />
                  <span className="text-xs text-[#9C9890] group-hover:text-[#6B6965] transition-colors duration-200">
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