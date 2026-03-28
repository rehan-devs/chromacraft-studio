import React, { useRef, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import type { HarmonyColor } from '../../types';

interface ColorWheelProps {
  hex: string;
  harmonies: HarmonyColor[];
  onHueChange: (newHex: string) => void;
  onSaturationChange: (newHex: string) => void;
  onLightnessChange: (newHex: string) => void;
}

const WHEEL_SIZE = 240;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const OUTER_RADIUS = WHEEL_SIZE / 2 - 8;
const INNER_RADIUS = OUTER_RADIUS - 32;

const ColorWheel: React.FC<ColorWheelProps> = ({
  hex,
  harmonies,
  onHueChange,
  onSaturationChange,
  onLightnessChange,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  const baseColor = useMemo(() => {
    try {
      return chroma(hex);
    } catch {
      return chroma('#888888');
    }
  }, [hex]);

  const hsl = useMemo(() => {
    const [h, s, l] = baseColor.hsl();
    return { h: isNaN(h) ? 0 : h, s, l };
  }, [baseColor]);

  const getPositionOnWheel = useCallback((hue: number) => {
    const rad = ((hue - 90) * Math.PI) / 180;
    const r = (OUTER_RADIUS + INNER_RADIUS) / 2;
    return {
      x: WHEEL_CENTER + r * Math.cos(rad),
      y: WHEEL_CENTER + r * Math.sin(rad),
    };
  }, []);

  const getHueFromPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return hsl.h;
      const rect = svgRef.current.getBoundingClientRect();
      const x = clientX - rect.left - WHEEL_CENTER * (rect.width / WHEEL_SIZE);
      const y = clientY - rect.top - WHEEL_CENTER * (rect.height / WHEEL_SIZE);
      let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
      if (angle < 0) angle += 360;
      return angle;
    },
    [hsl.h]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as Element).setPointerCapture(e.pointerId);
      const newHue = getHueFromPosition(e.clientX, e.clientY);
      const newColor = chroma.hsl(newHue, hsl.s, hsl.l);
      onHueChange(newColor.hex());
    },
    [getHueFromPosition, hsl.s, hsl.l, onHueChange]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const newHue = getHueFromPosition(e.clientX, e.clientY);
      const newColor = chroma.hsl(newHue, hsl.s, hsl.l);
      onHueChange(newColor.hex());
    },
    [isDragging, getHueFromPosition, hsl.s, hsl.l, onHueChange]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const wheelSegments = useMemo(() => {
    const segments = [];
    const steps = 72;
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * 360;
      const nextAngle = ((i + 1) / steps) * 360;
      const color = chroma.hsl(angle, 0.85, 0.55).hex();
      const startRad = ((angle - 90) * Math.PI) / 180;
      const endRad = ((nextAngle - 90) * Math.PI) / 180;

      const x1 = WHEEL_CENTER + OUTER_RADIUS * Math.cos(startRad);
      const y1 = WHEEL_CENTER + OUTER_RADIUS * Math.sin(startRad);
      const x2 = WHEEL_CENTER + OUTER_RADIUS * Math.cos(endRad);
      const y2 = WHEEL_CENTER + OUTER_RADIUS * Math.sin(endRad);
      const x3 = WHEEL_CENTER + INNER_RADIUS * Math.cos(endRad);
      const y3 = WHEEL_CENTER + INNER_RADIUS * Math.sin(endRad);
      const x4 = WHEEL_CENTER + INNER_RADIUS * Math.cos(startRad);
      const y4 = WHEEL_CENTER + INNER_RADIUS * Math.sin(startRad);

      segments.push(
        <path
          key={i}
          d={`M ${x1} ${y1} A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${x4} ${y4} Z`}
          fill={color}
        />
      );
    }
    return segments;
  }, []);

  const baseDotPos = getPositionOnWheel(hsl.h);

  const harmonyDots = useMemo(() => {
    return harmonies.map((h) => {
      const hue = h.color.hsl.h;
      const pos = getPositionOnWheel(hue);
      return { ...h, pos, hue };
    });
  }, [harmonies, getPositionOnWheel]);

  const labelMap: Record<string, string> = {
    complementary: 'Comp',
    'analogous-1': 'Ana +',
    'analogous-2': 'Ana −',
    'triadic-1': 'Tri +',
    'triadic-2': 'Tri −',
    'split-comp-1': 'Split +',
    'split-comp-2': 'Split −',
  };

  const hueId = 'slider-hue';
  const satId = 'slider-saturation';
  const lightId = 'slider-lightness';

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[180px] h-[180px] md:w-[240px] md:h-[240px]">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          className="cursor-crosshair select-none"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          role="slider"
          aria-label="Color hue wheel"
          aria-valuenow={Math.round(hsl.h)}
          aria-valuemin={0}
          aria-valuemax={360}
        >
          <g style={{ opacity: 0.9 }}>{wheelSegments}</g>
          <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r={INNER_RADIUS - 2} fill="#FAF9F7" />

          {harmonyDots.map((dot) => (
            <line
              key={`line-${dot.type}`}
              x1={WHEEL_CENTER}
              y1={WHEEL_CENTER}
              x2={dot.pos.x}
              y2={dot.pos.y}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth={1}
            />
          ))}

          {harmonyDots.map((dot) => (
            <g
              key={dot.type}
              onMouseEnter={() => setHoveredDot(dot.type)}
              onMouseLeave={() => setHoveredDot(null)}
            >
              <circle
                cx={dot.pos.x}
                cy={dot.pos.y}
                r={6}
                fill={dot.color.hex}
                stroke="white"
                strokeWidth={2}
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
              />
              {hoveredDot === dot.type && (
                <text
                  x={dot.pos.x}
                  y={dot.pos.y - 12}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill="#1A1A19"
                  className="pointer-events-none"
                >
                  {labelMap[dot.type] || dot.type}
                </text>
              )}
            </g>
          ))}

          <circle
            cx={baseDotPos.x}
            cy={baseDotPos.y}
            r={9}
            fill={hex}
            stroke="white"
            strokeWidth={3}
            style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }}
          />

          <motion.circle
            cx={baseDotPos.x}
            cy={baseDotPos.y}
            r={14}
            fill="none"
            stroke={hex}
            strokeWidth={2}
            animate={{ r: [14, 18, 14], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <circle
            cx={WHEEL_CENTER}
            cy={WHEEL_CENTER}
            r={24}
            fill={hex}
            stroke="white"
            strokeWidth={2}
          />
        </svg>
      </div>

      {/* HSL sliders */}
      <div className="w-full max-w-[240px] flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor={hueId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider">
              Hue
            </label>
            <span className="text-xs font-mono text-[#6B6965]">{Math.round(hsl.h)}°</span>
          </div>
          <input
            id={hueId}
            type="range"
            min={0}
            max={360}
            value={Math.round(hsl.h)}
            aria-label="Hue"
            onChange={(e) => {
              const newColor = chroma.hsl(+e.target.value, hsl.s, hsl.l);
              onHueChange(newColor.hex());
            }}
            className="w-full"
            style={{
              background: `linear-gradient(to right, 
                hsl(0,85%,55%), hsl(60,85%,55%), hsl(120,85%,55%), 
                hsl(180,85%,55%), hsl(240,85%,55%), hsl(300,85%,55%), hsl(360,85%,55%)
              )`,
            }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor={satId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider">
              Saturation
            </label>
            <span className="text-xs font-mono text-[#6B6965]">{Math.round(hsl.s * 100)}%</span>
          </div>
          <input
            id={satId}
            type="range"
            min={0}
            max={100}
            value={Math.round(hsl.s * 100)}
            aria-label="Saturation"
            onChange={(e) => {
              const newColor = chroma.hsl(hsl.h, +e.target.value / 100, hsl.l);
              onSaturationChange(newColor.hex());
            }}
            className="w-full"
            style={{
              background: `linear-gradient(to right, 
                ${chroma.hsl(hsl.h, 0, hsl.l).hex()}, 
                ${chroma.hsl(hsl.h, 1, hsl.l).hex()}
              )`,
            }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor={lightId} className="text-xs font-medium text-[#6B6965] uppercase tracking-wider">
              Lightness
            </label>
            <span className="text-xs font-mono text-[#6B6965]">{Math.round(hsl.l * 100)}%</span>
          </div>
          <input
            id={lightId}
            type="range"
            min={5}
            max={95}
            value={Math.round(hsl.l * 100)}
            aria-label="Lightness"
            onChange={(e) => {
              const newColor = chroma.hsl(hsl.h, hsl.s, +e.target.value / 100);
              onLightnessChange(newColor.hex());
            }}
            className="w-full"
            style={{
              background: `linear-gradient(to right, 
                ${chroma.hsl(hsl.h, hsl.s, 0.05).hex()}, 
                ${chroma.hsl(hsl.h, hsl.s, 0.5).hex()}, 
                ${chroma.hsl(hsl.h, hsl.s, 0.95).hex()}
              )`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorWheel;