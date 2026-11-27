// DealProof signal: is it really a deal? Four honest verdicts, decided from the
// two prices and the evidence the roundups reported. Nothing here invents a
// price history — a NEW LOW is only claimed when a source said best-ever or
// all-time low; everything else is decided by the size of the cut and the
// evidence attached to the deal.

export const SIGNALS = ["NEW LOW", "STRONG", "ROUTINE", "INFLATED"];

export const SIGNAL_TEXT = {
  "NEW LOW": "New low — the best price reported for this product.",
  STRONG: "Strong price — well below its list price.",
  ROUTINE: "Routine sale — an ordinary cut, said so honestly.",
  INFLATED: "Inflated sale — the 'was' price does not match recent selling prices.",
};

export function percentOff(d) {
  if (!d.was || d.was <= 0) return 0;
  return Math.round((1 - d.price / d.was) * 100);
}

export function savedUsd(d) {
  if (!d.was) return 0;
  return Math.round((d.was - d.price) * 100) / 100;
}

// Deal score for "Best deal first" sorting: percent off first, then dollars
// saved, then lower price. A pure percent sort would crown a $12 trinket over
// a $1,700 TV cut, so dollars saved breaks the tie.
export function dealScore(d) {
  return percentOff(d) * 100 + Math.min(savedUsd(d), 999);
}

export function signalClass(signal) {
  return "sig-" + signal.toLowerCase().replace(" ", "-");
}
