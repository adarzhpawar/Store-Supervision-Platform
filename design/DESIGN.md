---
name: Nordic Operational Excellence
colors:
  surface: '#fdf9ef'
  surface-dim: '#dedad1'
  surface-bright: '#fdf9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ea'
  surface-container: '#f2ede4'
  surface-container-high: '#ece8de'
  surface-container-highest: '#e6e2d9'
  on-surface: '#1d1c16'
  on-surface-variant: '#5b403e'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e7'
  outline: '#8f6f6d'
  outline-variant: '#e4beba'
  surface-tint: '#ba1724'
  primary: '#b71422'
  on-primary: '#ffffff'
  primary-container: '#db3237'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3ae'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#00685a'
  on-tertiary: '#ffffff'
  tertiary-container: '#008373'
  on-tertiary-container: '#f4fffb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ae'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#930014'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#7ef7e0'
  tertiary-fixed-dim: '#60dac4'
  on-tertiary-fixed: '#00201b'
  on-tertiary-fixed-variant: '#005046'
  background: '#fdf9ef'
  on-background: '#1d1c16'
  surface-variant: '#e6e2d9'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '500'
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
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  section-gap: 80px
  container-padding: 40px
  gutter: 24px
  margin-sm: 16px
  margin-md: 32px
  margin-lg: 64px
---

## Brand & Style

This design system embodies a premium Scandinavian aesthetic tailored for Store Management SaaS. It prioritizes clarity, editorial precision, and a sense of "quiet luxury." The goal is to transform complex operational data into a calm, high-end experience that feels more like an editorial magazine than a traditional software dashboard.

The style is a blend of **Minimalism** and **Corporate Modern**, utilizing massive typography and extreme whitespace to establish hierarchy. The interface communicates reliability and sophistication through a warm, tactile color palette and razor-thin structural elements. It avoids unnecessary decoration, relying instead on perfect alignment, generous breathing room, and a singular, vibrant accent to guide the user's intent.

## Colors

The palette is built on a foundation of "Warm Heritage" and "Modern Precision." 

- **Background (#E7E4DD):** A warm, desaturated beige that serves as the canvas. It reduces eye strain compared to pure white and adds a premium, paper-like quality.
- **Primary Accent (#FF4D4D):** A punchy Coral Red used sparingly for high-priority actions, notifications, and critical status indicators.
- **Typography & Details (#111111):** A near-black for maximum contrast and legibility. Used for all primary text and 1px structural borders.
- **Neutral/Surface:** Lighter and darker variants of the background color are used to create subtle depth without breaking the monochromatic harmony.

## Typography

Typography is the primary design element. We use **Hanken Grotesk** for headings to provide a sharp, contemporary edge that feels engineered yet elegant. **Inter** handles body text for its unmatched legibility in data-dense SaaS environments. 

To lean into the "technical" side of store management, **JetBrains Mono** is used for small labels, metadata, and status tags, adding a layer of precise, functional aesthetics. 

Large headings should often use tight letter-spacing to emphasize their "display" nature, while mono-spaced labels should be slightly tracked out for a clean, utilitarian look.

## Layout & Spacing

This design system employs a **Fluid Grid** model with high-margin boundaries. 

- **Desktop:** 12-column grid with a maximum content width of 1440px. 40px external margins ensure the layout feels uncrowded.
- **Tablet:** 8-column grid with 32px margins.
- **Mobile:** 4-column grid with 20px margins.

The "Section Gap" (80px) is vital for maintaining the minimalist luxury feel; users should feel they are navigating an expansive space. Spacing follows an 8px base unit, but preference is always given to larger increments to avoid a "cluttered" dashboard feel.

## Elevation & Depth

To maintain a flat, editorial aesthetic, this design system avoids traditional box shadows. Instead, depth is communicated through:

1.  **Layered Tones:** Using slightly different shades of the background beige to indicate hierarchy (e.g., a card being `#F2F0EB` against the `#E7E4DD` page).
2.  **Thin Outlines:** 1px solid borders in `#111111` (or 10% opacity black) define containers. This creates a "blueprint" or "architectural" feel.
3.  **Backdrop Blurs:** For overlays and modals, use a high-saturation blur of the background colors rather than a dark tint to maintain the "lightness" of the Scandinavian theme.

## Shapes

The shape language is defined by a consistent **20px (1.25rem)** corner radius for all primary containers and cards. This large radius softens the high-contrast black borders and coral accents, making the software feel approachable and modern.

- **Primary Radius:** 20px for cards, modals, and large sections.
- **Secondary Radius:** 8px for smaller UI elements like input fields and buttons.
- **Pill:** Used exclusively for status chips and tags.

## Components

### Buttons
- **Primary:** Solid `#111111` background with white text. High contrast, sharp, and authoritative. 8px corner radius.
- **Secondary:** 1px `#111111` border, no fill.
- **Action (Coral):** Used only for "Create" or "Urgent" actions. Solid `#FF4D4D`.

### Input Fields
- Transparent background with a 1px bottom-border or full 1px border in `#111111`. 
- Focus state: Border thickness remains 1px but gains a subtle coral glow or a small coral indicator dot.

### Cards
- 1px solid border.
- 20px rounded corners.
- Generous internal padding (minimum 32px).
- Typography-heavy content with clear mono-spaced headers.

### Chips & Tags
- Pill-shaped. 
- Using `label-mono` typography.
- Neutral tags use a light beige stroke; active or status tags use the Primary Coral color as a small dot prefix.

### Navigation
- Sidebar navigation should be ultra-minimal, using text-only or text + minimal stroke icons. 
- Active states are indicated by a 1px underline or a Coral Red dot, never a solid background block.