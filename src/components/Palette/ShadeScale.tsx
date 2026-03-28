import React from 'react';
import { motion } from 'framer-motion';
import type { ShadeStep } from '../../types';
import ColorCard from './ColorCard';
import SectionTitle from '../Common/SectionTitle';

interface ShadeScaleProps {
  shades: ShadeStep[];
  accentColor: string;
}

const ShadeScale: React.FC<ShadeScaleProps> = ({ shades, accentColor }) => {
  return (
    <div>
      <SectionTitle
        title="Shade Scale"
        subtitle="11 perceptually uniform steps from light to dark"
        accentColor={accentColor}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="pt-8 overflow-visible"
      >
        {/* Desktop: horizontal ribbon */}
        <div className="hidden sm:flex gap-0">
          {shades.map((shade, i) => (
            <motion.div
              key={shade.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex-1 min-w-[52px]"
            >
              <ColorCard shade={shade} isBase={shade.step === 500} index={i} totalCount={shades.length} />
            </motion.div>
          ))}
        </div>

        {/* Mobile: 4-column grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:hidden">
          {shades.map((shade, i) => (
            <motion.div
              key={shade.step}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <ColorCard shade={shade} isBase={shade.step === 500} index={i % 4} totalCount={4} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ShadeScale;