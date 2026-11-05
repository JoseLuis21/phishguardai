---
name: PhishGuardAI
description: Each analyzed email is a stamped coupon; nothing disappears, it gets stamped.
colors:
  navy: "#1b2a52"
  navy-deep: "#121d3b"
  navy-ink: "#c9d1e6"
  jet-red: "#b42029"
  carbon: "#4b3a7a"
  carbon-copy: "#ebe5f5"
  carbon-copy-rule: "#cbbfe3"
  stock: "#fbfaf6"
  ground: "#e8eaef"
  hairline: "#c9ced8"
  ink: "#1c2033"
  mute: "#4f566a"
  amber: "#8a5a00"
  green: "#1f6b43"
  slate: "#555b6e"
  shell-rule: "#2f3f6b"
  shell-border: "#5a6a94"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.4rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 75"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    lineHeight: 1
    letterSpacing: "0.1em"
    fontVariation: "\"wdth\" 75"
  stamp:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.68rem"
    fontWeight: 750
    lineHeight: 1.1
    letterSpacing: "0.1em"
    fontVariation: "\"wdth\" 75"
  figure:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
    fontVariation: "\"wdth\" 75"
  hero:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.9rem"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  lead:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: "0px"
  notch: "50%"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1.25rem"
  lg: "1.75rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.navy}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.navy-deep}"
    textColor: "#ffffff"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  button-outline-hover:
    backgroundColor: "{colors.navy}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  button-ghost-hover:
    backgroundColor: "#e3e6ee"
  button-destructive:
    backgroundColor: "transparent"
    textColor: "{colors.jet-red}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  button-destructive-hover:
    backgroundColor: "{colors.jet-red}"
    textColor: "#ffffff"
  button-destructive-solid:
    backgroundColor: "{colors.jet-red}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.5rem"
  button-destructive-solid-hover:
    backgroundColor: "#8f1820"
  input:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.75rem"
    height: "2.5rem"
  label:
    textColor: "{colors.mute}"
    typography: "{typography.label}"
  top-bar:
    backgroundColor: "{colors.navy}"
    textColor: "#ffffff"
    height: "3.5rem"
  top-bar-figure:
    textColor: "{colors.carbon-copy-rule}"
    typography: "{typography.figure}"
  coupon:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2rem"
  coupon-copy:
    backgroundColor: "{colors.carbon-copy}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2rem"
  stub:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  stub-active:
    backgroundColor: "#ffffff"
  stamp-danger:
    textColor: "{colors.jet-red}"
    typography: "{typography.stamp}"
  stamp-alert:
    textColor: "{colors.amber}"
    typography: "{typography.stamp}"
  stamp-safe:
    textColor: "{colors.green}"
    typography: "{typography.stamp}"
  stamp-neutral:
    textColor: "{colors.slate}"
    typography: "{typography.stamp}"
  stamp-ink:
    textColor: "{colors.navy}"
    typography: "{typography.stamp}"
  copy-field:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.none}"
    padding: "0.375rem 0.375rem 0.375rem 0.75rem"
  copy-field-large:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.carbon}"
    rounded: "{rounded.none}"
    padding: "0.5rem 0.5rem 0.5rem 1rem"
  technique-code:
    textColor: "{colors.carbon}"
    rounded: "{rounded.none}"
    padding: "1px 0.375rem"
  icon-button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    size: "2rem"
  icon-button-outline-hover:
    backgroundColor: "{colors.navy}"
    textColor: "#ffffff"
  theme-toggle:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    size: "2.25rem"
  chart-bar:
    backgroundColor: "{colors.carbon}"
    rounded: "{rounded.none}"
    height: "0.625rem"
  strength-segment:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.none}"
    height: "0.25rem"
  story-stub:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
    width: "20rem"
---

# Design System: PhishGuardAI

## Overview

**Creative North Star: "The Coupon Booklet"**

PhishGuardAI borrows the system grammar of a jet-age airline ticket wallet: carbon-copy coupons, condensed tracked caps on every heading and tab, fields ruled with hairlines, dashed perforations between coupon and stub, and rubber stamps that validate or void. It borrows the system, not the airline: no planes, globes, flight routes or carrier logos appear anywhere in the build. Each analyzed email is a coupon; its verdict, the state of its report and every analyst action are stamped onto it, and the stamps stay in the coupon's journey. Nothing is removed from the interface: a mistaken analysis is stamped ANULADO and struck through, never deleted.

The application is an Operate surface, open all day on a lit-office monitor, so the world is light by default (a night-shift dark theme keeps every role) and flat. A navy shell carries the brand, navigation and the 30-day totals; below it, a cool grey ground holds coupon-stock surfaces. Density is moderate and deliberate: one open coupon at a time beside a booklet of fixed-shape stubs, with J/K to move between them. Controls stay standard web controls (buttons, tabs, inputs, lists) rebuilt in the world's vocabulary: square corners, condensed caps, 2px borders. Two readers share one truth: the analyst works the original coupon on stock, and the employee who reported the email sees the same coupon as a lilac carbon copy. The public landing speaks the same booklet at a persuasive scale: large sentence-case headlines, the report address as a ticket field to copy, and a real carbon-copy coupon as proof.

The build rejects the generic SaaS dashboard (equal KPI cards, chart, table) and the dark SOC console. Totals live in the navy bar as figures, not as cards.

**Key Characteristics:**
- Navy shell, coupon-stock working surface on a cool grey ground. Light by default, with a night-shift dark theme.
- Jet red reserved for danger: PHISHING, the void stamp, the critical notch, destructive actions and error text.
- Every figure (risk, times, IDs, counts) is set in carbon purple with tabular numerals.
- Rotated stamps carry state, always with text plus a line form (solid, dashed, struck through).
- Dashed perforations with half-circle notches separate coupon from stub.
- Square corners and no shadows anywhere.

## Colors

A cool, inky print palette: one navy that owns structure, one red that is rationed, one purple that belongs to numbers, and three stamp inks that never carry state alone.

### Primary
- **Carrier Navy** (#1b2a52): the top bar and landing header/footer, primary buttons, the 2px frame of the large copy field, the Recorrido markers, outline buttons, the active tab underline in the booklet, section headings inside the coupon, focus outlines, and the ink of every analyst-action stamp. It is the system's voice of authority.
- **Night Navy** (#121d3b): hover state of navy buttons only.
- **Bar Ink** (#c9d1e6): secondary text on the navy bar (role under the user's name, totals legends, landing nav links, footer copy).
- **Shell Border** (#5a6a94): the 2px frame of controls sitting on the navy bar ("Cerrar sesión", "Crear cuenta", the theme toggle); it turns white on hover.
- **Shell Rule** (#2f3f6b): the thin divider between the bar's tab and its totals.

### Secondary
- **Jet Red** (#b42029): the PHISHING verdict stamp, the CRÍTICA stamp, the ANULADO stamp and its dashed frame, the red corner notch on critical stubs, danger markers in the journey, destructive buttons, form error text, and the lit segments of a weak password ("Muy débil", "Débil"). Nothing else.

### Tertiary
- **Carbon Purple** (#4b3a7a): every figure and literal machine value: risk scores, `/100`, coupon numbers, timestamps, tab counts, J/K key caps, the report address in every copy field, ATT&CK technique codes, and the bars of the technique chart. Also the text caret color.
- **Carbon Copy** (#ebe5f5): the ground of the employee's carbon-copy coupon, and the text-selection highlight.
- **Carbon Rule** (#cbbfe3): hairlines inside the carbon copy, and the color of figures set on the navy bar, where Carbon Purple would fail contrast.

### Neutral
- **Coupon Stock** (#fbfaf6): coupons, stubs, empty-state panels, key caps.
- **Stock Ground** (#e8eaef): the page ground between coupons, and the fill of perforation notches so they read as holes punched through.
- **Hairline** (#c9ced8): every border, field rule, divider and perforation dash.
- **Ink** (#1c2033): headings, subjects and body text.
- **Mute** (#4f566a): labels, metadata, helper text, inactive tabs.
- **Stamp Amber** (#8a5a00): the SOSPECHOSO stamp, and the middle levels of the password meter ("Media", "Buena").
- **Stamp Green** (#1f6b43): the PROBABLEMENTE LEGÍTIMO stamp, the "Fuerte" password level, and met rules in the password checklist.
- **Stamp Slate** (#555b6e): NO CONCLUYENTE, SIN CLASIFICAR and voided classification stamps.

### Named Rules
**The Reserved Red Rule.** Red only marks danger: phishing, critical, void, destructive actions and errors. A red decoration spends the meaning of a real red alert.

**The Carbon Figure Rule.** Every figure is carbon purple with tabular numerals; prose is never purple. On the navy bar, figures switch to Carbon Rule (#cbbfe3) to hold contrast.

**The Brand Asset Exception.** The isotype (envelope in scan brackets with a checked shield) keeps the user's own blue (#ffffff → #a8c8ff → #2679ff, stroke #3188ff) and purple (#bb55ff → #713cff) gradients and its rounded strokes. It is the identity asset, not the palette: none of its hues or gradients are reused anywhere else.

**The Night Shift Rule.** Light is the default: printed stock on a lit desk. A dark theme exists for the night shift, the same booklet under a desk lamp: every role keeps its job and only its value changes (stock #151c30 on ground #0d1322, Hairline #2d3753, ink #e7e9f1, inks lifted to navy #a9b9ea, red #f0646b, carbon #b9a8ec, amber #e0a644, green #5cc58f). Filled controls flip their text (on-navy #10182f, on-red #1c0c0e); the shell darkens to #0a0f1d. It follows the system preference until the person picks one with the sun/moon switch in the shell; the choice is saved per browser and applied before first paint. Still flat: no glows or shadows in the dark. The landing and auth screens carry the same switch.

## Typography

**Display Font:** Archivo variable (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo variable, same family
**Label Font:** Archivo at `font-stretch: 75%` through its `wdth` axis, not a separate Narrow family

**Character:** One grotesk at two widths. Condensed, tracked caps give the ticket its official structure; the normal width in sentence case carries everything a person actually reads.

The root size is 15px, so every rem value in this file resolves against 15px. The panel and auth screens use the Operate scale below; the public landing adds a Persuade scale (hero, section, lead).

### Hierarchy
- **Display** (700, 4.4rem, line-height 1, condensed, tabular): the risk score on the coupon's stub; 3.4rem on narrow screens; 2.1rem on booklet stubs.
- **Headline** (700, 1.75rem, line-height 1.15, -0.01em, balanced, max 34ch): the email subject heading the open coupon (1.55rem below `sm`), and auth page titles at 1.6rem.
- **Title** (600, 0.95rem): the subject line on a booklet stub, truncated to one line.
- **Body** (400, 0.98rem, line-height 1.6, max 68ch): the analysis summary and recommendations. Field values sit at 0.92rem; metadata at 0.78–0.8rem.
- **Label** (650, 0.6–0.78rem, 0.1em tracking, uppercase, condensed): section headings inside the coupon (navy), field labels and tabs (mute), buttons (0.8rem).
- **Stamp** (750, 0.68rem at rest, 0.1em tracking, uppercase, condensed, line-height 1.1): all stamps; the verdict stamp scales to 2.7rem (1.85rem for the longer LEGÍTIMO label), the void stamp to 1.3rem.
- **Figure** (700, 1.45rem, condensed, tabular): the 30-day totals on the navy bar. Step numbers on the landing and the `0–100` capability figure are condensed carbon figures at 2.1rem.

### Persuade scale (landing)
- **Hero** (700, 2.7rem, 4.2rem from `sm`, 4.9rem from `lg`; line-height 1.02, -0.025em, balanced, sentence case, max 16ch): the single landing h1.
- **Section** (700, 2rem, 2.6rem from `sm`; line-height 1.1, -0.015em, balanced, max 22ch): landing section h2s; the closing coupon's h2 stops at 2.4rem, max 18ch.
- **Lead** (400, line-height 1.6, Mute): the hero sentence at 1.1rem / 1.2rem from `sm` (max 52ch); section intros at 1.05rem (max 58ch).
- **Step title** (700, 1.35rem, 1.6rem from `sm`, line-height tight): the four Recorrido steps. Carbon-copy and original card titles sit at 1.25rem; FAQ questions at 1.08rem semibold.
- **Large address** (600, carbon, 1.2rem, 1.4rem from `sm`): the report address in the large copy field; 0.95rem in the normal field.
- **Showcase stamp**: verdict stamps in the landing's verdict list scale to 1.05rem / 1.2rem with a 3px frame.

### Named Rules
**The Tab Caps Rule.** Condensed tracked caps (0.1em) only on headings, tabs, field labels, buttons and stamps. Subjects, summaries, recommendations and error messages are always sentence case.

**The One Family Rule.** Width, not a second typeface, separates structure from content.

**The Sentence-Case Headline Rule.** Persuade headlines (hero, section, step titles) are bold normal-width Archivo in sentence case with negative tracking; condensed caps stay on labels, tabs, buttons and stamps even on the landing.

## Layout

The page is a navy bar (min 3.5rem) over a ground with 1.25rem to 1.5rem gutters. From `lg` (1024px) the panel is a two-column grid: the booklet at `minmax(22rem, 27rem)` and the open coupon filling the rest, 1.5rem apart, aligned to the top. The open coupon is itself a three-track grid: content, a 2px perforation, and a 15rem stub holding the risk, coupon number and journey.

Below `lg`, booklet and coupon take turns: without an explicit selection the booklet shows; with one, the coupon shows full width under a "Volver al talonario" link, its risk and number move above the fields, and the stub drops beneath the content behind a horizontal perforation. The three-field row stacks below `sm`. On the navy bar below `md`, the totals wrap to their own full-width row under a navy rule.

Auth screens reuse the same coupon: a single coupon (max 56rem) centered on the ground, a form column, a vertical perforation, and a 21rem stub (wide enough to set the report address on one line) with the reporting address; below `md` the stub drops under a horizontal perforation.

The public landing is a single column in a 72rem (`max-w-6xl`) container with 1rem / 1.5rem side padding under a sticky 3.5rem navy header (wordmark, three section links from `md`, theme toggle, "Iniciar sesión" from `sm`, framed "Crear cuenta"). Sections breathe at 5rem / 7rem vertical padding, alternate sections are separated by a hairline rule, and anchors scroll with a 5rem offset. The hero (4rem / 6rem top) stacks headline, lead, the large copy field (max 36rem) with a secondary link, then the example coupon full width, clipped at 30rem / 34rem by a horizontal perforation and set `inert`. The Recorrido story is a two-track grid from `lg` (steps, then a 20rem sticky stub 6rem from the top, 4rem apart; each step at least 19rem tall); below `lg` the stub becomes a strip pinned just under the header. Verdicts sit in one coupon as rows (17rem stamp column, then the explanation); capabilities fill a 1 / 2 / 3-column hairline grid inside a coupon; the closing coupon repeats the auth geometry (content, 2px perforation, 22rem stub).

Spacing moves in quarter-rem steps: 0.5rem between stubs, 0.75rem inside stubs and between buttons, 1.25rem page padding, 1.75rem between coupon sections, 2rem coupon padding at `lg`. Reading measures are capped (34ch headline, 68ch prose, 78ch indicators).

**The One Coupon Rule.** Only one coupon is open at a time; the next is a keystroke away (J/K), never a second panel.

## Elevation & Depth

Flat. There are no shadows, glows or gradients in the build, except inside the brand isotype. Depth is tonal and linear: coupon stock (#fbfaf6) sits on the cooler grey ground (#e8eaef), edged in 1px hairlines. The active stub is distinguished by a navy 1px border plus a 1px navy outline and a white fill, not by lift. The only relief in the system is the stamp's -3° rotation and the perforation notches, which take the ground color so they read as punched holes.

### Named Rules
**The Flat Paper Rule.** Printed paper doesn't glow. No box-shadows, no gradients except the perforation's dash pattern and the brand isotype's own fills, no blur except mid-animation on a landing stamp.

## Shapes

Corners are square everywhere (0px): buttons, inputs, coupons, stubs, key caps, stamps. The only curves are the perforation notches, 18px circles that bite into the top and bottom edges of the coupon's vertical perforation, and the critical notch, a 20px red triangle clipped into a stub's top-right corner.

Perforations are 2px dash patterns in Hairline (10px period, 55% dash), vertical between coupon and stub, horizontal above the action area and on narrow screens. Borders are 1px hairline on surfaces, 2px on buttons and stamps, 3px on the void stamp, 4px on the verdict stamp. Journey markers are 9px squares (analyzer events), 9px diamonds (analyst events) and a dashed hollow square (pending report). Indicator bullets are 6px navy squares.

On the auth screens (login, registro, activar) and in the landing hero ground, mail routes run in from the page edges toward the coupon: orthogonal 1px Hairline paths with 5px square Hairline nodes at each turn, kept in the margins. A short pulse (8% of the route, 1.5px, Carrier Navy or Carbon Purple at 55%) travels each route every 9–14s on staggered delays, like a forwarded email on its way to the analyzer. Dash offset only, never on the panel, never red. In the landing hero the layer sits behind the content; below `sm` it starts 34rem down, under the address field, so routes only frame the example coupon and never cross the headline or the field. Reduced motion keeps the routes and removes the pulse.

The brand isotype is the one shape that keeps rounded corners and round line caps; see the Brand Asset Exception.

**The No Side-Stripe Rule.** No colored left or right border strips on stubs, rows or alerts. Emphasis comes from a full border, the corner notch, or a stamp.

## Components

### Buttons
Tactile ticket-office controls: square, condensed caps, a 2px frame.
- **Shape:** square corners (0px), 2px border, height 2.5rem (2rem small, 2.75rem large), 0.8rem tracked condensed caps.
- **Primary:** navy fill, white text; hover Night Navy. Used for the main analyst stamp action ("Timbrar dominio bloqueado") and auth submit.
- **Outline:** 2px navy frame, navy text; hover fills navy with white text. Secondary analyst actions.
- **Ghost:** navy text, no frame; hover #e3e6ee fill. Cancel.
- **Destructive:** 2px Jet Red frame, red text; hover fills red. The first step ("Anular análisis").
- **Destructive solid:** red fill, white text; hover #8f1820. Only the confirmation step ("Confirmar anulación").
- **Focus / Active / Disabled:** 2px navy outline offset 2px; pressed nudges down 1px; disabled at 55% opacity. Transitions run 150ms ease-out on color, border and transform.
- **Icon buttons:** square, 2px frame, inline SVG icon at 14–16px. The booklet refresh control is a 2rem navy-framed square that fills navy on hover, with its icon spinning while it works (still under reduced motion) and a progress cursor when disabled. The theme toggle is a 2.25rem square framed in Shell Border on the navy bar, white on hover, moon in light and sun in dark, `aria-pressed`, white focus outline.
- **Cursor:** every clickable shows a pointer: buttons, `role="button"`, `summary`, `select`, `label[for]`, checkboxes, radios and submits, unless disabled.

### Inputs / Fields
- **Style:** white fill (brighter than stock), 1px hairline border, square, 2.5rem tall, ink text, mute placeholder, carbon caret. Textareas match at min 4rem and resize vertically.
- **Label:** tracked condensed caps, 0.72rem, Mute, above the field with 0.5rem gap.
- **Focus:** border and a 2px outline (no offset) both turn navy.
- **Error / Disabled:** `aria-invalid` turns the border Jet Red with a sentence-case red message in a live region below; disabled at 55% opacity.
- **New password:** the field carries a show/hide eye button inside its right edge (`aria-pressed`). Below it, a meter of four square 0.25rem segments 0.25rem apart (unlit in Hairline) lights red for "Muy débil" / "Débil", amber for "Media" / "Buena", green for "Fuerte", with the level always written out in condensed caps beside it. A live checklist (one or two columns) marks each rule with a check in green or a cross in Mute, and tells screen readers "cumplido" or "falta".

### Copy Field (CopiarCorreo)
The report address set as a ticket field: Coupon Stock fill, the address in semibold carbon breaking only after the @, and a Copiar button at its right edge that wraps below rather than splitting the address. Normal: 1px Hairline frame, 0.95rem address, small outline button (auth stubs, booklet empty state). Large (`grande`): 2px navy frame, 1.2rem / 1.4rem address, large primary button (landing hero and closing coupon). On copy the label becomes "Copiado" with a check for 2s and a polite live region announces it; if the clipboard is blocked the address is selected and the note tells the person to press Ctrl/Cmd+C.

### Navigation
- **Top bar:** navy, white wordmark in condensed extrabold caps, one primary tab in white condensed caps with a 3px underline when current, a thin navy-rule divider, then the 30-day totals as Carbon Rule figures over Bar Ink caps legends. The user block and a 2px-framed "Cerrar sesión" button sit at the far end; the frame turns white on hover.
- **Booklet tabs:** condensed caps at 0.75rem with a carbon count; the active tab gets a 2px navy underline and navy text, inactive tabs are Mute and turn navy on hover.
- **Wordmark:** the isotype at 1.75rem beside "PhishGuard" in white condensed extrabold caps (1.15rem, 0.04em), with "AI" in Carbon Rule.
- **Landing header:** the same navy shell; section links in Bar Ink condensed caps (0.74rem) that turn white on hover.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** Coupon Stock for the analyst; Carbon Copy with Carbon Rule hairlines for the employee view of the same coupon.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px Hairline (Carbon Rule on the copy).
- **Internal Padding:** 1.25rem, 1.75rem from `sm`, 2rem from `lg`; sections inside are 1.75rem apart.

### Stamp (signature)
The state carrier. An inline block with a 2px border in its own ink, condensed 750-weight caps with 0.1em tracking, rotated -3°. Tones: danger (Jet Red), alert (Amber), safe (Green), neutral (Slate), ink (Navy). Line forms: solid (done, e.g. INFORME ENVIADO), dashed (pending, INFORME PENDIENTE), struck through with a 2px line (failed or voided, e.g. ENVÍO FALLIDO, a voided PHISHING). Analyst actions always render as navy ink stamps; only ANULADO is red. A newly landed stamp animates once (`stamp-in`, 420ms, cubic-bezier(0.16, 1, 0.3, 1)): it drops from -9° at 155% scale with a 2px blur and settles at -3°. Reduced motion removes it.

### Booklet Stub (signature)
A fixed-shape stub in a vertical list (0.5rem apart): left, the reporter and elapsed time in Mute, the subject as a one-line title, and a row of small stamps (verdict, CRÍTICA, latest analyst stamp or ANULADO); then a vertical perforation; then a 5rem column with the risk as a 2.1rem carbon figure over a RIESGO label. Hover darkens the border to #9aa2b4. Critical, non-voided stubs carry the red corner notch. Voided stubs drop to 75% opacity. For analysts, the stamp row ends with the ATT&CK technique code (e.g. T1598): a semibold carbon figure at 0.72rem in a 1px Hairline frame, not rotated, so it reads as a printed field rather than a stamp. Above the list, the refresh control reports "Revisado a las" with a carbon time, or "N reportes nuevos" in navy, in a polite live region.

### ATT&CK Technique (coupon section)
An analyst-only coupon section headed "Técnica MITRE ATT&CK": the technique code as a 1.3rem bold carbon link to MITRE (new tab, announced), its name in semibold ink and description in Mute on one wrapping line, the analyzer's evidence as body text, and a Mute disclaimer that it is an automated assessment, not a forensic confirmation. Without a technique the section says so in Mute.

### Technique Chart
A single-series horizontal bar chart of technique counts inside a coupon, built as a real table (caption and header row for screen readers). One hue: square-ended 0.625rem Carbon Purple bars scaled to the largest count; no legend, no axis, no gridlines; hairline rules between rows. Each row heads with the carbon code linking to MITRE and a Mute description; the count sits beside the bar in tabular numerals, and hover dims the bar to 80% and shows the share of tagged analyses. Untagged analyses are counted in a footnote under a hairline.

### Recorrido Story Stub (landing)
The landing's signature: four numbered steps (carbon 2.1rem condensed numerals, step titles, Mute text) beside a sticky 20rem coupon stub headed "Recorrido" with a carbon coupon number. Its journey uses the Coupon Journey vocabulary: 9px navy squares for done steps, a 9px navy diamond for the analyst step (rendered as a navy stamp), dashed hollow squares and 45% opacity with "Pendiente" for steps not yet reached. As each step crosses the middle of the viewport the next marker fills and its row lands with `timbre-in`; inactive steps dim (numeral 35%, title 55%) over 300ms from `lg`. Below `lg` the stub becomes a sticky strip under the header: "Recorrido" caps, the four markers, and the current step's navy stamp. The strip and stub are decorative mirrors (`aria-hidden` strip); the steps carry the content.

### Coupon Journey (signature)
A vertical list on a 1px hairline spine. Analyzer events are bold ink text with a square marker; analyst events are navy stamps with a diamond marker; danger events take a red marker. Times are carbon. A missing report shows a dashed hollow marker with "Informe pendiente". A new analyst row lands with `timbre-in` (520ms, from -6° at 135% scale) and then sits straight.

## Do's and Don'ts

### Do:
- **Do** stamp every state change and keep the stamp in the coupon's journey; void with a struck-through stamp and a dashed red frame explaining who voided it and when.
- **Do** pair every stamp tone with its text and a line form: solid for done, dashed for pending, struck through for failed or void.
- **Do** render analyst actions as navy ink stamps and journey entries with diamond markers.
- **Do** set every figure in Carbon Purple (#4b3a7a) with tabular numerals, and use Carbon Rule (#cbbfe3) for figures on the navy bar.
- **Do** push destructive actions to the far end of the action row (auto margin plus 2.5rem of clear space) and require a second, solid-red confirmation step.
- **Do** separate a coupon from its stub with a 2px dashed perforation in Hairline, with ground-colored notches on the vertical one.
- **Do** use the carbon-copy coupon (#ebe5f5 ground, #cbbfe3 rules) for the employee's view of the same analysis.
- **Do** present the report address as a copy field (stock fill, carbon address, Copiar button), large with a 2px navy frame where it is the page's main action.
- **Do** write a meter's level in words beside its colored segments.
- **Do** give every clickable a pointer cursor.

### Don't:
- **Don't** use red outside danger, critical, void, destructive actions and errors.
- **Don't** use purple for prose; it belongs to figures and literal values.
- **Don't** add shadows, glows, gradients or rounded corners; the brand isotype is the only exception.
- **Don't** add colored side-stripe borders to stubs, rows or alerts.
- **Don't** let color alone carry a state.
- **Don't** use airline iconography (planes, globes, flight routes, airport codes, carrier logos): the world lends its system, not its subject. Orthogonal mail routes are mail, not flight paths, and stay off the panel.
- **Don't** build the generic SaaS dashboard (equal KPI cards plus chart plus table) or a dark SOC console; totals live in the navy bar.
- **Don't** give the dark theme its own look: no glows, neon or new hues; every role keeps its job (see the Night Shift Rule).
- **Don't** delete states from the interface; a mistaken analysis is stamped ANULADO, never removed.
