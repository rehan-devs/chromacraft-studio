import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Copy, Check } from 'lucide-react';
import type { ShadeStep, HarmonyColor, DarkModeColor, ExportFormat } from '../../types';
import { exportAsCSS, exportAsTailwind, exportAsSCSS, exportAsJSON } from '../../utils/exporters';
import SectionTitle from '../Common/SectionTitle';
import { useToast } from '../Common/Toast';

interface ExportPanelProps {
  shades: ShadeStep[];
  harmonies: HarmonyColor[];
  darkMode: DarkModeColor[];
  accentColor: string;
}

const TABS: { id: ExportFormat; label: string; shortLabel: string; ext: string }[] = [
  { id: 'css', label: 'CSS Variables', shortLabel: 'CSS', ext: '.css' },
  { id: 'tailwind', label: 'Tailwind Config', shortLabel: 'Tailwind', ext: '.js' },
  { id: 'scss', label: 'SCSS Variables', shortLabel: 'SCSS', ext: '.scss' },
  { id: 'json', label: 'JSON', shortLabel: 'JSON', ext: '.json' },
];

function highlightCode(code: string, format: ExportFormat): React.ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    // Comments
    if (
      line.trimStart().startsWith('//') ||
      line.trimStart().startsWith('/*') ||
      line.trimStart().startsWith('*')
    ) {
      return (
        <div key={i} className="flex">
          <span className="w-8 sm:w-10 text-right pr-2 sm:pr-3 text-white/20 select-none text-[10px] sm:text-xs flex-shrink-0">
            {i + 1}
          </span>
          <span className="text-[#6A9955]">{line}</span>
        </div>
      );
    }

    const parts: React.ReactNode[] = [];
    let partKey = 0;
    const remaining = line;

    // Hex colors
    const hexRegex = /#[0-9A-Fa-f]{3,8}/g;
    const hexMatches: { index: number; value: string }[] = [];
    let match: RegExpExecArray | null;

    while ((match = hexRegex.exec(remaining)) !== null) {
      hexMatches.push({ index: match.index, value: match[0] });
    }

    if (hexMatches.length > 0) {
      let cursor = 0;
      for (const hm of hexMatches) {
        if (hm.index > cursor) {
          const before = remaining.slice(cursor, hm.index);
          parts.push(
            <span key={partKey++} className="text-[#D4D4D4]">
              {highlightKeywords(before)}
            </span>
          );
        }
        parts.push(
          <span key={partKey++} className="text-[#CE9178]">
            {hm.value}
          </span>
        );
        cursor = hm.index + hm.value.length;
      }
      if (cursor < remaining.length) {
        parts.push(
          <span key={partKey++} className="text-[#D4D4D4]">
            {highlightKeywords(remaining.slice(cursor))}
          </span>
        );
      }
    } else {
      parts.push(
        <span key={partKey++} className="text-[#D4D4D4]">
          {highlightKeywords(remaining)}
        </span>
      );
    }

    return (
      <div key={i} className="flex">
        <span className="w-8 sm:w-10 text-right pr-2 sm:pr-3 text-white/20 select-none text-[10px] sm:text-xs flex-shrink-0">
          {i + 1}
        </span>
        <span className="flex-1">{parts}</span>
      </div>
    );
  });
}

function highlightKeywords(text: string): React.ReactNode {
  const keywords = [':root', '.dark', 'module.exports', 'theme', 'extend', 'colors'];

  for (const kw of keywords) {
    if (text.includes(kw)) {
      const idx = text.indexOf(kw);
      return (
        <>
          {text.slice(0, idx)}
          <span className="text-[#569CD6]">{kw}</span>
          {text.slice(idx + kw.length)}
        </>
      );
    }
  }

  // Highlight CSS variable names
  if (text.includes('--')) {
    const idx = text.indexOf('--');
    const colonIdx = text.indexOf(':', idx);
    if (colonIdx > idx) {
      return (
        <>
          {text.slice(0, idx)}
          <span className="text-[#9CDCFE]">{text.slice(idx, colonIdx)}</span>
          {text.slice(colonIdx)}
        </>
      );
    }
  }

  // Highlight SCSS variables
  if (text.includes('$')) {
    const idx = text.indexOf('$');
    const colonIdx = text.indexOf(':', idx);
    if (colonIdx > idx) {
      return (
        <>
          {text.slice(0, idx)}
          <span className="text-[#9CDCFE]">{text.slice(idx, colonIdx)}</span>
          {text.slice(colonIdx)}
        </>
      );
    }
  }

  return text;
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  shades,
  harmonies,
  darkMode,
  accentColor,
}) => {
  const [activeTab, setActiveTab] = useState<ExportFormat>('css');
  const [baseName, setBaseName] = useState('primary');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const code = useMemo(() => {
    switch (activeTab) {
      case 'css':
        return exportAsCSS(shades, harmonies, darkMode, baseName);
      case 'tailwind':
        return exportAsTailwind(shades, harmonies, baseName);
      case 'scss':
        return exportAsSCSS(shades, harmonies, darkMode, baseName);
      case 'json':
        return exportAsJSON(shades, harmonies, darkMode);
    }
  }, [activeTab, shades, harmonies, darkMode, baseName]);

  const handleCopyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    showToast('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }, [code, showToast]);

  const handleDownload = useCallback(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-colors${tab.ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${baseName}-colors${tab.ext}`);
  }, [code, activeTab, baseName, showToast]);

  const baseNameId = 'input-base-name';

  return (
    <div>
      <SectionTitle
        title="Export Your System"
        subtitle="Production-ready code for your stack"
        accentColor={accentColor}
      />

      {/* Base name input */}
      <div className="mb-6">
        <label htmlFor={baseNameId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider mb-1.5 block">
          Variable base name
        </label>
        <input
          id={baseNameId}
          type="text"
          value={baseName}
          onChange={(e) => setBaseName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, '') || 'primary')}
          placeholder="primary"
          aria-label="Variable base name"
          className="h-10 px-3 rounded-lg border border-black/[0.06] bg-white text-sm font-mono text-[#1A1A19] outline-none focus:border-black/10 transition-colors w-full sm:w-48"
        />
      </div>

      {/* Tabs — fully responsive with equal spacing */}
      <div className="grid grid-cols-4 gap-1 mb-4 bg-black/[0.03] rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200 text-center"
            style={{
              color: activeTab === tab.id ? '#FFFFFF' : '#6B6965',
            }}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="export-tab-bg"
                className="absolute inset-0 rounded-lg bg-[#1A1A19]"
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              />
            )}
            {/* Show short label on mobile, full on desktop */}
            <span className="relative z-10 sm:hidden">{tab.shortLabel}</span>
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Code block */}
      <div className="relative rounded-xl bg-[#1E1E1C] shadow-lg overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-3 border-b border-white/[0.06]">
          <span className="text-[10px] sm:text-xs text-white/30 font-mono truncate">
            {TABS.find((t) => t.id === activeTab)?.label}
          </span>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAll}
              aria-label="Copy all code"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy All'}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              aria-label="Download file"
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </motion.button>
          </div>
        </div>

        {/* Code content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="p-3 sm:p-4 overflow-x-auto font-mono text-[10px] sm:text-xs leading-5 sm:leading-6 max-h-[400px] sm:max-h-[480px] overflow-y-auto"
            tabIndex={0}
            role="region"
            aria-label="Generated code output"
          >
            {highlightCode(code, activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExportPanel;