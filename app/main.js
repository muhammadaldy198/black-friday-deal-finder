// DealProof main: routing + render. Hash routes: #/ (list), #/deal/<id>,
// #/compare (same product across stores), #/method (how we check).
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CHECKED_AT } from "./deals.js";
import { applyFilters, defaultState, storeList, SORTS } from "./filters.js";
import { percentOff, savedUsd } from "./signal.js";
import { dealRows, dealDetail, methodPage, categoryChips, checkTime, checkTimeShort, esc, usd } from "./views.js";
import { comparePage } from "./compare.js";

const app = document.getElementById("app");
const state = defaultState();

function statsStrip() {
  const stores = storeList(deals).length;
  const cats = new Set(deals.map((d) => d.category)).size;
  const newLows = deals.filter((d) => d.signal === "NEW LOW").length;
  const totalSaved = deals.reduce((s, d) => s + savedUsd(d), 0);
  return `<section class="stats" aria-label="Board totals">
<div><strong>${deals.length}</strong><span>verified deals</span></div>
<div><strong>${stores}</strong><span>stores</span></div>
<div><strong>${cats}</strong><span>categories</span></div>
<div><strong>${newLows}</strong><span>new lows</span></div>
<div><strong>${usd(Math.round(totalSaved))}</strong><span>total savings</span></div>
<div><strong>08:30 UTC</strong><span>all checked 27 Nov</span></div>
</section>`;
}

function toolbar(shown, total) {
  const stores = storeList(deals);
  return `<section class="toolbar">
<div class="search-row"><label>Search <input id="q" type="search" placeholder="Search a product, store or category…" value="${esc(state.q)}"></label>
<label>Store <select id="store"><option value="All">All stores</option>${stores
    .map((s) => `<option${state.store === s ? " selected" : ""}>${esc(s)}</option>`)
    .join("")}</select></label>
<label>Discount <select id="minpct">
<option value="0"${state.minPct === 0 ? " selected" : ""}>Any discount</option>
<option value="20"${state.minPct === 20 ? " selected" : ""}>20% off or more</option>
<option value="30"${state.minPct === 30 ? " selected" : ""}>30% off or more</option>
<option value="50"${state.minPct === 50 ? " selected" : ""}>50% off or more</option>
</select></label>
<label>Sort <select id="sort">${SORTS.map((s) => `<option value="${s.id}"${state.sort === s.id ? " selected" : ""}>${esc(s.label)}</option>`).join("")}</select></label>
<label class="check"><input id="newlow" type="checkbox"${state.newLowOnly ? " checked" : ""}> NEW LOW only</label></div>
<div class="chips">${categoryChips(state)}</div>
<p class="count" id="count">Showing ${shown} of ${total} deals — sorted ${esc((SORTS.find((s) => s.id === state.sort) || {}).label || "")}.</p>
</section>`;
}

function bindToolbar() {
  const q = document.getElementById("q");
  if (q) q.addEventListener("input", () => { state.q = q.value; renderList(); });
  const store = document.getElementById("store");
  if (store) store.addEventListener("change", () => { state.store = store.value; renderList(); });
  const minpct = document.getElementById("minpct");
  if (minpct) minpct.addEventListener("change", () => { state.minPct = Number(minpct.value); renderList(); });
  const sort = document.getElementById("sort");
  if (sort) sort.addEventListener("change", () => { state.sort = sort.value; renderList(); });
  const nl = document.getElementById("newlow");
  if (nl) nl.addEventListener("change", () => { state.newLowOnly = nl.checked; renderList(); });
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => { state.category = chip.dataset.cat; renderList(); });
  });
}

function renderList() {
  const shown = applyFilters(deals, state);
  const grid = document.getElementById("grid");
  if (!grid) return;
  grid.innerHTML = dealRows(shown);
  const count = document.getElementById("count");
  if (count) count.textContent = `Showing ${shown.length} of ${deals.length} deals — sorted ${(SORTS.find((s) => s.id === state.sort) || {}).label}.`;
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.cat === state.category);
  });
  window.__shotReady = true;
}

function render() {
  window.__shotReady = false;
  const hash = location.hash || "#/";
  const dealMatch = hash.match(/^#\/deal\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    document.title = `${found ? found.title : "Not found"} | DealProof`;
    app.innerHTML = found ? dealDetail(found) : '<h1>Not found</h1><p>There is no deal at this address. <a href="#/">See all deals</a>.</p>';
  } else if (hash === "#/compare") {
    document.title = "Same product, compared across stores | DealProof";
    app.innerHTML = comparePage(deals);
  } else if (hash === "#/method") {
    document.title = "How we check every deal | DealProof";
    app.innerHTML = methodPage();
  } else {
    document.title = "DealProof — 74 verified Black Friday deals";
    const shown = applyFilters(deals, state);
    app.innerHTML = `<h1>Black Friday, verified.</h1>
<p class="lede">74 real deals, each read at its store today — with the sale price, the usual price, the discount, the store link and the time it was checked. The verdict on every deal is honest: a true low is called a new low, an ordinary cut is called routine.</p>
${statsStrip()}
${toolbar(shown.length, deals.length)}
<div id="grid">${dealRows(shown)}</div>
<section class="method-teaser"><h2><a href="#/method">How we check every deal →</a></h2><p>NEW LOW means best price ever reported. STRONG means well below list. ROUTINE means an ordinary cut, said so honestly. No price history is invented — only the two verified prices are ever drawn.</p></section>`;
    bindToolbar();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
