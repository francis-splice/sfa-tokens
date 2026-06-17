# Typography

> The Spitfire Audio type system: two brand styles (Cinematic and Expressive) blended over a Neutral UI workhorse, the scales behind them, and how to apply them in code and Figma.

**Type:** Foundation
**Status:** Draft, derived from the Brand Sprint Jam File
**Tokens:** [`spitfire-typography.json`](./spitfire-typography.json)

## Overview

Spitfire's type system blends two brand styles over a neutral base. **Cinematic** carries the scale and weight of the brand, the large, tracked-out, uppercase treatments that set tone. **Expressive** leans into the human and compositional side, the refined, lighter display style used for editorial and considered layouts. **Neutral** is the workhorse beneath both, a quiet sans that does the everyday job of headings, body and UI.

The three directions share an aligned scale, tuned so the same level reads at the same optical size across them. Cinematic is set in smaller px on purpose - all-caps blocking appears optically larger, so a Cinematic H4 balances a Neutral or Expressive H4. Work in levels, not px: choose a step by the level you want and trust it to read consistently across directions; never reach for px to judge size or contrast. See [Hierarchy](#hierarchy).

A practical rule sits underneath all of this: each direction has a defined job, so picking one is a lookup, not a matter of taste (see [Choosing A Heading Direction](#choosing-a-heading-direction)). Expressive is the narrative voice, the headings that open and lead passages of body copy. Cinematic is for short, tracked-out functional labels. Neutral is the default for body, UI, and any heading the other two do not claim. Keep Cinematic to short labels, never long phrases.

> Confidence note: the serif referenced above is taken to be the Expressive face (GT Ultra Fine Trial), since Neutral and Cinematic both use the sans GT Flaire. Worth confirming which family the "serif" guidance is actually pointing at before this is treated as settled.

## The Three Directions

**Cinematic** - GT Flaire Trial VF, Bold (700), uppercase, wide 10% tracking. Expresses brand scale. Headings only, no body styles. Largest step is H1 (no H0), and it adds an H7 and a Control Label for small tracked-out labels. This should never be used in italic or slanted type. Use it for short functional headings and labels - section labels, controls, eyebrows - of about three words or fewer; avoid it on longer phrases, where uppercase tracking hurts readability. The Control Label is the smallest step, reserved for UI control text and plugin labels, not for section headings or editorial credits.

**Expressive** - GT Ultra Fine Trial, Light (300), title case, tight tracking. Leans into human and compositional elements. Heading styles only (H0 to H6), no body styles. It is the voice for narrative and editorial headings: the product statement, the artist/studio story, and any section heading that opens a passage of body copy.

**Neutral** - GT Flaire Trial VF, Medium (550) for headings, Regular (420) and Medium for body. Title case. The full functional scale, H0 to H6 plus three body sizes with emphasis variants. It is also the fallback for any functional heading that is too long or too small for a Cinematic label.

## Where Each Direction Is Used

| Surface | Cinematic | Expressive | Neutral |
| ----------------------- | :-------: | :--------: | :-----: |
| INSTRUMENT              | yes       |            |         |
| spitfireaudio.com       | yes       | yes        | yes     |
| Spitfire Audio plugins  | yes       |            | yes     |

INSTRUMENT is listed for the Cinematic brand layer only. It is a multi-brand surface, so its base UI type may come from another design system rather than Neutral. Confirm whether Neutral should also be the UI base there before wiring up.

## Choosing A Heading Direction

Resolve a heading's direction by the kind of section it sits in, in this order, so the same heading always resolves the same way:

1. **Narrative / story section** - free-form prose about the product, the people or the making-of (the overview statement, artist and studio stories). Its heading is **Expressive**.
2. **Utility module** - a standardised functional block: contents / "what's included", tech specs, system requirements, FAQs, audio demos, downloads. Its heading is a label: **Cinematic** if short (about three words or fewer, one line), **Neutral** if it runs longer or is a sub-heading inside the module. A short supporting line under a module label (for example an intro sentence beneath "What's included") does not reclassify it as narrative.
3. **Everything else** - body, captions, nav, buttons, prices - is **Neutral**, with the Cinematic Control Label reserved for the smallest tracked labels.

Worked mapping for a product page:

| Heading | Section type | Direction |
| ------- | ------------ | --------- |
| Product statement / overview headline | Narrative | Expressive |
| Artist, collaborator or studio story headings | Narrative | Expressive |
| Quote | Quote | Expressive body + Cinematic credit (see Quotes) |
| "What's included", "Tech specs", "FAQs" | Utility module, short label | Cinematic |
| "Listen to Mervyn Warren Choir" | Utility module, long label | Neutral (or shorten to "Listen", then Cinematic) |
| Technique groups, spec column heads | Utility module, sub-heading | Neutral |
| Nav, buttons, prices, body, captions | UI / body | Neutral |

## Hierarchy

Direction sets the voice; level sets the size. Because the scale is optically aligned (see Overview), build hierarchy by stepping levels, never by px:

- **Subheadings step down a level.** A subheading is at least one level below the heading it sits under, never the same level. A Cinematic H4 section heading takes Neutral / Expressive H5 (or smaller) subheads. Two headings at the same level read as the same optical size even across directions, which flattens hierarchy and creates tension. (Right: "Tech specs" H4, then "macOS requirements" H5. Wrong: "What's included" H4, then a subhead also at H4.)
- **Narrative leads.** The product / overview statement is the page's lead heading; functional section labels (Listen, What's included, Tech specs) sit at least one level below it, so a utility heading never matches or out-ranks the narrative one.
- **Weight is separate from level.** Expressive Light reads lighter than Neutral Medium or Cinematic Bold at the same level. When a lighter narrative heading must lead a heavier functional one, give it a higher level, don't rely on size alone.

## Type Scale Reference

Sizes are shown in px with the rem token value in brackets. Line height is shown in px with the unitless ratio in brackets. Tracking is shown in em with the source percentage in brackets.

### Neutral

| Style | Size | Line height | Weight | Tracking | Case |
| ----- | ---- | ----------- | ------ | -------- | ---- |
| H0 | 60px (3.75rem) | 60px (1.0) | 550 | -0.025em (-2.5%) | Title case |
| H1 | 48px (3rem) | 60px (1.25) | 550 | -0.02em (-2%) | Title case |
| H2 | 36px (2.25rem) | 44px (1.222) | 550 | -0.02em (-2%) | Title case |
| H3 | 32px (2rem) | 40px (1.25) | 550 | -0.015em (-1.5%) | Title case |
| H4 | 26px (1.625rem) | 32px (1.231) | 550 | -0.015em (-1.5%) | Title case |
| H5 | 20px (1.25rem) | 25px (1.25) | 550 | -0.005em (-0.5%) | Title case |
| H6 | 16px (1rem) | 20px (1.25) | 550 | 0 | Title case |
| Body 1 | 16px (1rem) | 20px (1.25) | 420 | 0 | Sentence case |
| Body 1 Emphasis | 16px (1rem) | 20px (1.25) | 550 | 0 | Sentence case |
| Body 2 | 14px (0.875rem) | 18px (1.286) | 420 | 0 | Sentence case |
| Body 2 Emphasis | 14px (0.875rem) | 18px (1.286) | 550 | 0 | Sentence case |
| Body 3 | 12px (0.75rem) | 16px (1.333) | 420 | 0 | Sentence case |
| Body 3 Emphasis | 12px (0.75rem) | 16px (1.333) | 550 | 0 | Sentence case |

### Expressive

| Style | Size | Line height | Weight | Tracking | Case |
| ----- | ---- | ----------- | ------ | -------- | ---- |
| H0 | 60px (3.75rem) | 60px (1.0) | 300 | -0.01em (-1%) | Title case |
| H1 | 48px (3rem) | 52px (1.083) | 300 | -0.01em (-1%) | Title case |
| H2 | 36px (2.25rem) | 40px (1.111) | 300 | -0.01em (-1%) | Title case |
| H3 | 32px (2rem) | 36px (1.125) | 300 | -0.01em (-1%) | Title case |
| H4 | 26px (1.625rem) | 30px (1.154) | 300 | -0.005em (-0.5%) | Title case |
| H5 | 20px (1.25rem) | 24px (1.2) | 300 | -0.005em (-0.5%) | Title case |
| H6 | 18px (1.125rem) | 22px (1.222) | 300 | 0 | Title case |

### Cinematic

| Style | Size | Line height | Weight | Tracking | Case |
| ----- | ---- | ----------- | ------ | -------- | ---- |
| H1 | 43px (2.6875rem) | 46px (1.070) | 700 | 0.1em (10%) | UPPERCASE |
| H2 | 32px (2rem) | 35px (1.094) | 700 | 0.1em (10%) | UPPERCASE |
| H3 | 29px (1.8125rem) | 32px (1.103) | 700 | 0.1em (10%) | UPPERCASE |
| H4 | 23px (1.4375rem) | 26px (1.130) | 700 | 0.1em (10%) | UPPERCASE |
| H5 | 18px (1.125rem) | 21px (1.167) | 700 | 0.1em (10%) | UPPERCASE |
| H6 | 16px (1rem) | 19px (1.188) | 700 | 0.1em (10%) | UPPERCASE |
| H7 | 15px (0.9375rem) | 17px (1.133) | 700 | 0.1em (10%) | UPPERCASE |
| Control Label | 12px (0.75rem) | 14px (1.167) | 550 | 0.16em (16%) | UPPERCASE |

## Casing Rules

Expressive and Neutral headings use **title case**. Cinematic is always **uppercase**, applied as a `text-transform` in the style rather than as cased content (see below).

Product names are always written in their canonical capitalisation, in every context. A product like LABS stays all-caps inside a title-case Neutral heading, and product names are never re-cased to fit a style. When a product name sits inside a Cinematic uppercase heading there is no visible change, but the markup should still carry the correct casing.

## Pairing

When a heading and body copy form a lockup, a related unit set together, pair them so the body sits a clear step below the heading in size. As a default, Body 1 pairs with H3, Body 2 with H4 and Body 3 with H5. This applies whether the heading is Neutral or Expressive. Treat the mappings as a sensible default rather than a fixed rule, and adjust where a specific lockup needs it.

## Numbers

Within UI and pricing, numbers always use tabular (lining) figures so columns align and figures do not shift width as values change. This is an OpenType feature on the brand font, not a separate monospace typeface. Apply it rather than switching face where the font supports it:

```scss
font-variant-numeric: tabular-nums;
font-feature-settings: 'tnum' 1;
```

This rule covers prices, counts, timers, data tables and any number that updates in place. It does not apply to expressive or display contexts where figures are part of a one-off composition.

## Quotes

Quotes default to an Expressive heading style, set with hanging punctuation and quote marks. The credit sits below the quote in a Cinematic style, one or two levels down from the quote (around H7 to H6), not the Control Label. The Control Label is a UI control style (see The Three Directions) - too small and not for editorial credits. This is the default treatment, not the only one, so vary the levels to suit the composition.

## Using The Styles In Code

Composite styles are SCSS mixins that compose the primitive tokens, mirroring the core `_type.scss` pattern. The primitives file holds size, family, weight, line height, tracking and, for body styles, paragraph spacing. The mixins assemble them, and this is also where casing lives. Body mixins additionally apply paragraph spacing as margin-block-end, with a last-child guard where paragraphs stack so the final one carries no trailing space.

```scss
.page-title {
  @include sfa.h1-cinematic; // includes text-transform: uppercase
}

.section-heading {
  @include sfa.h2-expressive; // title case, set in markup
}

.body-copy {
  @include sfa.body-1;
}
```

Cinematic mixins carry `text-transform: uppercase` directly, following the existing `h7` precedent in core. The Expressive and Neutral mixins set no transform, since title case is a content decision made in the markup.

## All-caps And Accessibility

Cinematic uppercase is applied with `text-transform: uppercase`, not by writing uppercase text into the content. This keeps the underlying markup correctly cased, so assistive technology reads it naturally and the casing can be changed in one place. It also means text-transform is a property of the composite style, not a token and not a Figma variable, since Figma cannot bind text case to a variable.

Avoid uppercase on long passages, it reduces reading speed. Keep Cinematic to short titles, labels and control text. Keep body copy at Body 2 (14px) or larger for sustained reading, and check colour contrast against WCAG AA at every size.

## Paragraph Spacing

Body styles carry a paragraph spacing value, the gap between stacked paragraphs. Body 1 and Body 2 use 16px (1rem), Body 3 uses 12px (0.75rem). It is stored in rem rather than em, see Behaviour Notes for the reasoning, and applied as `margin-block-end` in the body mixins. Headings carry no paragraph spacing, since spacing around headings is a layout concern handled outside the type system.

## Behaviour Notes

Tracking is stored in **em** because em is relative to font size, so it scales with the style and stays proportional across responsive and fluid sizes. A px value would hold constant and break the proportion at smaller sizes. Each style carries its own tracking value derived from its own source percentage, larger Neutral headings are tracked tighter, Cinematic holds a constant 10% spread.

Line height is stored as a **unitless ratio** so it scales with font size in the same way. The px equivalents in the table are recorded in each token's `comment` and every ratio rounds back to the source px exactly.

Paragraph spacing is the deliberate exception to this relative-unit approach. It is stored in rem, not em, because it is a fixed rhythm tied to the root rather than something that scales with each style's own font size. Body 1 and Body 2 differ in size but share the same 16px spacing, which a single em value relative to font size could not produce. Body 3 uses 12px. Unlike line height and tracking, it is applied as `margin-block-end`, so it behaves as layout spacing rather than a type property.

## Fonts And Licensing

| Direction | Family | Weights |
| --------- | ------ | ------- |
| Neutral | GT Flaire Trial VF | Regular 420, Medium 550 |
| Expressive | GT Ultra Fine Trial | Light 300 |
| Cinematic | GT Flaire Trial VF | Bold 700, Medium 550 |

Both families are trial versions. Swap them for licensed equivalents before any production use. The weight values are the real variable-font instances from Figma, preserved exactly rather than snapped to standard 400/500/700 steps.

## Figma Sync

The repo is the source of truth, Figma variables are a derived output. When these tokens become Figma variables, line height ratios map to Figma percentages as ratio multiplied by 100, and tracking percentages map directly. Text case does not sync, it lives on the Figma text style's Case property and the SCSS `text-transform`. Confirm the sync script's expected shape for line height and tracking before wiring it up, the current core line-height tokens should be checked for how they round-trip.

## Do And Don't

Do lead with Neutral for product and UI surfaces, and bring in Cinematic and Expressive as brand moments. Do use Expressive for the narrative and story headings that lead body copy, and keep Cinematic to short functional labels. Do use tabular figures for any number in UI or pricing. Do preserve product-name capitalisation everywhere.

Don't use Cinematic for body copy or long strings. Don't push a long heading or sentence into Cinematic uppercase, shorten the label or use Neutral. Don't choose a heading's direction by feel, resolve it with Choosing A Heading Direction. Don't mix all three directions in a single small component, pick the one that fits the surface. Don't store uppercase text in markup to fake Cinematic. Don't convert tracking to px or line height to a fixed value, both are meant to scale.

## Source

Derived from the Spitfire Audio Brand Sprint Jam File, Neutral, Expressive and Cinematic frames. Extracted 2026-06-16. Values cross-checked against the Figma text styles.