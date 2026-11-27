// DealProof filters: search + category + store + discount + signal, and the
// four sorts. One job only: given the deals and a state object, return the
// deals to show. Pure function — the same code runs the list, the counts and
// the screenshots, so a filter the screenshots show is a filter that works.

import { percentOff, dealScore, savedUsd } from "./signal.js";

export const CATEGORIES = [
  "All",
  "Audio",
  "Tech",
  "Laptops",
  "TVs",
  "Gaming",
  "Home",
  "Kitchen",
  "Toys",
  "Fashion",
  "Beauty",
  "Auto",
  "Gift cards",
];

export const SORTS = [
  { id: "best", label: "Best deal first" },
  { id: "pct", label: "Biggest % off" },
  { id: "saved", label: "Biggest $ saved" },
  { id: "price", label: "Lowest price" },
];

export function defaultState() {
  return { q: "", category: "All", store: "All", minPct: 0, newLowOnly: false, sort: "best" };
}

export function applyFilters(deals, state) {
  const q = state.q.trim().toLowerCase();
  let out = deals.filter((d) => {
    if (q && `${d.title} ${d.store} ${d.category}`.toLowerCase().indexOf(q) === -1) return false;
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (state.minPct > 0 && percentOff(d) < state.minPct) return false;
    if (state.newLowOnly && d.signal !== "NEW LOW") return false;
    return true;
  });
  const sorted = out.slice();
  if (state.sort === "pct") sorted.sort((a, b) => percentOff(b) - percentOff(a) || savedUsd(b) - savedUsd(a));
  else if (state.sort === "saved") sorted.sort((a, b) => savedUsd(b) - savedUsd(a) || percentOff(b) - percentOff(a));
  else if (state.sort === "price") sorted.sort((a, b) => a.price - b.price);
  else sorted.sort((a, b) => dealScore(b) - dealScore(a));
  return sorted;
}

export function storeList(deals) {
  const seen = [];
  for (const d of deals) if (seen.indexOf(d.store) === -1) seen.push(d.store);
  return seen.sort();
}
