---
name: ClimaTech & Electricidad
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#8a5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#de8712'
  on-tertiary-container: '#4d2b00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86e'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
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
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
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
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
This design system bridges industrial reliability with modern technological efficiency. The aesthetic is **Corporate / Modern** with a **Glassmorphism** overlay layer, creating a high-trust environment for HVAC and electrical services. 

The brand personality is professional, precise, and responsive. It balances the "cold" technical requirements of cooling systems with the "warm" energy of electrical services. The UI uses heavy whitespace and crisp typography to evoke a sense of organized expertise, while translucent layers suggest a forward-thinking, "smart" approach to utility management.

## Colors
The palette is functional and semantic. 

- **Primary (#0EA5E9):** Represents cooling, air conditioning, and fluid precision. Use for primary actions and HVAC-specific content.
- **Secondary (#F59E0B):** Represents energy, electricity, and warmth. Use for electrical service sections, warnings, or high-visibility highlights.
- **Neutrals:** The "Clean Slate" palette provides the structural foundation. Deep slate (#0F172A) is used for high-contrast text and dark-mode surfaces, while the light slate (#F8FAFC) ensures a clinical, clean feel for standard backgrounds.

## Typography
Inter is utilized for its exceptional legibility and systematic appearance. 

- **Headlines:** Use Bold and ExtraBold weights with slight negative letter-spacing to create a "heavy-duty" industrial feel. 
- **Body:** Standard weight (400) is used for descriptions to maintain a friendly, approachable tone.
- **Labels:** Uppercase styling with increased tracking is reserved for technical specs, status indicators, and category tags to differentiate data from prose.

## Layout & Spacing
The layout follows a **Fluid Grid** system based on an 8px square rhythm. 

- **Mobile:** 4-column layout with 16px side margins. Elements are primarily stacked to ensure ease of use for technicians in the field.
- **Tablet/Desktop:** 12-column layout with 24px gutters. Use asymmetrical layouts (e.g., 8 columns for content, 4 for sidebar) to handle complex technical documentation and booking flows.
- **Rhythm:** Spacing between sections should be generous (64px+) to reinforce the "Clean Slate" aesthetic.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Ambient Shadows**.

- **Surface Layers:** Main content sits on flat `#FFFFFF` or `#F8FAFC` surfaces.
- **Glass Effects:** Overlays, navigation bars, and floating action menus must use a backdrop blur (12px–20px) with a semi-transparent white (80% opacity) background and a 1px white inner border to simulate frosted glass.
- **Shadows:** Use large, highly diffused shadows (e.g., `0 20px 25px -5px rgba(15, 23, 42, 0.1)`) to elevate cards without creating visual clutter.

## Shapes
The shape language is defined by significant roundedness to soften the industrial nature of the brand.

- **Standard Elements:** Buttons and inputs use a base 0.5rem (rounded-md).
- **Featured Containers:** Cards and major sections use **1.5rem (rounded-2xl)** to create a modern, friendly enclosure.
- **Icons:** Should be contained within circular or "Squircle" backgrounds to maintain the "Shield/Gear" logo motif.

## Components
- **Buttons:** Use `rounded-lg` for primary actions. The HVAC primary button is Ice Blue with white text; the Electric primary is Amber with Slate text. Apply a subtle 2px bottom "border-shade" for a tactile feel.
- **Cards:** Utilize the `rounded-2xl` setting. Use a 1px border of `#E2E8F0` rather than heavy shadows for a cleaner, professional look.
- **Input Fields:** High-contrast borders (Slate-200) that transition to the Primary Ice Blue on focus. Labels should be small and bold above the field.
- **Status Chips:** Use rounded-full (pill) shapes. For "Active/Cooling" use Ice Blue backgrounds with 10% opacity; for "Active/Energy" use Amber with 10% opacity.
- **Booking Progress Bar:** A thick 8px track with rounded ends, using a gradient from Ice Blue to Amber to represent the full service spectrum of the company.