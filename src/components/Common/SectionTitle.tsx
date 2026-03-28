import React from 'react';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  accentColor?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, accentColor = '#1A1A19' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="mb-10"
    >
      <h2 className="text-2xl font-semibold tracking-tight text-[#1A1A19]">{title}</h2>
      {subtitle && (
        <p className="text-base text-[#6B6965] mt-1.5 leading-relaxed">{subtitle}</p>
      )}
      <div
        className="mt-3 h-0.5 w-10 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
    </motion.div>
  );
};

export default SectionTitle;