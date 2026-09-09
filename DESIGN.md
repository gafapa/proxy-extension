---
name: Proxy
description: A warm, high-contrast technical system that makes the browser request bridge visible and trustworthy.
colors:
  signal-lime: "#b7f36b"
  signal-lime-strong: "#9fe34f"
  signal-ink: "#14200d"
  warm-canvas: "#151714"
  warm-surface: "#1d201c"
  console-black: "#0d0f0c"
  primary-text: "#f4f4ec"
  muted-text: "#b5b9ac"
  structural-line: "#363b32"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(2.35rem, 3.2vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(1.75rem, 2.5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.05em"
rounded:
  control: "9px"
  button: "10px"
  panel: "14px"
  pill: "999px"
spacing:
  compact: "10px"
  control: "20px"
  panel: "34px"
  section-mobile: "76px"
  section: "104px"
components:
  button-primary:
    backgroundColor: "{colors.signal-lime}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.button}"
    padding: "0 20px"
    height: "48px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.signal-lime-strong}"
    textColor: "{colors.signal-ink}"
  button-secondary:
    backgroundColor: "{colors.warm-surface}"
    textColor: "{colors.primary-text}"
    rounded: "{rounded.button}"
    padding: "0 20px"
    height: "48px"
    typography: "{typography.body}"
  version-chip:
    backgroundColor: "{colors.warm-surface}"
    textColor: "{colors.signal-lime}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "36px"
    typography: "{typography.label}"
---

# Design System: Proxy

## Overview

**Creative North Star: "The Living Bridge"**

Proxy uses a warm near-black canvas and a precise lime signal to make an invisible browser bridge feel concrete. Oversized Manrope statements establish confidence; IBM Plex Mono labels, request metadata, and the animated page-to-target path supply technical proof without turning the page into developer tooling.

The system is spacious at the statement level and compact at the control level. Thin structural rules organize content, while one deep console and one solid lime download block carry the strongest depth and color moments. Proxy's geometric icon, factual scope language, localization, and lightweight static implementation remain part of the identity.

**Key Characteristics:**

- Warm dark canvas with restrained tonal layering.
- Lime used as a signal for action, success, and transmission.
- Bold, tightly tracked Manrope display type paired with compact IBM Plex Mono metadata.
- Large editorial sections divided by fine rules rather than repeated cards.
- A living page → content → worker → target bridge as the signature proof.

## Colors

The palette pairs warm charcoal neutrals with a single electric lime accent whose scarcity gives it authority.

### Primary

- **Signal Lime:** Drives primary actions, successful request states, step numbers, selection, focus, and the animated transmission dot.
- **Signal Lime Strong:** Replaces Signal Lime on primary-button hover to preserve a clear interactive response.
- **Signal Ink:** Provides dark, high-contrast text and controls on lime fields.

### Neutral

- **Warm Canvas:** The page background and sticky-navigation veil.
- **Warm Surface:** Controls and secondary actions that need slight separation from the canvas.
- **Console Black:** The deepest surface, reserved for the bridge proof.
- **Primary Text:** Headlines and high-priority content on dark surfaces.
- **Muted Text:** Supporting explanations, navigation links, and metadata.
- **Structural Line:** Dividers, control strokes, and section boundaries.

**The Signal Color Rule.** Use lime for action, state, and data movement; keep most reading surfaces neutral so every lime mark carries meaning.

## Typography

**Display Font:** Manrope (with Segoe UI and sans-serif fallbacks)  
**Body Font:** Manrope (with Segoe UI and sans-serif fallbacks)  
**Label/Mono Font:** IBM Plex Mono (with monospace fallback)

**Character:** Manrope supplies blunt, modern confidence through heavy weight, close tracking, and compressed line height. IBM Plex Mono distinguishes machine-readable labels, versions, flow nodes, headers, and status values.

### Hierarchy

- **Display:** Hero statements use the largest responsive scale, a 700 weight, tight leading, and a maximum width near 13 characters.
- **Headline:** Section statements use a slightly smaller responsive scale with the same tight construction and an approximate 18-character measure.
- **Title:** Step titles use compact bold type for fast scanning.
- **Body:** Explanatory text uses relaxed leading and typically stays within 60–65 characters.
- **Label:** Metadata uses small uppercase mono type with added tracking; runtime data may retain the mono face without uppercase transformation.

**The Two Voices Rule.** Use Manrope for human explanation and IBM Plex Mono for system identity, state, sequence, and metadata.

## Layout

The desktop shell is centered at a maximum width of 1240px with 24px side clearance. The first viewport uses an asymmetric two-column grid: a narrower statement column and a wider bridge console, separated by a fluid 40–96px gap. Major sections breathe vertically, while horizontal rules keep the long page legible without wrapping every concept in a card.

At 980px the hero becomes one column, console perspective is removed, and four installation steps become two columns. At 720px the shell uses 14px gutters; navigation wraps beneath the brand controls, all content grids become single-column, the bridge path turns vertical, buttons in the download panel fill the width, and section spacing contracts.

**The Statement-to-Proof Rule.** Pair a large claim with a concrete mechanism or constraint; never let the display scale outrun the product evidence beside it.

## Elevation & Depth

Most surfaces are flat and separated by tone or one-pixel rules. The bridge console alone receives pronounced ambient shadow, a subtle perspective tilt on wide screens, and a diffused lime glow, marking it as the functional centerpiece. The sticky top bar uses translucent canvas color and backdrop blur to preserve context while scrolling.

### Shadow Vocabulary

- **Console Lift** (`0 28px 80px rgba(0, 0, 0, 0.38)`): Reserved for the bridge console.
- **Signal Glow** (`0 0 14px rgba(183, 243, 107, 0.7)`): Applied to moving transmission dots only.

**The Singular Lift Rule.** Reserve strong elevation for the bridge proof; ordinary sections and controls stay flat.

## Shapes

The system uses gently rounded rectangles: 14px for major panels, 10px for buttons, and 9px for compact controls. One-pixel borders preserve technical precision. Small circles are limited to console window dots, scope bullets, and animated data particles. The original geometric Proxy icon remains the brand silhouette.

## Components

### Buttons

- **Shape:** Compact rounded rectangle with a 10px radius and 48px minimum height.
- **Primary:** Solid Signal Lime with Signal Ink text, a matching border, bold label, and 20px horizontal padding.
- **Hover / Focus:** Hover shifts to Signal Lime Strong and rises 2px over 160ms. Keyboard focus uses a 2px lime outline with a 4px offset.
- **Secondary:** Warm Surface fill, Structural Line border, and Primary Text.

### Chips

- **Style:** Version metadata uses a 36px-high Warm Surface chip with lime mono text, a Structural Line border, a 9px radius, and 10px horizontal padding.

### Cards / Containers

- **Corner Style:** Major contained moments use a 14px radius.
- **Background:** The bridge console uses Console Black; the download panel reverses the system with a Signal Lime field and Signal Ink copy.
- **Shadow Strategy:** Only the bridge console uses Console Lift.
- **Border:** Console and metadata structures use one-pixel dark olive-gray rules.
- **Internal Padding:** Console content uses 34px on desktop and 18–24px on small screens; the download panel uses a responsive 28–56px inset.

### Inputs / Fields

- **Style:** The language select is a compact Warm Surface field with a Structural Line stroke, Primary Text, a 9px radius, and a 36px minimum height.
- **Focus:** It inherits the global offset lime focus outline.

### Navigation

The sticky desktop navigation is compact and muted, with 26px between links; hover raises text to Primary Text. The brand combines the preserved geometric icon with a bold wordmark. Below 720px, controls wrap and navigation occupies a full second row while retaining 18px link spacing.

### Bridge Console

The signature console visualizes the complete page → content → worker → target path. Lime dots cross neutral connectors in a staggered 2.4-second sequence; at small widths the path becomes vertical. The request method, success state, and forwarded/verified results share the lime signal. Reduced-motion preferences collapse animation and transitions to a single near-instant iteration.

## Do's and Don'ts

### Do:

- **Do** preserve the warm near-black foundation and use thin structural lines to organize long-form content.
- **Do** keep display copy concise enough to retain a clear Manrope silhouette across locales.
- **Do** use mono labels for runtime facts, sequence, versions, and metadata.
- **Do** translate grid-based proof into a readable vertical sequence on narrow screens.
- **Do** retain the Proxy icon, factual content, localization hooks, and static asset model.

### Don't:

- **Don't** spread lime across decorative backgrounds or routine body copy.
- **Don't** introduce a second accent hue or competing illustration style.
- **Don't** turn installation steps and scope facts into a dense collection of elevated cards.
- **Don't** apply console perspective on tablet or mobile layouts.
- **Don't** add visual claims, customer proof, or performance metrics absent from the product record.
