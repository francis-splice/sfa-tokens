# SFA Tokens (Spitfire PDPs: Tenebra + Mervyn Warren Choir) — Living Summary

> Source of truth for design and product decisions in this repo. Maintained via the `update-doc` skill. When resuming a session, read this file first.

## Most recent change
2026-06-17: The Vercel team `francis-projects-16d9c0fb` is now **fair-use blocked** ("Your Team exceeded our fair use limits and has been blocked") — deploys are refused and all sites return 402. Added crawler-protection files to the hub (`robots.txt`, `vercel.json` X-Robots-Tag, meta robots) but they are STAGED ONLY, not live (the redeploy was blocked). Earlier the same day: consolidated to the single `sfa-tokens` hub and retired the two standalone token projects. To actually restore a working hub, host the static files off Vercel (Cloudflare Pages / GitHub Pages) or move to a paid/work account; the free Hobby tier likely flagged this as commercial use.

## Live URLs
### Entry hub (canonical, single deploy)
- Production: https://sfa-tokens.vercel.app (also https://sfa-tokens-iah35vpen-francis-projects-16d9c0fb.vercel.app)
- Tenebra tokens page: https://sfa-tokens.vercel.app/Tenebra%20New-Tokens/index.html
- Mervyn tokens page: https://sfa-tokens.vercel.app/Mervyn%20Warren%20Choir%20New-Tokens/index.html
- Vercel project: `sfa-tokens` under scope `francis-projects-16d9c0fb`. Redeploy: `vercel deploy --prod --cwd /Users/gestalt/DEV/sfa-tokens`. A root `.vercelignore` keeps the upload lean (excludes `Tenebra Original/`, `Proxima Nova/`, `tokens/`, `fonts/`).
### Retired (do not use)
- `tenebra-new-tokens` and `mervyn-warren-choir-new-tokens` projects + their `.vercel.app` aliases are removed (consolidated into the hub). Their per-project preview/prod URLs are dead; use the hub sub-paths above. The local `.vercel/` link dirs in those folders are stale.
### Source live pages
- Tenebra: https://www.spitfireaudio.com/products/tenebra-by-the-newton-brothers
- Mervyn Warren Choir: https://www.spitfireaudio.com/en-us/products/mervyn-warren-choir

## Project shape
- `index.html` (project root) — visual entry hub. Dark cinematic Spitfire styling, self-hosts the GT fonts from `Tenebra New-Tokens/`. 2x2 card grid grouped by product (Tenebra, Mervyn); each product has an Original card (links to the live Spitfire site, new tab) and a Tokens card (links the local rebrand). Variant encoded by tag color: silver outline = Original, red fill = Tokens. Footer links `TOKENS.md` + `SUMMARY.md`. Card thumbnails load from the Spitfire CDN. `.vercelignore` controls what deploys with it.
- `robots.txt` + `vercel.json` (project root) — crawler protection for the hub deploy. `robots.txt` disallows all agents; `vercel.json` adds an `X-Robots-Tag` noindex header on every path. Staged; live on the next successful deploy.
- `Tenebra Original/` — faithful offline replica of the live PDP. Self-hosts real Proxima Nova (`proxima.css` + `ProximaNova-*.otf`). The baseline / reference. (Built but no longer linked from the hub: the Tenebra Original card points to the live site instead.)
- `Tenebra New-Tokens/` — the token rebrand. `tokens.css` (generated from the JSON) + self-hosted GT fonts. `index.html` is the deploy entry (copy of the long-named HTML; keep both in sync for HTML edits).
- `Mervyn Warren Choir New-Tokens/` — second tokenized PDP. **CDN-backed** (not a Chrome capture): `index.html` is the live page's server-rendered HTML with all asset URLs absolute-ized to `https://www.spitfireaudio.com`, so theme CSS/JS/images/audio load from Shopify's CDN over https (real audio + waveforms + carousel work). Local files are only `tokens.css` (type-only, no color overrides) + the 3 GT fonts. No `_files` folder, no Original baseline.
- `tokens/` — `typography-tokens.json` (the type system, source of truth) + `typography.md` (rules: three directions, per-section mapping, hierarchy).
- `fonts/` — GT Flaire (variable) + GT Ultra Fine (Light/Regular) trial fonts.
- `Proxima Nova/` — user-supplied OTF family (no Light 300); sourced into Original's `proxima.css`.

## Audience and tone
The user is a designer at Spitfire Audio. This is first-party design work on Spitfire's own product page, so no third-party copyright concern when deploying or sharing.

## Design decisions, newest first

### Typography
- **2026-06-16**: Tuned the sub-level pins: instrument-group labels moved from Neutral H6 to H5 (20px) so they read clearly above 16px body; spec column heads stay H5. (8 elements now H5.)
- **2026-06-16** — Pinned explicit Neutral sub-levels in New-Tokens: spec column heads (`macOS requirements`, etc.) to Neutral H5, instrument-group labels (`Synths:`, etc.) to Neutral H6 (deliberate step-down). Completes the hierarchy on the token scale.
- **2026-06-16** — Whole page pinned to the Neutral scale by remapping the theme's utility type classes (`u-heading-xl/lg/sm/xs`, `c-rte`, `u-text-lg/sm`, `card-text`, `sub-text`, `audio-name`) to JSON token levels in `[tokens.css](Tenebra New-Tokens/tokens.css)`. Single-class `!important` so the per-element composites still win.
- **2026-06-16** — Applied the type system per-element per `tokens/typography.md`: product statement + story headings to Expressive (GT Ultra Fine), short utility labels ("What's Included", "FAQs", "Tech specs") to Cinematic (GT Flaire 700 uppercase). Composite classes use doubled-class + `!important` to beat theme specificity.
- **2026-06-16** — `tokens.css` is generated 1:1 from `[typography-tokens.json](tokens/typography-tokens.json)` (all size/line-height/letter-spacing/weight/paragraph-spacing tokens, `@font-face`, role mapping, composite classes, `.tabular-nums`). Regenerate rather than hand-edit token values.
- **2026-06-16** — Font roles: New-Tokens uses GT (Neutral = GT Flaire for body/UI/nav; Expressive = GT Ultra Fine; Cinematic = GT Flaire bold/uppercase). Original uses real Proxima Nova. Proxima is for Original ONLY; do not add it to New-Tokens.

### Color
- **2026-06-16**: Pushed the palette deeper (still sharper-noir): bg #0A0A0C to #070709, body text #B8B8BD to #C6C6CB, accent #FF2A2E to #FF3038, radical-red #FF3A45 to #FF454F, and surface grey `--colour-mine-shaft` #232323 to #1A1A1D so the header relates to the deeper black.
- **2026-06-16** — "Sharper noir" palette in New-Tokens (`tokens.css`): `--colour-background` #06060E to #0A0A0C, `--colour-silver-chalice` (body text) #a7a7a7 to #B8B8BD, `--colour-highlighter` (accent) #FF181C to #FF2A2E, `--colour-radical-red` to #FF3A45. Header grey (`--colour-mine-shaft` #232323) left unchanged. Subtle, on-brand refinement; the 4 lines are the knobs to push further.

### Assets
- **2026-06-16**: Upgraded waveforms from procedural to exact per-track peaks: sampled the live canvas (base-36, 1 char/bar), baked a name-keyed table into the `mimic-waveforms` script, resampled to live density, procedural fallback for unknown tracks.
- **2026-06-16** — Mimicked the live audio waveforms (live uses a canvas `<audio-demo>` web component, blank offline) with a baked inline `<script id="mimic-waveforms">` that procedurally draws white bars (seeded per track) on each `.waveplayer-waveform-container canvas`. In both copies.
- **2026-06-16** — Fixed the hero: it had fallen back to a 400x400 square; downloaded `smc0776_cinemascope_press.jpg` (2560x1280, 2:1) from the CDN into both copies and repointed the hero `<img>`.

### Structural
- **2026-06-16** — **Mervyn Warren Choir tokenization (CDN-backed pattern).** New, leaner alternative to the Tenebra folder-capture: take the page's server-rendered HTML (`curl`), absolute-ize every protocol-relative `//www.spitfireaudio.com` / `//cdn.shopify.com` / `//widget.trustpilot.com` and root-relative `/en-us`,`/cdn`,`/checkout(s)`,`/pages` URL to `https://`, link a local type-only `tokens.css` last in `<head>`, add per-element role classes, strip the cookie loader. Assets stream from Shopify CDN (verified `access-control-allow-origin: *`) so on https the real audio player + waveforms + Swiper carousel work — the Tenebra `mimic-waveforms` hack is unnecessary here. Role classes applied: overview headline → `h1-expressive`; `What's Included`/`FAQs`/`Tech specs` → `h2-cinematic`; spec column heads → `h5-neutral`; everything else Neutral via the utility remaps. Color: type tokens only, MWC keeps its native palette.
- **2026-06-16** — Stripped the CookieScript GDPR banner from New-Tokens only (3 pieces: CDN loader IIFE, local `8360005…js` bundle ref, `cookiescriptstyles` block). Left the defensive hide-style for Shopify's native banner. `Tenebra Original/` keeps its cookie UI intact to stay a faithful baseline of the live site.
- **2026-06-16** — Two parallel folders: `Tenebra Original/` (real site, Proxima) and `Tenebra New-Tokens/` (GT rebrand). Original stays the baseline.
- **2026-06-16** — Local copies derive from a Chrome "Save Page As (Complete)" capture, not a single-file inline (see Rejected directions).

### Deploy
- **2026-06-17**: Added crawler protection to the hub: `robots.txt` (Disallow all), `vercel.json` sending `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex` on all paths, and a `<meta name="robots">` on `index.html`. These deter compliant crawlers and de-list from search (reducing discovery), but do NOT stop bots that ignore robots.txt; the hard block for those is Vercel Deployment Protection (Vercel Authentication, owner-only on Hobby) or BotID/WAF. STAGED ONLY: the redeploy to publish them was refused because the team is fair-use blocked. They go live on the next successful deploy (after the block clears / upgrade / off-Vercel host).
- **2026-06-17**: Consolidated to one Vercel project. The free team (`francis-projects-16d9c0fb`) exceeded its Edge Request cap (1M/period) and every deploy returned 402, mostly from crawler traffic on public preview URLs. Decision: retire the two redundant standalone token projects (the `sfa-tokens` hub already serves both pages at sub-paths) and keep the 5 older prototypes. Deletion run by the user (`vercel project rm <name>`); a permanent action left to them. Note: consolidating stops further accrual but does not un-pause the survivors mid-period; service resumes when the usage window resets or on upgrade. Follow-up: enable Deployment Protection (Vercel Authentication) on kept projects to block bot traffic.
- **2026-06-16**: Built the entry hub (`index.html`, project root) and deployed it to Vercel as project `sfa-tokens` (production, stable alias `sfa-tokens.vercel.app`). The hub deploy also serves the two Tokens folders (linked relatively), so their pages resolve from the same project. A root `.vercelignore` excludes the live-only / source dirs so the upload stays small. Decision: hub "Original" cards link to the live Spitfire pages (user's call), so the local `Tenebra Original/` replica is no longer linked from the hub.
- **2026-06-16** — Deployed Mervyn Warren Choir to Vercel as project `mervyn-warren-choir-new-tokens` (static, no build), production target with stable alias `mervyn-warren-choir-new-tokens.vercel.app`. Linked via `vercel link --project mervyn-warren-choir-new-tokens`. The `.vercel/` link dir lives in the folder.
- **2026-06-16** — Deployed New-Tokens to Vercel as project `tenebra-new-tokens` (static, no build). Added `index.html` as the root entry; linked with an explicit lowercase project name (folder name "Tenebra New-Tokens" is invalid as a Vercel project name).

## Open questions
- Nav / buttons / UI chrome were intentionally NOT resized to the token scale (only font family flows through) to avoid breaking the header. Revisit if a Cinematic Control Label treatment is wanted for UI labels.
- Vercel fair-use block (unresolved): the team is blocked, so deploys fail and sites 402. Paths to restore: (a) move the static hub to Cloudflare Pages / GitHub Pages (fastest, sidesteps the block since everything is static); (b) upgrade to Pro / move to a paid work account (the Hobby tier likely flagged this as commercial Spitfire work); (c) contact Vercel support to lift the block. Crawler-protection files are already staged for whenever a deploy succeeds. Enabling Deployment Protection / BotID is the durable fix against the bot traffic that caused this.

## Rejected directions
- **Monolith single-file for MWC** (2026-06-16). `monolith 2.10.1` on the live MWC URL ran clean (no panic — the older panic was on a *Chrome-saved capture's* edge assets, a different input) but produced a **209MB** file: it base64-inlines everything, dominated by the country switcher's **214 `icon-flag-*.jpg`** + assets recursively referenced from theme CSS/JS, and a single inlined file must fully download before render. Not viable. Decision: keep the **CDN-backed** MWC build — it's pixel-exact live (uses the real assets); accepted tradeoff is it's not archival (drifts if Spitfire changes their CDN). A localized `_files` folder is the path to archival exactness if ever needed (proven by `Tenebra Original/`).
- **Single-file inlined HTML** (one `.html` with everything embedded). `single-file-cli` re-ran the page JS during serialization and produced a broken, unstyled white page; `monolith` panicked in `retrieve_asset` on this capture's edge-case assets. Chose folder + `tokens.css` instead.
- **Restoring the original `srcset`/`<source>`** to get CDN images. They are protocol-relative (`//www.spitfireaudio.com/...`) which resolves to `file://www...` and fails on `file://`; browsers prefer srcset over the local `src`. Stripped them; localize specific images from the CDN when higher res is needed.
- **Matching the masthead font in New-Tokens to proxima**: proxima belongs to Original only; New-Tokens is the GT rebrand. (Proxima cannot self-host the missing Light 300 weight either.)

## Discoveries (technical)
- **Adobe Typekit is domain-locked**: `proxima-nova` will not serve to `file://` or unregistered domains, and Chrome "Save Page As" never downloads Typekit fonts. The offline masthead falls back to system fonts unless proxima is self-hosted (Original does this).
- **`srcset` on `file://`**: protocol-relative CDN URLs break; stripping them makes the local `src` win. Side effect: some images sit at a low-res fallback (the hero was a 400x400 square).
- **Theme uses a fluid type system** (`--fluid-type-size: clamp(...)`) and utility classes (`u-heading-*`, `u-text-*`, `c-rte`); remap those rather than tag every element.
- **Theme heading specificity** reaches (0,3,0) (e.g. `.section-main-product .snippet-layout-product-overview .title` forces font-weight 600), so composite/override classes need `!important`.
- **Scroll is hijacked** by a smooth-scroll lib: `window.scrollTo` is a no-op, and tall headless captures distort vh-based hero. Verify via `getComputedStyle` over `http://localhost` in the Claude_in_Chrome browser (it force-prepends `https` to `file://`, so serve over localhost).
- **Search box vs icon** is responsive at a 1400px breakpoint (`.search-open span { display:none }` under 1400px), identical in the local copy and live. Not a bug.
- **Vercel project names** must be lowercase, no spaces; link with an explicit `--project` name.

## Adjacent files
- `TOKENS.md` — tokens-only writeup (the type system, how it was applied, what to flag). Linked from the entry hub footer.
- `tokens/typography.md`, `tokens/typography-tokens.json` — the type system spec and source data.
- Plan file: `~/.claude/plans/yes-async-donut.md` (latest plan: pin the page to the Neutral scale).
- Memory: `~/.claude/projects/-Users-gestalt-DEV-sfa-tokens/memory/` (user + project notes).
