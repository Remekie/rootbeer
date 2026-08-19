import type { Store } from './stores.types';

/*
  PENDING RETAIL — real, verified stores confirmed from an AGLC sales report
  that don't yet appear in LiquorConnect's public product-supplier feed.
  scripts/sync-stores.mjs rebuilds stores.retail.json ENTIRELY from the live
  API on every run, so adding these there would get wiped by the next sync
  (weekly, via .github/workflows/sync-stores.yml). They live here instead,
  hand-maintained, until LiquorConnect lists them against a Zyra SKU.

  Every field below is authoritative from LiquorConnect's own licensee record
  (queried by the report's licence number:
  appapi.liquorconnect.com/odata/Suppliers?$filter=Number eq <lic>), so the
  address, phone and postal code will match verbatim once the sync picks them
  up. `id` reuses the same LiquorConnect internal supplier Id the sync would
  assign, so the auto-generated slug will be identical.

  IMPORTANT: once a sync run's "ADDED" log shows one of these (match by name +
  city), delete its entry here — stores.retail.json becomes the source of
  truth for it, and leaving both double-lists the store.

  CARRIES TOP-UP: a pending entry may instead patch a store already in the live
  feed under one SKU. Give it the SAME `id` as the retail row and list every
  verified SKU; stores.ts unions carries by id, so the store shows all its SKUs
  on one pin (retail fields win). Remove it once the feed lists every SKU itself.

  Kept in step with the sibling drinkzyra repo's stores.pending.ts — one tool,
  two brands. This brand (Root Beer Rush) only lists stores carrying it.
*/
export const pending: Store[] = [
  {
    // Sales report 2026-07-21, Root Beer Rush (SKU 144588), licence 77322500.
    // Coordinates are LiquorConnect's own (not geocoded).
    id: 'tj-s-liquor-50572',
    type: 'retail',
    name: "TJ'S LIQUOR",
    carries: ['Root Beer Rush'],
    address: 'A-404 Mayor Magrath Dr N',
    city: 'Lethbridge',
    province: 'AB',
    postal: 'T1H 6H7',
    phone: '(403) 331-3000',
    lat: 49.70361,
    lng: -112.810129,
  },
  {
    // Sales report: Root Beer Rush (SKU 144588), 750ml x 12, licence 80388800.
    // LiquorConnect serves a consumer store page (Stores/890297) but exposes no
    // OData Suppliers directory record (both the licence-number and name filters
    // return nothing), so the weekly sync can't see it. `id` is a stable
    // synthetic slug (no numeric supplier Id to reuse, so the sync will never
    // match/absorb it). Coordinates geocoded to 1830 52 St SE, Calgary
    // (Clayburn Centre) via Nominatim.
    id: 'liquorsea',
    type: 'retail',
    name: 'LIQUORSEA',
    carries: ['Root Beer Rush'],
    address: '140-1830 52 Street SE',
    city: 'Calgary',
    province: 'AB',
    postal: 'T2B 1N1',
    phone: '(403) 401-3417',
    lat: 51.0365,
    lng: -113.957561,
  },
  {
    // Carries top-up (not a missing store). LiquorConnect lists JACK'S under
    // Coco Mist only (SKU 141421); AGLC sales confirm it also stocks Gold
    // (141422) and Root Beer Rush (144588). Same `id` as the retail row
    // (supplier 53348), so stores.ts unions these onto it — one pin, all three.
    // Jack's carries Root Beer Rush, so it belongs on this brand's list too.
    // Fields mirror the retail row as a fallback; retail (live API) wins while
    // it exists. Drop this once the feed lists Gold + Root Beer Rush too.
    id: 'jack-s-liquor-store-53348',
    type: 'retail',
    name: "JACK'S LIQUOR STORE",
    carries: ['Coco Mist', 'Gold', 'Root Beer Rush'],
    address: '9012 50 St NW',
    city: 'Edmonton',
    province: 'AB',
    postal: 'T6B 2Z5',
    phone: '(780) 490-7631',
    hours: 'Mon 10a–10p · Tue–Thu 10–10p · Fri 10–12a · Sat 10–11p · Sun 10–10p',
    lat: 53.522398,
    lng: -113.419249,
  },
];
