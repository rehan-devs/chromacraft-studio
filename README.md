# 🎨 ChromaCraft Studio

**A premium color system generator for designers and developers.**

Generate complete, production-ready color systems from a single brand color — with perceptually uniform shade scales, color harmonies, accessibility audits, dark mode palettes, and multi-format export.

[Live Demo →](https://chromacraft-studio.vercel.app/) · [Report Bug →](../../issues) · [Request Feature →](../../issues)

---

![React](https://img.shields.io/badge/React_18-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

---

## ✨ Features

- **🎯 One Color In, Full System Out** — Enter any color (HEX, RGB, or HSL) and instantly generate a complete design system
- **🌈 Perceptually Uniform Shades** — 11-step shade scale (50–950) using LAB/LCH color space interpolation, not naive lighten/darken
- **🔄 Interactive Color Wheel** — Drag to adjust hue in real-time with harmony colors visualized on the wheel
- **🎭 Color Harmonies** — Complementary, analogous, triadic, and split-complementary palettes with full shade scales
- **🌙 Dark Mode Generation** — Complete semantic dark palette with a realistic UI mockup preview
- **♿ Accessibility Audit** — WCAG 2.1 contrast ratings for every shade against white and black text
- **✏️ Live Text Preview** — Test custom text with any foreground/background combination and adjustable font sizes
- **🎨 Harmony Mixer** — Side-by-side color pairing previews with contrast ratios
- **💾 Save & Load Palettes** — Save unlimited palettes to local storage for later use
- **📦 Multi-Format Export** — CSS custom properties, Tailwind config, SCSS variables, and JSON with custom naming
- **🪄 Adaptive UI** — The app's own accent color adapts to match your input color
- **📱 Fully Responsive** — Premium experience on desktop, tablet, and mobile

---

## 🖼️ Preview

<div align="center">
  <em>Enter a color and watch your complete design system come to life.</em>
</div>

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, or **pnpm**

---

### Installation

```bash
# Clone the repository
git clone https://github.com/rehan-devs/chromacraft-studio.git
cd chromacraft-studio

# Install dependencies
npm install

# Start development server
npm run dev
The app will be running at http://localhost:5173
```
---

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder will contain your production-ready static files.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework with functional components and hooks. |
| TypeScript | Type safety in strict mode. |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Chroma.js | Color science—LAB/LCH interpolation, contrast ratios. |
| React Router v6 | Client-side routing |
| Lucide React | Icon system. |
| Framer Motion | Spring-physics animations and micro-interactions. |
| Zero UI library dependencies | Every component is custom-built. |

---

## 📂 Project Structure
```
src/
├── App.tsx                  # Root application component
├── main.tsx                 # Entry point
├── index.css                # Global styles, fonts, grain texture
├── types/
│   └── index.ts             # TypeScript interfaces
├── hooks/
│   ├── useColorEngine.ts    # Core color system generation
│   ├── useSavedPalettes.ts  # localStorage palette management
│   └── useClipboard.ts      # Clipboard API wrapper
├── utils/
│   ├── colorGenerator.ts    # Shade scales, harmonies, dark mode
│   ├── contrastChecker.ts   # WCAG contrast calculations
│   ├── exporters.ts         # CSS, Tailwind, SCSS, JSON export
│   └── colorParser.ts       # Multi-format color input parsing
└── components/
    ├── Layout/              # Header, Footer
    ├── Input/               # Color input, format toggle, color wheel
    ├── Palette/             # Shade scale, harmonies, dark mode
    ├── Accessibility/       # Contrast grid, live preview
    ├── Export/              # Multi-format code export
    ├── SavedPalettes/       # Palette library drawer
    └── Common/              # Toast, copy button, section title, grain
```
---

## 🎨 Color Science

ChromaCraft Studio uses perceptually uniform color spaces for all color math:

- Shade generation interpolates in LAB space between warm white (#FFFEF9) and warm black (#121210)
- Light tints are subtly desaturated for a natural feel
- Dark shades shift hue slightly toward blue, mimicking natural shadow behavior
- Dark mode palettes are generated using LCH color space for precise lightness and chroma control
- Contrast ratios follow WCAG 2.1 guidelines with AAA/AA/AA Large/Fail ratings

---

## 🎨 🔑 What Makes This Different

- Feature	Typical Tools	ChromaCraft Studio
- Color interpolation	HSL (perceptually uneven)	LAB/LCH (perceptually uniform)
- Dark mode	Manual or none	Auto-generated semantic palette with UI preview
- Accessibility	Basic or separate tool	Integrated audit with live text preview
- Color wheel	Static display	Interactive, draggable with harmony visualization
- Export	Single format	CSS, Tailwind, SCSS, JSON with custom naming
- App feel	Generic dashboard	Editorial design tool with grain texture & micro-interactions

---

## 🎨 🗺️ Roadmap

 - **Color Blindness Simulation** — Preview palettes as seen by colorblind users
 - **Figma Plugin** — Export directly to Figma variables
 - **VS Code Extension** — Generate palettes without leaving your editor
 - **AI Color Naming** — Intelligent, memorable names for your shades
 - **Brand Guidelines Export** — Generate PDF documentation
 - **Team Collaboration** — Share and sync palettes across teams
 - **Color Trend Analysis** — Suggestions based on current design trends

---

## 🎨 🤝 Contributing

Contributions are welcome! Feel free to:

```
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
```

---

## 🎨 📧 Contact

Created by Rehan — GitHub | [Website →](https://rehandevs.vercel.app/) 

⭐ If you find this useful, please star the repo!

---

## 🎨 📄 License
This project is open source and available under the MIT License.

---

<p align="center">Craft color systems with intention.
 <b>Built with ❤️ for designers who care about craft.</b></p>