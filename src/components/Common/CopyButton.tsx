import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: number;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, label, size = 14, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    showToast(`Copied ${text}`);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`inline-flex items-center gap-1.5 text-[#6B6965] hover:text-[#1A1A19] transition-colors duration-200 ${className}`}
      title={`Copy ${text}`}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Check size={size} strokeWidth={2.5} className="text-green-600" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: -90 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <Copy size={size} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
      {label && <span className="text-xs font-medium">{label}</span>}
    </motion.button>
  );
};

export default CopyButton;