/*
  Stockist data — public entry point. Reads two sources and merges them:
    • stores.retail.json — RETAIL liquor stores, GENERATED from LiquorConnect
      (Connect Logistics / AGLC) by scripts/sync-stores.mjs. Do NOT hand-edit;
      run the sync (see below) and it rewrites this file.
    • stores.clubs.ts    — ON-PREMISE venues (bars/clubs), hand-maintained.

  Refresh retail from LiquorConnect:
    node scripts/sync-stores.mjs           # rewrite stores.retail.json from the live API
    node scripts/sync-stores.mjs --check   # report drift only, write nothing (CI-safe)
  Also runs weekly via .github/workflows/sync-stores.yml.

  Retail is sourced from the union of every store carrying a Zyra SKU:
    Root Beer Rush (144588) · Gold (141422) · Coco Mist (141421)
  `carries` lists which Zyra products each store actually stocks, so the page can
  say "In stock: Root Beer Rush" honestly. Root-Beer-Rush stores are listed first.
*/
import type { Store } from './stores.types';
import retailData from './stores.retail.json';
import { clubs } from './stores.clubs';

export type { Store, StoreType } from './stores.types';

const retail = retailData as Store[];

// Retail first (Root Beer Rush stores already ordered first by the sync), then clubs.
export const stores: Store[] = [...retail, ...clubs];

// Provinces present in the data, for the filter dropdown. Derived, never hand-kept.
export const provinces: string[] = [...new Set(stores.map((s) => s.province))].sort();

// True when any on-premise clubs are present — drives the category filter UI.
export const hasClubs: boolean = stores.some((s) => s.type === 'club');
