import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GrainOverlay from './components/Common/GrainOverlay';
import { ToastProvider } from './components/Common/Toast';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ColorInput from './components/Input/ColorInput';
import ColorWheel from './components/Input/ColorWheel';
import ShadeScale from './components/Palette/ShadeScale';
import HarmonySection from './components/Palette/HarmonySection';
import DarkModePalette from './components/Palette/DarkModePalette';
import ContrastGrid from './components/Accessibility/ContrastGrid';
import ExportPanel from './components/Export/ExportPanel';
import PaletteLibrary from './components/SavedPalettes/PaletteLibrary';
import { useColorEngine } from './hooks/useColorEngine';
import { useSavedPalettes } from './hooks/useSavedPalettes';
import { parseColorInput } from './utils/colorParser';

const App: React.FC = () => {
  const [inputHex, setInputHex] = useState<string>('');
  const [parsedHex, setParsedHex] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const { baseColor, shades, harmonies, darkModePalette, isValid } = useColorEngine(parsedHex);
  const { palettes, savePalette, deletePalette, loadPalette } = useSavedPalettes();

  const handleColorChange = useCallback((hex: string) => {
    setInputHex(hex);
    setParsedHex(hex);
  }, []);

  const handleInputChange = useCallback((hex: string) => {
    setInputHex(hex);
    const parsed = parseColorInput(hex);
    setParsedHex(parsed);
  }, []);

  const handleSetBaseColor = useCallback((hex: string) => {
    setInputHex(hex);
    setParsedHex(hex);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLoadPalette = useCallback(
    (hex: string) => {
      setInputHex(hex);
      setParsedHex(hex);
    },
    []
  );

  const accentColor = parsedHex || '#1A1A19';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#FAF9F7] relative">
        <GrainOverlay />

        {/* Adaptive background gradient */}
        {parsedHex && (
          <motion.div
            key={parsedHex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${parsedHex}08 0%, transparent 70%)`,
            }}
          />
        )}

        <div className="relative z-10">
          <Header
            onOpenLibrary={() => setLibraryOpen(true)}
            accentColor={accentColor}
            savedCount={palettes.length}
          />

          <main>
            {/* Hero Section */}
            <section
              className={`py-16 transition-all duration-700 ${
                isValid ? 'pt-12 pb-8' : 'pt-24 pb-16 md:pt-32 md:pb-20'
              }`}
            >
              <div className="max-w-6xl mx-auto px-6">
                <ColorInput
                  value={inputHex}
                  onChange={handleColorChange}
                  parsedHex={parsedHex}
                />
              </div>
            </section>

            {/* Generated Content */}
            <AnimatePresence>
              {isValid && baseColor && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Color Wheel + Shade Scale Section */}
                  <section className="py-12">
                    <div className="max-w-6xl mx-auto px-6">
                      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
                        {/* Color Wheel */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.05 }}
                        >
                          <ColorWheel
                            hex={parsedHex!}
                            harmonies={harmonies}
                            onHueChange={handleColorChange}
                            onSaturationChange={handleColorChange}
                            onLightnessChange={handleColorChange}
                          />
                        </motion.div>

                        {/* Shade Scale */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        >
                          <ShadeScale shades={shades} accentColor={accentColor} />
                        </motion.div>
                      </div>
                    </div>
                  </section>

                  {/* Harmonies Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="py-16"
                  >
                    <div className="max-w-6xl mx-auto px-6">
                      <HarmonySection
                        harmonies={harmonies}
                        baseHex={parsedHex!}
                        accentColor={accentColor}
                        onSetBaseColor={handleSetBaseColor}
                      />
                    </div>
                  </motion.section>

                  {/* Accessibility Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="py-16"
                  >
                    <div className="max-w-6xl mx-auto px-6">
                      <ContrastGrid shades={shades} accentColor={accentColor} />
                    </div>
                  </motion.section>

                  {/* Dark Mode Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="py-16"
                  >
                    <div className="max-w-6xl mx-auto px-6">
                      <DarkModePalette palette={darkModePalette} accentColor={accentColor} />
                    </div>
                  </motion.section>

                  {/* Export Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="py-16"
                  >
                    <div className="max-w-6xl mx-auto px-6">
                      <ExportPanel
                        shades={shades}
                        harmonies={harmonies}
                        darkMode={darkModePalette}
                        accentColor={accentColor}
                      />
                    </div>
                  </motion.section>
                </motion.div>
              )}
            </AnimatePresence>

            <Footer />
          </main>
        </div>

        {/* Saved Palettes Drawer */}
        <PaletteLibrary
          isOpen={libraryOpen}
          onClose={() => setLibraryOpen(false)}
          palettes={palettes}
          onSave={savePalette}
          onDelete={deletePalette}
          onLoad={handleLoadPalette}
          currentColor={parsedHex}
        />
      </div>
    </ToastProvider>
  );
};

export default App;