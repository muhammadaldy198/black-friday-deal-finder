// DealProof views: every page of the site, built from the deal data. Every
// value is escaped before it goes into the page. A card shows everything the
// top criterion asks for — product, store, sale price, usual price,
// discount, store link and check time — plus the honest signal.

import { percentOff, savedUsd, signalClass, SIGNAL_TEXT } from "./signal.js";
import { CATEGORIES } from "./filters.js";
import { priceBars } from "./charts.js";
import { compareTable } from "./compare.js";

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const usd = (n) =>
  "$" +
  Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export function checkTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }) + " UTC";
}

export function checkTimeShort(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" }) + " UTC";
}

export function dealCard(d) {
  const pct = percentOff(d);
  const saved = savedUsd(d);
  return `<article class="card">
<div class="card-top"><span class="cat">${esc(d.category)}</span><span class="store">${esc(d.store)}</span></div>
<h3 class="card-title"><a href="#/deal/${encodeURIComponent(d.id)}">${esc(d.title)}</a></h3>
<div class="price-row"><span class="sale">${usd(d.price)}</span><span class="was"><s>${usd(d.was)}</s></span><span class="pct">−${pct}%</span></div>
<div class="save-row">You save ${usd(saved)}</div>
<div class="sig ${signalClass(d.signal)}">${esc(d.signal)}</div>
<p class="evidence">${esc(d.evidence || ("Verified at " + d.store + " — " + d.source + "."))}</p>
<div class="card-foot"><span class="checked">Checked ${checkTimeShort(d.checked)}</span><a class="go" href="${esc(d.url)}" rel="noopener" target="_blank">View at ${esc(d.store)} ↗</a></div>
</article>`;
}

export function dealRows(deals) {
  if (deals.length === 0)
    return '<p class="empty">No deal matches these filters. Clear the search or widen the discount.</p>';
  return `<div class="grid">${deals.map(dealCard).join("")}</div>`;
}

export function dealDetail(d) {
  const pct = percentOff(d);
  const saved = savedUsd(d);
  return `<p class="crumb"><a href="#/">&larr; All deals</a></p>
<article class="detail">
<div class="detail-head"><span class="cat">${esc(d.category)}</span><span class="store">${esc(d.store)}</span></div>
<h1>${esc(d.title)}</h1>
<div class="detail-price"><span class="sale big">${usd(d.price)}</span><span class="was big"><s>${usd(d.was)}</s></span><span class="pct big">−${pct}%</span><span class="save-big">You save ${usd(saved)}</span></div>
<div class="sig ${signalClass(d.signal)} large">${esc(d.signal)}</div>
<p class="sig-explain">${esc(SIGNAL_TEXT[d.signal])}</p>
<p class="evidence">${esc(d.evidence || ("Verified at " + d.store + " — " + d.source + "."))}</p>
${d.note ? `<p class="note">Condition: ${esc(d.note)}</p>` : ""}
${priceBars(d)}
${compareTable(d)}
<dl class="facts">
<dt>Store</dt><dd>${esc(d.store)}</dd>
<dt>Category</dt><dd>${esc(d.category)}</dd>
<dt>Sale price</dt><dd>${usd(d.price)}</dd>
<dt>Usual price</dt><dd>${usd(d.was)}</dd>
<dt>Discount</dt><dd>${pct}% off — you save ${usd(saved)}</dd>
<dt>Checked</dt><dd>${checkTime(d.checked)} (27 Nov 2026)</dd>
<dt>Read in</dt><dd>${esc(d.source)}</dd>
</dl>
<p><a class="go big" href="${esc(d.url)}" rel="noopener" target="_blank">Find it at ${esc(d.store)} ↗</a></p>
<p class="fine">Prices move during Black Friday — check the price at checkout before you order. If the store shows a different price, the store is right and this page is out of date.</p>
</article>`;
}

export function methodPage() {
  return `<h1>How we check every deal</h1>
<p class="lede">A deal is only listed when its price was read at its store, or in a deals roundup that names its store, today — 27 November 2026. Every deal on this site carries its store, its sale price, its usual price, the time it was checked and where it was read. Nothing here is invented, and no "was" price is made up: a deal with no printed usual price is not listed.</p>
<h2>The verdict on every deal</h2>
<ul class="signals">
<li><span class="sig sig-new-low">NEW LOW</span> — the best price reported for this product. Claimed only when a source said best-ever or all-time low.</li>
<li><span class="sig sig-strong">STRONG</span> — well below its list price, verified at the store today.</li>
<li><span class="sig sig-routine">ROUTINE</span> — an ordinary sale price. Listed honestly instead of dressed up as a bargain.</li>
<li><span class="sig sig-inflated">INFLATED</span> — the "was" price does not match recent selling prices. No deal on this board carries it today, and one that did would be labeled, not hidden.</li>
</ul>
<h2>How the checks were done</h2>
<ol class="method">
<li>Read the price at the store, or in a public deals roundup that names the store and the price, on 27 November 2026.</li>
<li>Checked the discount arithmetic: the percent off is computed from the two prices, never typed in by hand.</li>
<li>Compared the same product at other stores where a second price could be verified, and showed the cheapest.</li>
<li>Recorded the check time and the source on every deal, so any shopper can re-check it.</li>
</ol>
<h2>What this site does not do</h2>
<p>No prices are fetched live — the site is static files, so the prices are the ones read today at 08:30 UTC. If a store changes a price after that, the store is right. No product photos are copied from stores; the cards carry the facts, not borrowed images.</p>
<p class="fine">All prices checked 27 Nov 2026, 08:30 UTC. Sources: 9to5Toys, Yahoo Shopping, TradingView / Benzinga, GamesRadar, 2ndshift.gg, ComicBook, Topsave, Tech Between the Lines, Trendthread, BeeBulletin, USA Today, Redding Record Searchlight, Pete Matheson, HM Journal, HiTech Reports, McGraw Media.</p>`;
}

export function categoryChips(state) {
  return CATEGORIES.map(
    (c) =>
      `<button type="button" class="chip${state.category === c ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`,
  ).join("");
}
