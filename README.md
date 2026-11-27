# black-friday-deal-finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun · rank](https://make.fun/badge/black-friday-deal-finder-01/muhammadaldy198/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![make.fun · reward](https://make.fun/badge/black-friday-deal-finder-01/muhammadaldy198/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

**DealProof — 74 verified Black Friday deals, 11 stores, 3 new lows.** A static deal-finder site for the make.fun bounty `black-friday-deal-finder-01`. Every deal was read at its store (or in a public deals roundup naming its store) on 27 November 2026, and carries its product, store, sale price, usual price, discount, store link, check time, source, and an honest verdict: NEW LOW, STRONG, or ROUTINE.

## What it does

- **74 deals** across 12 categories and 11 stores (Amazon, Best Buy, Walmart, Target, Kohl's, B&H, Newegg, Dell, Sony, Kate Spade Outlet, Wayfair).
- **Search + filters that work**: text search, category chips, store dropdown, discount presets (≥20% / ≥30% / ≥50%), NEW LOW only, and four sorts (best deal first, biggest % off, biggest $ saved, lowest price).
- **Deal pages** (`#/deal/<id>`): big price block, list-vs-today price bars, the verdict with its evidence, conditions (gift-card rules, Kohl's Cash, bundle contents), and a **same-product-across-stores** table where a second price was verified.
- **Compare page** (`#/compare`): every product verified at more than one store, cheapest highlighted.
- **How we check** (`#/method`): the four verdict levels, the check method, and the full source list.
- **No network loads**: vanilla JS, system type, no web fonts, no images copied from stores. Runs from static files on desktop and phone.

## Run it

```sh
node serve.ts        # app/ on http://localhost:8080
```

Hand it in (from the repo root):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` (copied from the kit unchanged).
