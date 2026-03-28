import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenLibrary: () => void;
  accentColor: string;
  savedCount: number;
}

const Header: React.FC<HeaderProps> = ({ onOpenLibrary, accentColor, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F7]/80 backdrop-blur-md border-b border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg overflow-hidden flex-shrink-0"
            style={{
              background: `conic-gradient(
                from 0deg,
                #E8735A, #D97706, #6B8F71,
                #0EA5E9, #8B7EC8, #E8735A
              )`,
            }}
          />
          <span className="text-base sm:text-lg font-semibold tracking-tight text-[#1A1A19]">
            ChromaCraft
            <span className="hidden sm:inline"> Studio</span>
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenLibrary}
          aria-label={`Saved palettes, ${savedCount} saved`}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-lg text-sm font-medium text-[#6B6965] hover:text-[#1A1A19] hover:bg-black/[0.04] transition-all duration-200"
        >
          <Bookmark size={16} strokeWidth={2} />
          <span className="hidden sm:inline">Saved</span>
          {savedCount > 0 && (
            <span
              className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full text-white font-medium"
              style={{ backgroundColor: accentColor || '#6B6965' }}
            >
              {savedCount}
            </span>
          )}
        </motion.button>
      </div>
    </header>
  );
};

export default Header;