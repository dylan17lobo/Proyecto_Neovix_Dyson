---
name: NEOVIX DYSON
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#bdc6e1'
  on-secondary: '#273045'
  secondary-container: '#3e465d'
  on-secondary-container: '#acb5cf'
  tertiary: '#f5f5ff'
  on-tertiary: '#2b303c'
  tertiary-container: '#d5d9e9'
  on-tertiary-container: '#5a5f6c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#d9e2fe'
  secondary-fixed-dim: '#bdc6e1'
  on-secondary-fixed: '#121b2f'
  on-secondary-fixed-variant: '#3e465d'
  tertiary-fixed: '#dee2f2'
  tertiary-fixed-dim: '#c2c6d6'
  on-tertiary-fixed: '#171b27'
  on-tertiary-fixed-variant: '#424754'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system for this product is built on a "Technological Precision" narrative. It targets hardware enthusiasts and professional system builders who demand performance and reliability. The UI evokes a sense of high-fidelity engineering through a **Modern-Glassmorphic** style—mixing the structure of corporate SaaS with the futuristic aesthetics of aerospace interfaces. 

The emotional response should be one of "Expert Control." This is achieved through a dark-mode first interface, deep atmospheric depth, and sharp, high-contrast accents that guide the user's eye toward technical specifications and performance metrics.

## Colors
The palette is rooted in the "Deep Space" spectrum. 
- **Primary (Electric Cyan):** Used sparingly for interactive states, progress indicators, and critical calls to action. It represents energy and connectivity.
- **Secondary (Deep Space Blue):** The primary surface color, providing a professional alternative to pure black.
- **Neutrals:** A range of cool grays that handle metadata and inactive states.
- **Gradients:** Subtle cyan-to-blue linear gradients are applied to primary buttons and active indicators to simulate glowing hardware components.

## Typography
The typography strategy utilizes a tri-font system to reinforce the technical nature of the product:
1. **Sora (Headlines):** Its geometric construction and wide stance provide a futuristic, "high-tech" brand presence.
2. **Inter (Body):** Chosen for its exceptional readability in dense technical descriptions and specification lists.
3. **JetBrains Mono (Data/Labels):** A monospaced font used for SKUs, part numbers, and hardware specs to mimic the aesthetic of terminal readouts and BIOS interfaces.

## Layout & Spacing
The layout uses a **12-column fluid grid** for desktop, transitioning to a **4-column grid** for mobile. 
- **Rhythm:** An 8px linear scale governs all padding and margins to ensure mathematical consistency.
- **Margins:** Desktop views utilize a generous 64px outer margin to allow the "Glass" elements to breathe against the dark background.
- **Alignment:** Components should prioritize left-alignment for readability, but "Spec Sheets" use a rigid tabular layout with 1px borders to simulate blueprint accuracy.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Stacking** and **Glassmorphism** rather than traditional drop shadows.
- **Level 0 (Background):** Pure `#05070A` to hide bezel edges on OLED screens.
- **Level 1 (Cards/Sections):** Semi-transparent `#0F172A` with a 12px backdrop blur and a 1px inner border (Stroke: 10% white).
- **Level 2 (Modals/Popovers):** Higher transparency with a subtle "Cyan Glow" outer shadow (Blur: 20px, Opacity: 15%) to indicate active focus.
- **Overlays:** Use a 40% blur on background elements when modals are active to maintain the "Glass" metaphor.

## Shapes
The shape language is "Soft-Industrial." We avoid fully circular "pill" shapes to maintain a professional, structural feel. 
- **Standard Radius:** 4px (Soft) for most components to provide a modern touch without losing the "hard" edge of high-performance machinery.
- **Product Images:** Should always be contained in cards with the standard radius.
- **Interactive Elements:** Buttons and Inputs follow the `rounded-sm` (4px) or `rounded-md` (8px) rules strictly.

## Components
- **Buttons:** Primary buttons use the `accent_gradient` with white text. Hover states trigger a "Glow" effect (box-shadow) rather than a color change.
- **Product Cards:** Sleek, dark surfaces with a 1px border. On hover, the border color shifts from neutral-gray to primary-cyan.
- **Data Tables:** Used for component specifications. Features alternating row highlights (zebra striping) using 2% white opacity and monospaced labels for hardware values.
- **Input Fields:** Dark background, sharp corners, and a 2px bottom-border highlight in primary-cyan when focused.
- **Status Chips:** Small, monospaced text indicators (e.g., "IN STOCK") with a subtle background tint and a 4px circular "LED" dot indicator.
- **Specs List:** A specialized component for computer parts, using a split-pane view where labels are left-aligned and values are right-aligned in `label_font`.