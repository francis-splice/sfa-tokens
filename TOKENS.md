# Spitfire PDP: Typography Token Work

A focused writeup of the design-token work on two Spitfire product pages: **Tenebra by The Newton Brothers** and **Mervyn Warren Choir**. For the broader project history (deploy, assets, palette, gotchas) see [SUMMARY.md](SUMMARY.md). This file is the tokens-only view: what the system is, how it was applied to each page, what to flag.

Both pages apply the same Spitfire typography token system. They differ in build method and in how far the rebrand goes: Tenebra is a full rebrand (type + color) built from a local capture; Mervyn is type-only (native colors kept) built CDN-backed.

## Source of truth

- `tokens/typography-tokens.json`: the type system data. All sizes, line-heights, letter-spacings, weights, and paragraph-spacings per direction.
- `tokens/typography.md`: the rules. Three directions, the per-section mapping for a product page, the hierarchy of levels.

Each page's `tokens.css` is **generated 1:1 from the JSON** (via the Python in the session transcript). Do not hand-edit the token values in `tokens.css`; change the JSON and regenerate. Hand edits are fine for the role mapping, composite classes, and utility remapping sections (those are not 1:1 from JSON).

## The three directions

| Direction | Family | Weight | Use |
| --- | --- | --- | --- |
| Neutral | GT Flaire Trial VF | Medium 550 / Regular 420 | Body, UI, nav, prices, most headings. The page default. |
| Expressive | GT Ultra Fine Trial | Light 300 | Narrative headings only (product statement, story headings). |
| Cinematic | GT Flaire Trial VF | Bold 700, UPPERCASE, 0.1em tracking | Short utility labels only ("What's Included", "FAQs", "Tech specs"). |

Levels run H0 to H6 plus body-1/2/3 and control-label.

## Per-element role classes (both pages)

Elements that need a non-default direction get a composite class: `.h1-expressive` on the product statement / overview headline, `.h2-expressive` on story headings, `.h2-cinematic` on the short utility labels ("What's Included", "FAQs", "Tech specs"), `.h5-neutral` on spec column heads. These are written as **doubled-class + `!important`** (`.h2-expressive.h2-expressive { ... !important }`, specificity 0,2,0) because the theme has selectors up to (0,3,0) that otherwise win.

Everything else is pinned via the **Neutral utility remapping**: rather than tag hundreds of elements, the theme's own utility type classes are remapped to Neutral token levels in `tokens.css`:

| Theme class | Neutral level | Size |
| --- | --- | --- |
| `u-heading-xl` | H0 | 60px |
| `u-heading-lg` | H2 | 36px |
| `u-heading-sm` | H5 | 20px |
| `u-heading-xs` | H6 | 16px |
| `c-rte` (prose) | Body 1 | 16px |
| `u-text-lg` | Body 1 | 16px |
| `u-text-sm` | Body 2 | 14px |
| `card-text` | Body 2 | 14px |
| `sub-text` | Body 3 | 12px |
| `audio-name` | Body 2 Emphasis | 14px |

These rules are single-class `!important` (0,1,0), so the (0,2,0) per-element composites still win where both apply.

---

## Tenebra (by The Newton Brothers)

`Tenebra New-Tokens/` is a full rebrand of the live Tenebra PDP: type **and** color. The live site uses Proxima Nova (Adobe Typekit); this rebrand swaps the whole page onto the GT trial families and pins every type level to the JSON. The faithful baseline (real Proxima Nova, no rebrand) lives in `Tenebra Original/` and is left alone.

**Build method:** local capture. Derived from a Chrome "Save Page As (Complete)" capture, with `tokens.css` linked last in `<head>`. Tenebra-specific extras applied to the capture: stripped stale CDN `srcset`, repointed the hero to the 2560x1280 cinemascope image, and a baked `mimic-waveforms` script that draws the audio waveforms (the live canvas is blank offline).

**Color (Tenebra only).** `tokens.css` overrides the theme's `:root` color custom properties (later source order wins). Current "sharper noir" values:

| Token | Value |
| --- | --- |
| `--colour-background` | `#070709` |
| `--colour-foreground` / `--colour-silver-chalice` (body text) | `#C6C6CB` |
| `--colour-highlighter` (accent) | `#FF3038` |
| `--colour-radical-red` | `#FF454F` |
| `--colour-mine-shaft` (surface grey) | `#1A1A1D` |

These five lines are the knobs to push the palette further.

**What was added:**
- `Tenebra New-Tokens/tokens.css`: the core deliverable. @font-face for the GT families, all JSON tokens as CSS custom properties, role mapping, 28 composite classes, the Neutral utility mapping, `.tabular-nums`, and the color overrides.
- `Tenebra New-Tokens/` self-hosted GT `.woff2` fonts (GT Flaire variable + GT Ultra Fine Light/Regular).
- `Tenebra New-Tokens/index.html`: deploy entry, a copy of the long-named capture HTML. Keep both in sync for any HTML edit.

**Deploy:** Vercel project `tenebra-new-tokens` (static, no build). Redeploy: `vercel deploy --cwd "Tenebra New-Tokens" --yes`.

**Tenebra-specific flags:**
- **Two HTML files must stay in sync.** `index.html` is a copy of the long-named capture HTML used as the Vercel entry. Any per-element class change has to land in both.
- **Fonts can't match the live site exactly.** Proxima Nova is Typekit-domain-locked and won't self-host, and the family we have is missing Light 300. New-Tokens is intentionally a GT rebrand, not a Proxima match. Proxima belongs to `Tenebra Original/` only; do not add it to New-Tokens.

---

## Mervyn Warren Choir

`Mervyn Warren Choir New-Tokens/` is a **type-only** application of the token system. The page keeps its **native color palette**; `tokens.css` here carries no color overrides (this is the deliberate difference from Tenebra). Same three directions, same role classes, same Neutral utility remapping.

**Build method:** CDN-backed (leaner than Tenebra's local capture, no `_files` folder, no Original baseline). `index.html` is the live page's server-rendered HTML (`curl`) with every asset URL absolute-ized to `https://www.spitfireaudio.com` / `https://cdn.shopify.com`: protocol-relative `//...` and root-relative `/en-us`, `/cdn`, `/checkout(s)`, `/pages` references all rewritten to `https://`. The local `tokens.css` is linked last in `<head>`, role classes added, cookie loader stripped.

Because the assets stream from Shopify's CDN over https (verified `access-control-allow-origin: *`), the **real audio player, waveforms, and Swiper carousel all work** on the deployed page. No `mimic-waveforms` hack is needed (that was a Tenebra-only workaround for the offline capture).

Role classes applied: overview headline to `h1-expressive`; "What's Included" / "FAQs" / "Tech specs" to `h2-cinematic`; spec column heads to `h5-neutral`; everything else Neutral via the utility remaps.

**What was added:**
- `Mervyn Warren Choir New-Tokens/tokens.css`: the type-only variant (GT @font-face, JSON tokens, role mapping, composite classes, Neutral utility mapping, `.tabular-nums`). No color block.
- `Mervyn Warren Choir New-Tokens/` self-hosted GT `.woff2` fonts (the same three).
- `Mervyn Warren Choir New-Tokens/index.html`: the CDN-backed live HTML. Single file (no two-file sync issue).

**Deploy:** Vercel project `mervyn-warren-choir-new-tokens` (static, no build), production with stable alias `mervyn-warren-choir-new-tokens.vercel.app`. Redeploy: `vercel deploy --cwd "Mervyn Warren Choir New-Tokens" --prod --yes`.

**Mervyn-specific flags:**
- **Requires network; not archival.** Because it streams assets from the Spitfire CDN, the page is pixel-exact with the live site but will drift if Spitfire changes their CDN, and it does not work offline. Tenebra's local capture is the archival counterpart. Localizing a `_files` folder is the path to archival exactness if ever needed.
- **Type tokens only, native colors kept.** Intentional. If a color rebrand is wanted later, add a color-override block to this `tokens.css` the way Tenebra does.

---

## Things to flag (both pages)

- **GT fonts are trial.** Self-hosted trial families. Not licensed for production; fine for this design exploration.
- **Body size ceiling.** The Neutral token set has no body level above 16px, so `u-text-lg` and `c-rte` (18 to 20px on the live site) shrink to Body 1 (16px). If those passages should stay larger, they'd need to become Expressive headings instead. Open decision.
- **UI chrome is not pinned.** Nav links, buttons, search, form controls, and the cart keep their theme-driven sizing; only the Neutral font family flows through. Deliberate, to avoid breaking the header. A Cinematic Control Label treatment for UI labels would be a separate pass.
- **Regenerate, don't hand-edit token values.** Editing numbers directly in `tokens.css` will drift from `typography-tokens.json`. Change the JSON and regenerate.
- **Verify with computed styles, not screenshots.** The theme hijacks scroll and headless captures distort the vh-based hero. Serve over `http://localhost` and read `getComputedStyle` (file:// is blocked in the browser tool).
