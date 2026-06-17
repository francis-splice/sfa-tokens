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
      "#sfa-tt-err{padding:18px;font-size:12px;color:#ff8a8f}"
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

    els[item.cssVar] = { range: range, num: num, isSize: isSize, def: item.def };
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
    launch.addEventListener("click", function () { root.classList.toggle("open"); });
    root.appendChild(launch);

    drawer = document.createElement("div");
    drawer.id = "sfa-tt-drawer";

    var head = document.createElement("div");
    head.id = "sfa-tt-head";
    head.innerHTML = "<div><h2>Type tokens</h2><p>Live size &amp; weight. Tweaks persist; export when happy.</p></div>";
    var close = document.createElement("button");
    close.id = "sfa-tt-close"; close.innerHTML = "&times;"; close.title = "Close";
    close.addEventListener("click", function () { root.classList.remove("open"); });
    head.appendChild(close);
    drawer.appendChild(head);

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

  // ---- boot -----------------------------------------------------------------
  fetch(JSON_URL)
    .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
    .then(function (data) { buildModel(data); buildUI(); })
    .catch(function (e) { buildUI(e.message || e); });
})();
