/* =============================================================================
   type-tweak.js — live type-token tweak panel for the token studies replica pages.
   Designers adjust per-level font sizes and the named weight roles and see the
   page reflow instantly (every composite class reads its size/weight from a CSS
   custom property, so we just override those on :root). Tweaks persist in
   localStorage (shared across both replica pages, same origin) and can be exported
   as a timestamped typography-tokens JSON patched from the live source of truth.
   Self-contained, vanilla JS, all styles scoped under #sfa-type-tweak.
   ========================================================================== */
(function () {
  if (window.__sfaTypeTweak) return;
  window.__sfaTypeTweak = true;

  var LS_KEY = "sfa-type-tweak-v1";
  var REM = 16; // px per rem
  var JSON_URL = "../tokens/typography-tokens.json"; // replica pages are one level deep
  var DIRECTIONS = ["neutral", "expressive", "cinematic"];

  // ---- override state (cssVar -> value string) -----------------------------
  function loadOverrides() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveOverrides() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(overrides)); } catch (e) {}
  }
  var overrides = loadOverrides();

  function applyVar(cssVar, val) {
    document.documentElement.style.setProperty(cssVar, val);
  }
  function clearVar(cssVar) {
    document.documentElement.style.removeProperty(cssVar);
  }
  // Apply any saved overrides immediately, before the panel is even built.
  Object.keys(overrides).forEach(function (k) { applyVar(k, overrides[k]); });

  // ---- helpers --------------------------------------------------------------
  function remStr(px) {
    // px -> tidy rem string, e.g. 36 -> "2.25rem"
    var rem = px / REM;
    return parseFloat(rem.toFixed(4)) + "rem";
  }
  function pxFromRem(remValue) {
    return Math.round(parseFloat(remValue) * REM);
  }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function stamp() {
    var d = new Date();
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate()) +
      "-" + two(d.getHours()) + two(d.getMinutes());
  }

  // ---- model (built from the fetched JSON) ----------------------------------
  // each entry: { kind:'size'|'weight', cssVar, path:[...], comment, def, dir }
  var model = [];
  var tokensJSON = null;

  function buildModel(data) {
    tokensJSON = data;
    var size = (data.font && data.font.size) || {};
    var weights = data["font-weight"] || {};
    DIRECTIONS.forEach(function (dir) {
      var lv = size[dir] || {};
      Object.keys(lv).forEach(function (key) {
        model.push({
          kind: "size", dir: dir, key: key,
          cssVar: "--font-size-" + dir + "-" + key,
          path: ["font", "size", dir, key],
          comment: lv[key].comment || "", def: lv[key].value
        });
      });
    });
    Object.keys(weights).forEach(function (name) {
      model.push({
        kind: "weight", dir: name.split("-")[0], name: name,
        cssVar: "--font-weight-" + name,
        path: ["font-weight", name],
        comment: weights[name].comment || "", def: weights[name].value
      });
    });
  }

  function currentValue(item) {
    return overrides[item.cssVar] != null ? overrides[item.cssVar] : item.def;
  }

  // ---- DOM / UI -------------------------------------------------------------
  var root, drawer, els = {}; // els[cssVar] = {range, num}

  function css() {
    return [
      "#sfa-type-tweak,#sfa-type-tweak *{box-sizing:border-box;font-family:'GT Flaire Trial VF',system-ui,-apple-system,sans-serif}",
      "#sfa-tt-launch{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;border:1px solid #2a2a31;background:#101014;color:#fff;font-size:12px;font-weight:700;letter-spacing:.04em;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,.5)}",
      "#sfa-tt-launch:hover{border-color:#FF3038}",
      "#sfa-tt-launch .d{width:8px;height:8px;border-radius:50%;background:#FF3038;box-shadow:0 0 8px #FF3038}",
      "#sfa-tt-drawer{position:fixed;top:38px;right:0;bottom:0;width:360px;max-width:92vw;z-index:2147483000;background:#0c0c10;border-left:1px solid #1f1f25;color:#C6C6CB;display:flex;flex-direction:column;transform:translateX(102%);transition:transform .28s cubic-bezier(.2,.7,.2,1);box-shadow:-12px 0 40px rgba(0,0,0,.5)}",
      "#sfa-type-tweak.open #sfa-tt-drawer{transform:translateX(0)}",
      "#sfa-tt-head{padding:16px 18px;border-bottom:1px solid #1f1f25;display:flex;align-items:flex-start;gap:10px}",
      "#sfa-tt-head h2{font-size:14px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;margin:0}",
      "#sfa-tt-head p{font-size:11px;color:#74747d;margin:4px 0 0}",
      "#sfa-tt-close{margin-left:auto;background:none;border:0;color:#74747d;font-size:20px;line-height:1;cursor:pointer;padding:0 2px}",
      "#sfa-tt-close:hover{color:#fff}",
      "#sfa-tt-body{flex:1;overflow:auto;padding:8px 0}",
      "#sfa-type-tweak details{border-bottom:1px solid #16161b}",
      "#sfa-type-tweak summary{padding:11px 18px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#fff;cursor:pointer;list-style:none}",
      "#sfa-type-tweak summary::-webkit-details-marker{display:none}",
      "#sfa-type-tweak summary::before{content:'\\25B8';color:#74747d;margin-right:8px;display:inline-block;transition:transform .15s}",
      "#sfa-type-tweak details[open] summary::before{transform:rotate(90deg)}",
      "#sfa-type-tweak .sub{padding:2px 18px 10px;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#56565d}",
      ".sfa-tt-row{display:grid;grid-template-columns:1fr 64px 20px;align-items:center;gap:8px;padding:5px 18px}",
      ".sfa-tt-row label{font-size:12px;color:#C6C6CB;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".sfa-tt-row label small{color:#74747d}",
      ".sfa-tt-row input[type=range]{grid-column:1/2;width:100%;accent-color:#FF3038;margin-top:2px}",
      ".sfa-tt-row .num{width:64px;background:#161620;border:1px solid #2a2a31;color:#fff;border-radius:6px;padding:5px 6px;font-size:12px;text-align:right}",
      ".sfa-tt-row .rst{background:none;border:0;color:#56565d;cursor:pointer;font-size:13px;padding:0}",
      ".sfa-tt-row .rst:hover{color:#FF3038}",
      ".sfa-tt-rowwrap{padding:6px 0}",
      "#sfa-tt-foot{padding:12px 18px;border-top:1px solid #1f1f25;display:flex;gap:8px}",
      "#sfa-tt-foot button{flex:1;padding:9px 10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;border:1px solid #2a2a31;background:#161620;color:#C6C6CB}",
      "#sfa-tt-foot .exp{background:#FF3038;border-color:#FF3038;color:#fff}",
      "#sfa-tt-foot button:hover{border-color:#FF3038}",
      "#sfa-tt-err{padding:18px;font-size:12px;color:#ff8a8f}",
      "#sfa-tt-legend{display:flex;gap:14px;padding:9px 18px;border-bottom:1px solid #1f1f25;font-size:10px;letter-spacing:.06em;color:#9a9aa2}",
      "#sfa-tt-legend span{display:inline-flex;align-items:center;gap:5px}",
      "#sfa-tt-legend i{width:9px;height:9px;border-radius:2px}",
      ".sfa-tt-rowwrap.hi{background:rgba(255,48,56,.22);box-shadow:inset 4px 0 0 #FF3038, inset 0 0 0 1px rgba(255,48,56,.65)}",
      ".sfa-tt-rowwrap.hi label{color:#fff}",
      ".sfa-tt-rowwrap.hi label small{color:#ffd2d4}",
      "#sfa-tt-overlay{position:absolute;top:0;left:0;z-index:2147482000;pointer-events:none}",
      ".sfa-tt-box{position:absolute;pointer-events:none;outline:1px dashed rgba(255,255,255,.3);outline-offset:1px}",
      ".sfa-tt-box.dir-neutral{outline-color:rgba(122,162,255,.65)}",
      ".sfa-tt-box.dir-expressive{outline-color:rgba(255,93,143,.75)}",
      ".sfa-tt-box.dir-cinematic{outline-color:rgba(255,194,75,.8)}",
      ".sfa-tt-box.hot{outline-style:solid;outline-width:2px;background:rgba(255,255,255,.05)}",
      ".sfa-tt-box.flash{outline-style:solid;outline-width:2px;background:rgba(255,48,56,.14)}",
      ".sfa-tt-chip{position:absolute;left:0;top:-15px;font-weight:700;font-size:9px;line-height:1.4;letter-spacing:.06em;text-transform:uppercase;padding:1px 5px;border-radius:3px;white-space:nowrap;pointer-events:none}",
      ".sfa-tt-box.dir-neutral .sfa-tt-chip{background:#7aa2ff;color:#06060a}",
      ".sfa-tt-box.dir-expressive .sfa-tt-chip{background:#ff5d8f;color:#fff}",
      ".sfa-tt-box.dir-cinematic .sfa-tt-chip{background:#ffc24b;color:#06060a}",
      "#sfa-tt-tip{position:fixed;z-index:2147483100;pointer-events:none;background:#FF3038;color:#fff;font-weight:700;font-size:11px;line-height:1.5;padding:3px 8px;border-radius:5px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.55);display:none}"
    ].join("");
  }

  function rowWrap(item) {
    var wrap = document.createElement("div");
    wrap.className = "sfa-tt-rowwrap";
    var row = document.createElement("div");
    row.className = "sfa-tt-row";

    var isSize = item.kind === "size";
    var label = document.createElement("label");
    if (isSize) {
      var lvl = /^\d+$/.test(item.key)
        ? "H" + item.key
        : item.key.split("-").map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
      var role = (item.comment.split("/")[1] || "").trim(); // e.g. "Basic Medium"
      label.innerHTML = lvl + " <small>" + role + "</small>";
      label.title = item.comment;
    } else {
      label.innerHTML = item.name + " <small>(weight)</small>";
      label.title = item.comment;
    }

    var range = document.createElement("input");
    range.type = "range";
    var num = document.createElement("input");
    num.type = "number";
    num.className = "num";

    var cur = currentValue(item);
    if (isSize) {
      range.min = 8; range.max = 120; range.step = 1;
      var px = pxFromRem(cur);
      range.value = px; num.value = px; num.step = 1; num.min = 4;
    } else {
      range.min = 100; range.max = 900; range.step = 10;
      range.value = parseInt(cur, 10); num.value = parseInt(cur, 10); num.step = 10; num.min = 1; num.max = 1000;
    }

    function commit(v) {
      var val;
      if (isSize) { val = remStr(v); } else { val = String(v); }
      overrides[item.cssVar] = val;
      applyVar(item.cssVar, val);
      saveOverrides();
      if (overlay) scheduleReposition();
    }
    range.addEventListener("input", function () { num.value = range.value; commit(+range.value); });
    num.addEventListener("input", function () { range.value = num.value; commit(+num.value); });

    var rst = document.createElement("button");
    rst.className = "rst"; rst.title = "Reset to token default"; rst.textContent = "↺";
    rst.addEventListener("click", function () {
      delete overrides[item.cssVar];
      clearVar(item.cssVar);
      saveOverrides();
      var d = isSize ? pxFromRem(item.def) : parseInt(item.def, 10);
      range.value = d; num.value = d;
    });

    els[item.cssVar] = { range: range, num: num, isSize: isSize, def: item.def, wrap: wrap };
    wrap.addEventListener("mouseenter", function () { highlightByVar(item.cssVar, true); });
    wrap.addEventListener("mouseleave", function () { highlightByVar(item.cssVar, false); });
    row.appendChild(label); row.appendChild(num); row.appendChild(rst);
    wrap.appendChild(range); wrap.appendChild(row);
    return wrap;
  }

  function buildUI(err) {
    root = document.createElement("div");
    root.id = "sfa-type-tweak";
    var style = document.createElement("style");
    style.textContent = css();
    root.appendChild(style);

    var launch = document.createElement("button");
    launch.id = "sfa-tt-launch";
    launch.innerHTML = '<span class="d"></span> Type tokens';
    launch.addEventListener("click", function () { setOpen(!root.classList.contains("open")); });
    root.appendChild(launch);

    drawer = document.createElement("div");
    drawer.id = "sfa-tt-drawer";

    var head = document.createElement("div");
    head.id = "sfa-tt-head";
    head.innerHTML = "<div><h2>Type tokens</h2><p>Live size &amp; weight. Tweaks persist; export when happy.</p></div>";
    var close = document.createElement("button");
    close.id = "sfa-tt-close"; close.innerHTML = "&times;"; close.title = "Close";
    close.addEventListener("click", function () { setOpen(false); });
    head.appendChild(close);
    drawer.appendChild(head);

    var legend = document.createElement("div");
    legend.id = "sfa-tt-legend";
    legend.innerHTML =
      '<span><i style="background:#7aa2ff"></i>Neutral</span>' +
      '<span><i style="background:#ff5d8f"></i>Expressive</span>' +
      '<span><i style="background:#ffc24b"></i>Cinematic</span>';
    drawer.appendChild(legend);

    var body = document.createElement("div");
    body.id = "sfa-tt-body";

    if (err) {
      var e = document.createElement("div");
      e.id = "sfa-tt-err";
      e.textContent = "Could not load the tokens JSON (" + err + "). The panel needs the page served over http(s); open it from the deployed site or a local server, not file://.";
      body.appendChild(e);
    } else {
      DIRECTIONS.forEach(function (dir) {
        var sizes = model.filter(function (m) { return m.kind === "size" && m.dir === dir; });
        var wts = model.filter(function (m) { return m.kind === "weight" && m.dir === dir; });
        if (!sizes.length && !wts.length) return;
        var det = document.createElement("details");
        if (dir === "neutral") det.open = true;
        var sum = document.createElement("summary");
        sum.textContent = dir;
        det.appendChild(sum);
        if (sizes.length) {
          var s1 = document.createElement("div"); s1.className = "sub"; s1.textContent = "Size"; det.appendChild(s1);
          sizes.forEach(function (it) { det.appendChild(rowWrap(it)); });
        }
        if (wts.length) {
          var s2 = document.createElement("div"); s2.className = "sub"; s2.textContent = "Weight"; det.appendChild(s2);
          wts.forEach(function (it) { det.appendChild(rowWrap(it)); });
        }
        body.appendChild(det);
      });
    }
    drawer.appendChild(body);

    if (!err) {
      var foot = document.createElement("div");
      foot.id = "sfa-tt-foot";
      var resetAll = document.createElement("button");
      resetAll.textContent = "Reset all";
      resetAll.addEventListener("click", resetAllFn);
      var exp = document.createElement("button");
      exp.className = "exp"; exp.textContent = "Export JSON";
      exp.addEventListener("click", exportFn);
      foot.appendChild(resetAll); foot.appendChild(exp);
      drawer.appendChild(foot);
    }

    root.appendChild(drawer);
    document.body.appendChild(root);
  }

  function resetAllFn() {
    Object.keys(overrides).forEach(function (k) { clearVar(k); });
    overrides = {};
    saveOverrides();
    model.forEach(function (it) {
      var ref = els[it.cssVar]; if (!ref) return;
      var d = it.kind === "size" ? pxFromRem(it.def) : parseInt(it.def, 10);
      ref.range.value = d; ref.num.value = d;
    });
  }

  function exportFn() {
    if (!tokensJSON) return;
    var out = JSON.parse(JSON.stringify(tokensJSON)); // deep clone, comments preserved
    model.forEach(function (it) {
      var v = currentValue(it);
      var node = out;
      for (var i = 0; i < it.path.length; i++) { node = node[it.path[i]]; if (!node) return; }
      node.value = v;
    });
    var blob = new Blob([JSON.stringify(out, null, 2) + "\n"], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "typography-tokens-" + stamp() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---- token-label overlay --------------------------------------------------
  function el(t) { return document.createElement(t); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // class -> token mapping. Composites listed first so they win over utility
  // classes on the same element (matches the CSS cascade); first match per node.
  function buildTokenMap() {
    var m = [];
    var dirWeight = { neutral: "neutral-medium", expressive: "expressive-light", cinematic: "cinematic-bold" };
    var abbr = { neutral: "Neu", expressive: "Expr", cinematic: "Cin" };
    var levels = { neutral: [0,1,2,3,4,5,6], expressive: [0,1,2,3,4,5,6], cinematic: [1,2,3,4,5,6,7] };
    DIRECTIONS.forEach(function (dir) {
      levels[dir].forEach(function (n) {
        m.push({ sel: ".h" + n + "-" + dir, sizeVar: "--font-size-" + dir + "-" + n,
          weightVar: "--font-weight-" + dirWeight[dir], label: cap(dir) + " · H" + n,
          short: abbr[dir] + " H" + n, dir: dir, heading: true });
      });
    });
    [["body-1","Body 1","neutral-regular"],["body-1-emphasis","Body 1 Emph","neutral-medium"],
     ["body-2","Body 2","neutral-regular"],["body-2-emphasis","Body 2 Emph","neutral-medium"],
     ["body-3","Body 3","neutral-regular"],["body-3-emphasis","Body 3 Emph","neutral-medium"]
    ].forEach(function (b) {
      m.push({ sel: "." + b[0], sizeVar: "--font-size-neutral-" + b[0], weightVar: "--font-weight-" + b[2],
        label: "Neutral · " + b[1], short: "Neu " + b[1], dir: "neutral", heading: false });
    });
    m.push({ sel: ".control-label", sizeVar: "--font-size-cinematic-control-label",
      weightVar: "--font-weight-cinematic-medium", label: "Cinematic · Control Label",
      short: "Cin Ctrl", dir: "cinematic", heading: true });
    [[".u-heading-xl","neutral-0","neutral-medium","Neutral · H0",true],
     [".u-heading-lg","neutral-2","neutral-medium","Neutral · H2",true],
     [".u-heading-sm","neutral-5","neutral-medium","Neutral · H5",true],
     [".u-heading-xs","neutral-6","neutral-medium","Neutral · H6",true],
     [".sub-text","neutral-body-3","neutral-regular","Neutral · Body 3",false],
     [".audio-name","neutral-body-2-emphasis","neutral-medium","Neutral · Body 2 Emph",false],
     [".c-rte","neutral-body-1","neutral-regular","Neutral · Body 1",false],
     [".u-text-lg","neutral-body-1","neutral-regular","Neutral · Body 1",false],
     [".u-text-sm","neutral-body-2","neutral-regular","Neutral · Body 2",false],
     [".card-text","neutral-body-2","neutral-regular","Neutral · Body 2",false]
    ].forEach(function (u) {
      m.push({ sel: u[0], sizeVar: "--font-size-" + u[1], weightVar: "--font-weight-" + u[2],
        label: u[3], short: u[3].replace("Neutral · ", "Neu "), dir: "neutral", heading: u[4] });
    });
    return m;
  }
  var TOKENMAP = buildTokenMap();

  var overlay = null, tip = null, detected = [], repoScheduled = false, byEl = null;
  var TOKEN_SEL = TOKENMAP.map(function (t) { return t.sel; }).join(",");
  function tokenFor(node) { for (var i = 0; i < TOKENMAP.length; i++) { if (node.matches(TOKENMAP[i].sel)) return TOKENMAP[i]; } return null; }
  // Delegated hover: map whatever is under the cursor to its token via closest().
  // Robust to child text (e.g. span inside .audio-name), overflowing glyphs, and
  // elements rendered after the initial scan (lazy audio demos).
  // Driven by mousemove, not mouseover: the audio card's stretched-link::after
  // spans the whole card, so a single mouseover fires on entry and none again as
  // you slide down onto the track name underneath. mousemove fires on every move,
  // and the activeD-equality check below keeps it cheap.
  function onOver(e) {
    // Resolve the token element under the cursor with elementsFromPoint so we can
    // see THROUGH overlay elements (e.g. the audio player's stretched-link::after,
    // which covers the track name and would otherwise swallow the hover; the track
    // name is its sibling, so closest() from the overlay can't reach it).
    var m = null;
    var stack = (document.elementsFromPoint && e.clientX != null)
      ? document.elementsFromPoint(e.clientX, e.clientY) : [e.target];
    for (var i = 0; i < stack.length; i++) {
      var node = stack[i];
      if (!node || !node.closest) continue;
      if (node.closest("#sfa-type-tweak")) { m = null; break; } // over the panel: ignore
      var c = node.closest(TOKEN_SEL);
      if (c && c.textContent && c.textContent.trim()) { m = c; break; }
      // The track name (.audio-name) is a narrow box, but an audio demo is one
      // logical unit, so hovering anywhere on the card (play button, name, the
      // empty space beside it, or the waveform below) should resolve to the name.
      // Sliding straight down from the section heading lands on the card, not dead
      // air. The card has exactly one token, so querySelector(TOKEN_SEL) is its name.
      // (Tenebra's stretched-link::after fills the card; Mervyn's doesn't, so we key
      // off the card element itself, which is present in the hit-stack either way.)
      var card = node.closest("audio-demo, .snippet-product-audio-demo, .audio-heading");
      if (card) { var nm = card.querySelector(TOKEN_SEL); if (nm && nm.textContent && nm.textContent.trim()) { m = nm; break; } }
    }
    if (!m) { hideTip(); return; }
    if (activeD && activeD.el === m) return;
    var d = (byEl && byEl.get(m)) || { el: m, t: tokenFor(m), box: null };
    if (!d.t) return;
    setActive(d);
  }

  function scan() {
    detected = [];
    var seen = [];
    TOKENMAP.forEach(function (t) {
      var nodes = document.querySelectorAll(t.sel);
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (seen.indexOf(node) !== -1) continue;     // first (composite) match wins
        if (node.closest("#sfa-type-tweak")) continue; // skip our own UI
        if (!node.textContent || !node.textContent.trim()) continue; // skip empty cells (no text)
        var cs = getComputedStyle(node);
        if (cs.visibility === "hidden" || cs.display === "none" || parseFloat(cs.opacity) === 0) continue; // skip invisible (e.g. hidden carousel cards)
        // Skip elements that render no visible glyphs: e.g. wrappers whose text lives
        // only in display:none descendants (textContent includes those, so the checks
        // above pass, but nothing is actually painted -> phantom empty box).
        var renders = false;
        try {
          var rng = document.createRange();
          rng.selectNodeContents(node);
          var rcs = rng.getClientRects();
          for (var k = 0; k < rcs.length; k++) { if (rcs[k].width > 0.5 && rcs[k].height > 0.5) { renders = true; break; } }
        } catch (e) { renders = true; }
        if (!renders) continue;
        seen.push(node);
        detected.push({ el: node, t: t });
      }
    });
  }

  function buildOverlay() {
    overlay = el("div"); overlay.id = "sfa-tt-overlay";
    document.body.appendChild(overlay);
    byEl = new Map();
    detected.forEach(function (d) {
      var box = el("div"); box.className = "sfa-tt-box dir-" + d.t.dir;
      if (d.t.heading) { var chip = el("div"); chip.className = "sfa-tt-chip"; chip.textContent = d.t.short; box.appendChild(chip); }
      overlay.appendChild(box); d.box = box;
      byEl.set(d.el, d);
    });
    document.addEventListener("mousemove", onOver);
    reposition();
  }

  function teardownOverlay() {
    clearActive();
    document.removeEventListener("mousemove", onOver);
    byEl = null;
    if (overlay) { overlay.remove(); overlay = null; }
  }

  function reposition() {
    repoScheduled = false;
    if (!overlay) return;
    var vw = window.innerWidth, vh = window.innerHeight;
    var sx = window.pageXOffset, sy = window.pageYOffset;
    var rects = detected.map(function (d) { return d.el.getBoundingClientRect(); }); // batch reads first
    detected.forEach(function (d, i) {                                               // then batch writes
      var r = rects[i], b = d.box.style;
      if (!r.width || !r.height || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) { b.display = "none"; return; }
      // document coords (rect + scroll) so absolute boxes scroll natively with the
      // page; no per-frame lag chasing native scroll.
      b.display = "block"; b.left = (r.left + sx) + "px"; b.top = (r.top + sy) + "px"; b.width = r.width + "px"; b.height = r.height + "px";
    });
  }
  function scheduleReposition() { if (repoScheduled || !overlay) return; repoScheduled = true; requestAnimationFrame(reposition); }

  // Continuous tracking while the overlay is on. The theme uses a smooth-scroll
  // lib that transforms a wrapper instead of firing scroll events, so listening
  // for "scroll" leaves boxes frozen. Repositioning every frame tracks reliably
  // (also catches layout shifts from live tweaks). Cheap: one batched reflow/frame.
  var rafId = null;
  function tick() { reposition(); rafId = requestAnimationFrame(tick); }

  function showTip(d) {
    if (!tip) { tip = el("div"); tip.id = "sfa-tt-tip"; document.body.appendChild(tip); }
    var cs = getComputedStyle(d.el);
    tip.textContent = d.t.label + " · " + Math.round(parseFloat(cs.fontSize)) + "px · " + cs.fontWeight;
    var r = d.el.getBoundingClientRect();
    tip.style.display = "block";
    var top = r.top - 24; if (top < 2) top = r.top + 2;
    tip.style.left = Math.max(4, r.left) + "px"; tip.style.top = top + "px";
  }
  function hideTip() { if (tip) tip.style.display = "none"; }

  // element hover -> highlight its rows. Single-active + latching: each hover
  // clears the previous active element first, then highlights the new one; the
  // highlight persists after roll-off until another element is hovered. Clearing
  // on enter (not leave) also avoids the nested-element problem (mouseleave does
  // not fire on a parent when you move onto its child).
  var activeD = null;
  function clearActive() {
    if (overlay) { var hot = overlay.querySelectorAll(".sfa-tt-box.hot"); for (var i = 0; i < hot.length; i++) hot[i].classList.remove("hot"); }
    var hi = document.querySelectorAll("#sfa-type-tweak .sfa-tt-rowwrap.hi");
    for (var j = 0; j < hi.length; j++) hi[j].classList.remove("hi");
    hideTip();
    activeD = null;
  }
  function setActive(d) {
    clearActive();
    if (!d) return;
    activeD = d;
    if (d.box) d.box.classList.add("hot");
    showTip(d);
    [d.t.sizeVar, d.t.weightVar].forEach(function (v) {
      var ref = els[v]; if (!ref || !ref.wrap) return;
      ref.wrap.classList.add("hi");
      var det = ref.wrap.closest("details"); if (det && !det.open) det.open = true;
    });
    var sref = els[d.t.sizeVar]; if (sref && sref.wrap) sref.wrap.scrollIntoView({ block: "nearest" });
  }
  // panel row hover -> flash the elements that use that token
  function highlightByVar(cssVar, on) {
    if (!overlay) return;
    detected.forEach(function (d) {
      if (d.t.sizeVar === cssVar || d.t.weightVar === cssVar) d.box.classList.toggle("flash", on);
    });
  }

  // Overlay lifecycle is tied to the panel being open (no separate toggle).
  function setOpen(open) {
    root.classList.toggle("open", open);
    if (open) { if (!overlay) { scan(); buildOverlay(); rafId = requestAnimationFrame(tick); } }
    else { if (rafId) cancelAnimationFrame(rafId); rafId = null; teardownOverlay(); }
  }

  window.addEventListener("scroll", scheduleReposition, true);
  window.addEventListener("resize", scheduleReposition);

  // ---- boot -----------------------------------------------------------------
  fetch(JSON_URL)
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (data) { buildModel(data); buildUI(); })
    .catch(function (e) { buildUI(e.message || e); });
})();
