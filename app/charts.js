// DealProof charts: a small honest price picture for one deal. Only two
// numbers are ever drawn — the list price and today's sale price — because
// those are the only two numbers verified for every deal. No invented history
// line, no fake 90-day curve: the bars show list vs today, and the caption
// says exactly that.

const usd = (n) =>
  "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export function priceBars(deal) {
  if (!deal.was) return "";
  const max = deal.was;
  const wList = 100;
  const wSale = Math.max(4, Math.round((deal.price / max) * 100));
  const saved = Math.round((deal.was - deal.price) * 100) / 100;
  return `<figure class="bars" role="img" aria-label="List price ${usd(deal.was)}, sale price ${usd(deal.price)}">
<div class="bar-row"><span class="bar-label">List price</span><span class="bar-track"><span class="bar bar-list" style="width:${wList}%"></span></span><span class="bar-value">${usd(deal.was)}</span></div>
<div class="bar-row"><span class="bar-label">Today</span><span class="bar-track"><span class="bar bar-sale" style="width:${wSale}%"></span></span><span class="bar-value">${usd(deal.price)}</span></div>
<figcaption>You save ${usd(saved)} (${Math.round((1 - deal.price / deal.was) * 100)}% off list). Only the two verified prices are drawn — no invented history.</figcaption></figure>`;
}
