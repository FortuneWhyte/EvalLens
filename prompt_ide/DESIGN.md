---
name: Cyber-Terminal Matrix
colors:
  surface: '#131318'
  surface-dim: '#131318'
  surface-bright: '#39383e'
  surface-container-lowest: '#0e0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f25'
  surface-container-high: '#2a292f'
  surface-container-highest: '#35343a'
  on-surface: '#e4e1e9'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#e4e1e9'
  inverse-on-surface: '#303036'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#dcfdff'
  on-secondary: '#00373a'
  secondary-container: '#00f1fd'
  on-secondary-container: '#006a6f'
  tertiary: '#fff7f9'
  on-tertiary: '#5b005b'
  tertiary-container: '#ffcef4'
  on-tertiary-container: '#ad00ad'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#6ff6ff'
  secondary-fixed-dim: '#00dce6'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#ffd7f5'
  tertiary-fixed-dim: '#ffabf3'
  on-tertiary-fixed: '#380038'
  on-tertiary-fixed-variant: '#810081'
  background: '#131318'
  on-background: '#e4e1e9'
  surface-variant: '#35343a'
typography:
  display:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.05em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  code:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
spacing:
  unit: 4px
  gutter: 16px
  margin: 24px
  container-max: 1440px
---

## Brand & Style
The brand personality is high-tech, precise, and subversive. This design system draws heavily from **Cyberpunk/Retro-Futurism** and **Modern Brutalism**, simulating an advanced command-line interface or a "hacker terminal." The UI should feel like a specialized tool for power users—dense, organized, and glowing with synthetic energy. 

Key aesthetic pillars:
- **CRT Emulation:** Subtle scanlines, flickering states, and chromatic aberration effects.
- **Structural Integrity:** Every element is locked to a rigid grid, emphasizing the cold logic of a machine.
- **Luminosity:** Elements do not just exist; they radiate. High-contrast neon accents pierce through a deep, near-black void to create depth through light rather than shadow.

## Colors
The palette is built on a foundation of absolute darkness (`#0a0a0f`), serving as the "void" that allows neon accents to pop. 

- **Primary (Neon Green):** Used for terminal output, success states, and primary actions. It represents the "standard" system state.
- **Secondary (Neon Cyan):** Reserved for active processes, running tasks, and interactive elements.
- **Tertiary (Neon Magenta):** Dedicated to data visualization, costs, and high-level metrics.
- **Functional Gray:** Used for "queued" states or inactive metadata to reduce visual noise.

All neon colors must be applied with a CSS `drop-shadow` or `text-shadow` using the `--glow-strength` variable to simulate the phosphor bleed of a CRT monitor.

## Typography
This design system utilizes **JetBrains Mono** exclusively to maintain the "hacker terminal" aesthetic. The monospace nature ensures that data tables and logs align perfectly.

- **Formatting:** Use `label-caps` for section headers and button labels to create a functional, modular feel.
- **Glow Effect:** Apply a subtle `text-shadow` to all headers (Green or Cyan) to simulate light emission.
- **Scaling:** On mobile, reduce `display` and `headline-lg` by 25%. Body text remains consistent at 14px for legibility in dense data environments.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, reminiscent of a motherboard or architectural blueprint. 

- **Grid:** A 12-column grid is used for desktop. All panels must snap to the grid lines.
- **Background Grid:** A faint, 1px repeating background pattern (24px x 24px) should be visible at 5% opacity to reinforce the technical nature of the UI.
- **Density:** Spacing is tight and efficient. Use 16px (4 units) for general grouping and 32px (8 units) for major section separation.
- **Mobile:** Transition to a 4-column grid. Borders remain 1px. Stack all panels vertically while maintaining 16px side margins.

## Elevation & Depth
Depth is created through **Luminous Layering** rather than traditional shadows.

- **Surfaces:** Panels use a slightly lighter version of the background (`#12121a`) with a 1px solid neon border.
- **Outer Glow:** Panels should have a very subtle `box-shadow` matching the border color to simulate "light leakage" onto the grid background.
- **Scanlines:** A global overlay using a linear gradient (transparent to black at 50% opacity, 2px height) should be fixed to the viewport to create the "screen" effect.
- **Z-Index:** Modals and popovers use a higher intensity glow and a darker backdrop blur (10px) to separate themselves from the primary terminal layer.

## Shapes
The shape language is strictly **Sharp (0px roundedness)**. 

Curves are perceived as organic and "soft," which contradicts the digital, machine-driven narrative of this system. Every button, input, and panel must feature 90-degree angles. To add character, consider clipped corners (45-degree bevels) on primary action buttons or decorative panel headers to reinforce the "military-grade" tech feel.

## Components
- **Buttons:** Solid 1px neon borders with no background fill. On hover, the background fills with a 10% opacity version of the border color and the glow intensity increases. Text is always uppercase.
- **Input Fields:** Styled as "Command Prompts." Use a `>` prefix. The cursor should be a blinking solid block (`#00ff41`).
- **Cards/Panels:** Every card must have a header label in the top-left, often contained within a small "tab" that breaks the top border line.
- **Status Indicators:** Small 8px squares. Use a pulsing animation for "active" (Cyan) states to indicate a running process.
- **Progress Bars:** Segmented into blocks rather than a smooth continuous fill to look like vintage loading sequences.
- **Scrollbars:** Ultra-thin (4px), using the primary neon green for the thumb and the background dark for the track.