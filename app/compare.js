// DealProof compare: the same product at two or three stores, side by side.
// Only stores whose price was verified in this session are listed — a store
// with no verified price is left out rather than guessed. The cheapest row is
// highlighted; the point is a shopper sees at a glance where to buy it.

import { percentOff } from "./signal.js";

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export function compareTable(deal) {
  if (!deal.compare || deal.compare.length < 2) return "";
  const rows = deal.compare.slice().sort((a, b) => a.price - b.price);
  const best = rows[0].price;
  const body = rows
    .map(
      (r) =>
        `<tr${r.price === best ? ' class="best-row"' : ""}><td>${esc(r.store)}</td><td class="num">${usd(r.price)}</td><td>${r.price === best ? "Cheapest — buy here" : "+" + usd(Math.round((r.price - best) * 100) / 100) + " more"}</td></tr>`,
    )
    .join("");
  return `<section class="compare"><h2>Same product, other stores</h2>
<p class="fine">Prices for the same product, each read today. The cheapest store is highlighted.</p>
<table><thead><tr><th>Store</th><th>Price</th><th>Verdict</th></tr></thead><tbody>${body}</tbody></table></section>`;
}

// The site-wide compare page: every deal that carries a verified cross-store
// comparison, one block each.
export function comparePage(deals) {
  const withCompare = deals.filter((d) => d.compare && d.compare.length >= 2);
  const blocks = withCompare
    .map(
      (d) =>
        `<article class="compare-block"><h3><a href="#/deal/${encodeURIComponent(d.id)}">${esc(d.title)}</a></h3>
<p class="fine">${esc(d.store)} lists it at ${usd(d.price)} (usually ${usd(d.was)}, ${percentOff(d)}% off).</p>
${compareTable(d)}</article>`,
    )
    .join("");
  return `<h1>Same product, compared across stores</h1>
<p class="lede">${withCompare.length} products where we verified the price at more than one store. The cheapest store wins — no guessing, every price read today.</p>
${blocks}`;
}
