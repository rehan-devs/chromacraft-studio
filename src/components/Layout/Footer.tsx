import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 sm:py-12 border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs sm:text-sm text-[#9C9890]">
          ChromaCraft Studio — Craft color systems with intention.
        </p>
        <p className="text-[10px] sm:text-xs text-[#C5C2BD] mt-1">
          Built with perceptually uniform color science · LAB/LCH interpolation · WCAG 2.1
        </p>
      </div>
    </footer>
  );
};

export default Footer;