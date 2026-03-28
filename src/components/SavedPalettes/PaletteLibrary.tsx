import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, Plus } from 'lucide-react';
import chroma from 'chroma-js';
import type { SavedPalette } from '../../types';
import { generateShadeScale } from '../../utils/colorGenerator';

interface PaletteLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  palettes: SavedPalette[];
  onSave: (name: string, baseColor: string) => void;
  onDelete: (id: string) => void;
  onLoad: (hex: string) => void;
  currentColor: string | null;
}

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

const PaletteLibrary: React.FC<PaletteLibraryProps> = ({
  isOpen,
  onClose,
  palettes,
  onSave,
  onDelete,
  onLoad,
  currentColor,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    if (!currentColor) return;
    const name = saveName.trim() || currentColor.toUpperCase();
    onSave(name, currentColor);
    setSaveName('');
    setIsSaving(false);
  }, [saveName, currentColor, onSave]);

  const handleDelete = useCallback(
    (id: string) => {
      setDeletingId(id);
      setTimeout(() => {
        onDelete(id);
        setDeletingId(null);
      }, 300);
    },
    [onDelete]
  );

  const handleLoad = useCallback(
    (hex: string) => {
      onLoad(hex);
      onClose();
    },
    [onLoad, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-[55] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 35 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-[#FAF9F7] z-[56] shadow-2xl border-l border-black/[0.06] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
              <h2 className="text-lg font-semibold tracking-tight text-[#1A1A19]">
                Saved Palettes
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/[0.04] text-[#6B6965] hover:text-[#1A1A19] transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Save current */}
            <div className="px-6 py-4 border-b border-black/[0.06]">
              {!isSaving ? (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setIsSaving(true)}
                  disabled={!currentColor}
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: currentColor ? `${currentColor}15` : 'rgba(0,0,0,0.04)',
                    color: currentColor || '#6B6965',
                    border: `1px solid ${currentColor ? `${currentColor}30` : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <Plus size={15} />
                  Save Current Palette
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder={currentColor?.toUpperCase() || 'Palette name'}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    autoFocus
                    className="flex-1 h-10 px-3 rounded-lg border border-black/[0.06] bg-white text-sm text-[#1A1A19] outline-none focus:border-black/10 font-mono"
                  />
                  <button
                    onClick={handleSave}
                    className="h-10 px-4 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: currentColor || '#1A1A19' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsSaving(false);
                      setSaveName('');
                    }}
                    className="h-10 px-3 rounded-lg text-sm text-[#6B6965] hover:bg-black/[0.04]"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </div>

            {/* Palette list */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {palettes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-[#9C9890]">No saved palettes yet</p>
                  <p className="text-xs text-[#C5C2BD] mt-1">
                    Create a palette and save it for later
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {palettes.map((palette) => {
                      const isDeleting = deletingId === palette.id;
                      let miniShades: string[] = [];
                      try {
                        miniShades = generateShadeScale(palette.baseColor).map(
                          (s) => s.color.hex
                        );
                      } catch {
                        miniShades = [palette.baseColor];
                      }

                      return (
                        <motion.div
                          key={palette.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{
                            opacity: isDeleting ? 0 : 1,
                            x: isDeleting ? 40 : 0,
                            backgroundColor: isDeleting
                              ? 'rgba(220, 38, 38, 0.08)'
                              : 'rgba(255,255,255,1)',
                          }}
                          exit={{ opacity: 0, x: 40, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="rounded-xl border border-black/[0.06] p-3 bg-white"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              style={{ backgroundColor: palette.baseColor }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1A1A19] truncate">
                                {palette.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-[#9C9890]">
                                  {palette.baseColor.toUpperCase()}
                                </span>
                                <span className="text-[10px] text-[#C5C2BD]">
                                  {relativeTime(palette.createdAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Mini shade strip */}
                          <div className="flex rounded-md overflow-hidden mb-3 h-3">
                            {miniShades.map((hex, i) => (
                              <div
                                key={i}
                                className="flex-1"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleLoad(palette.baseColor)}
                              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium text-[#1A1A19] bg-black/[0.04] hover:bg-black/[0.06] transition-colors"
                            >
                              <ArrowRight size={12} />
                              Load
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDelete(palette.id)}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-[#9C9890] hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaletteLibrary;