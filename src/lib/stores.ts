/*
  Stockist data — public entry point. Reads three sources and merges them:
    • stores.retail.json — RETAIL liquor stores, GENERATED from LiquorConnect
      (Connect Logistics / AGLC) by scripts/sync-stores.mjs. Do NOT hand-edit;
      run the sync (see below) and it rewrites this file.
    • stores.pending.ts  — real, verified retail stores not yet showing up in
      LiquorConnect's public directory. Hand-maintained; see its own header.
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
import { pending } from './stores.pending';
import { clubs } from './stores.clubs';

export type { Store, StoreType } from './stores.types';

const retail = retailData as Store[];

// Merge retail + pending by supplier id. A pending entry whose id matches a
// retail row folds its `carries` onto that row (set union) instead of adding a
// second pin — this is how a store already in the live feed for one SKU (say
// Coco Mist) gets its other verified SKUs shown before LiquorConnect lists them.
// Retail fields win (they are the live-API source of truth); only carries merge.
// A pending entry with a brand-new id is appended as its own store.
function mergeById(base: Store[], extra: Store[]): Store[] {
  const byId = new Map<string, Store>();
  for (const s of base) byId.set(s.id, s);
  for (const s of extra) {
    const existing = byId.get(s.id);
    byId.set(
      s.id,
      existing
        ? { ...existing, carries: [...new Set([...existing.carries, ...s.carries])] }
        : s,
    );
  }
  return [...byId.values()];
}

// Retail first (Root Beer Rush stores already ordered first by the sync) with
// pending folded in by id, then clubs.
export const stores: Store[] = [...mergeById(retail, pending), ...clubs];

// Provinces present in the data, for the filter dropdown. Derived, never hand-kept.
export const provinces: string[] = [...new Set(stores.map((s) => s.province))].sort();

// True when any on-premise clubs are present — drives the category filter UI.
export const hasClubs: boolean = stores.some((s) => s.type === 'club');
