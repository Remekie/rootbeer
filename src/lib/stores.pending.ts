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
  two brands. Normally this brand (Root Beer Rush) only lists stores carrying
  it; the GREAT CANADIAN LIQUOR block below is a deliberate exception (see
  WHOLE-CHAIN RESTORE) — none of these stores carry Root Beer Rush, they're
  listed with their real carries (Gold / Coco Mist) at the user's request.

  WHOLE-CHAIN RESTORE (2026-11-05): LiquorConnect's feed dropped GREAT CANADIAN
  LIQUOR from 18 locations (2026-09-28 sync) to 1 (2026-10-26 sync) over three
  weekly syncs — chain-specific, not a feed-wide outage (other suppliers'
  counts held steady). The entries below restore the chain's full 22-location
  roster — id/address/postal/phone/hours/lat/lng are LiquorConnect's own, taken
  from the last sync that still listed each store (2026-08-31, before the drop
  started) — cross-checked against greatcanadianliquor.com/locations/, which
  still lists all of them as open. Same removal rule applies: once a sync's
  "ADDED" log shows one of these again, delete it here.
*/
export const pending: Store[] = [
  {
    // Sales report 2026-07-21, Zyra Gold (SKU 141422), licence 76978100.
    // LiquorConnect returned no coordinates; Dickinsfield Mall sits in the
    // Dickinsfield/Thickwood area of north Fort McMurray (Nominatim).
    // Likely the same physical store greatcanadianliquor.com/locations/ lists
    // as its "Fort McMurray" location (3-142 Dickins Dr, same postal T9K 1X4,
    // Dickins Dr runs past Dickinsfield Mall) — not added separately below.
    id: 'rocky-mountain-liquor-50155',
    type: 'retail',
    name: 'ROCKY MOUNTAIN LIQUOR',
    carries: ['Gold'],
    address: 'Dickinsfield Mall',
    city: 'Fort McMurray',
    province: 'AB',
    postal: 'T9K 1X4',
    phone: '(780) 791-9900',
    lat: 56.7372,
    lng: -111.47,
  },
  {
    // Sales report 2026-07-21, Zyra Gold (SKU 141422) + Coco Mist (SKU 141421),
    // licence 76870400. LiquorConnect lists this supplier under the banner name
    // "GREAT CANADIAN LIQUOR"; the storefront trades as Ye Olde Gibbons Liquor
    // Store. Coordinates are LiquorConnect's own.
    id: 'great-canadian-liquor-50046',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold', 'Coco Mist'],
    address: '4620 50 Avenue',
    city: 'Gibbons',
    province: 'AB',
    postal: 'T0A 1N0',
    phone: '(780) 923-3474',
    lat: 53.827983,
    lng: -113.324093,
  },
  {
    // Sales report 2026-07-21, Zyra Gold (SKU 141422), licence 76870500.
    // LiquorConnect banner name "GREAT CANADIAN LIQUOR"; storefront trades as
    // Andersons Liquor. Coordinates are LiquorConnect's own.
    id: 'great-canadian-liquor-50047',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '3-102 Erie Street',
    city: 'Devon',
    province: 'AB',
    postal: 'T9G 2J4',
    phone: '(780) 987-5411',
    lat: 53.359343,
    lng: -113.728678,
  },
  {
    // Sales report 2026-07-21, Zyra Gold (SKU 141422). Resolved via the
    // LiquorConnect Suppliers city filter (Wetaskiwin). Coordinates are
    // LiquorConnect's own.
    id: 'great-canadian-liquor-50049',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '5117 50 Street',
    city: 'Wetaskiwin',
    province: 'AB',
    postal: 'T9A 1K1',
    phone: '(780) 352-7497',
    lat: 52.971124,
    lng: -113.373203,
  },
  {
    id: 'great-canadian-liquor-50074',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '4710 50 Avenue',
    city: 'Athabasca',
    province: 'AB',
    postal: 'T9S 1C1',
    phone: '(780) 675-2163',
    hours: 'Mon–Tue 10a–10p · Wed 10a–11p · Thu 10p–11p · Fri–Sat 10a–12a · Sun 10a–10p',
    lat: 54.720908,
    lng: -113.28235,
  },
  {
    id: 'great-canadian-liquor-50048',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '4808 50 Street',
    city: 'Athabasca',
    province: 'AB',
    postal: 'T9S 1C9',
    phone: '(780) 675-1154',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 54.718409,
    lng: -113.285425,
  },
  {
    id: 'great-canadian-liquor-50496',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '109-5001 30 Avenue',
    city: 'Beaumont',
    province: 'AB',
    postal: 'T4X 1T9',
    phone: '(780) 929-6800',
    hours: 'Mon–Tue 10a–11p · Wed 10:–11p · Thu 10a–11p · Fri–Sat 10a–12a · Sun 10a–11p',
    lat: 53.3525,
    lng: -113.4151,
  },
  {
    id: 'great-canadian-liquor-50063',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '3 West Valley Centre',
    city: 'Cochrane',
    province: 'AB',
    postal: 'T4C 1M1',
    phone: '(403) 932-0530',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 51.1875,
    lng: -114.4711,
  },
  {
    id: 'great-canadian-liquor-50253',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '11478 149 St NW',
    city: 'Edmonton',
    province: 'AB',
    postal: 'T5M 1W7',
    phone: '(780) 451-5384',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 53.565194,
    lng: -113.578593,
  },
  {
    id: 'great-canadian-liquor-50580',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '11020 101 Avenue',
    city: 'Fairview',
    province: 'AB',
    postal: 'T0H 1L0',
    phone: '(780) 835-2555',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 56.066028,
    lng: -118.38578,
  },
  {
    id: 'great-canadian-liquor-50064',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '542 24 Street',
    city: 'Fort Macleod',
    province: 'AB',
    postal: 'T0L 0Z0',
    phone: '(403) 553-4877',
    lat: 49.725298,
    lng: -113.398691,
  },
  {
    id: 'great-canadian-liquor-50483',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '103-11710 102 Street',
    city: 'Grande Prairie',
    province: 'AB',
    postal: 'T8V 7S7',
    phone: '(780) 532-6404',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 55.186755,
    lng: -118.802448,
  },
  {
    // LiquorConnect lists this location under the banner "THE GREAT CANADIAN
    // LIQUOR COMPANY" (not the shorter "GREAT CANADIAN LIQUOR" used elsewhere).
    id: 'the-great-canadian-liquor-co-50179',
    type: 'retail',
    name: 'THE GREAT CANADIAN LIQUOR COMPANY',
    carries: ['Gold'],
    address: '10108 101 Avenue',
    city: 'Lac La Biche',
    province: 'AB',
    postal: 'T0A 2C0',
    phone: '(780) 483-8183',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 54.770457,
    lng: -111.976953,
  },
  {
    id: 'great-canadian-liquor-50217',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '124 Columbia Boulevard W',
    city: 'Lethbridge',
    province: 'AB',
    postal: 'T1K 4J4',
    phone: '(403) 329-6996',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 49.675324,
    lng: -112.873876,
  },
  {
    // Trades as "THE GREAT CANADIAN LIQUOR COMPANY" at this Sunridge location.
    id: 'the-great-canadian-liquor-company-50608',
    type: 'retail',
    name: 'THE GREAT CANADIAN LIQUOR COMPANY',
    carries: ['Gold'],
    address: '10-117 Sunridge Road W',
    city: 'Lethbridge',
    province: 'AB',
    postal: 'T1J 5J1',
    phone: '(403) 329-4344',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 49.6946,
    lng: -112.8331,
  },
  {
    id: 'great-canadian-liquor-50053',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '10012 103 Street',
    city: 'Morinville',
    province: 'AB',
    postal: 'T8R 1R7',
    phone: '(780) 939-4743',
    hours: 'Mon–Wed 10a–11p · Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 53.802588,
    lng: -113.651777,
  },
  {
    id: 'great-canadian-liquor-50052',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '9513 100 Street',
    city: 'Morinville',
    province: 'AB',
    postal: 'T8R 1R2',
    phone: '(780) 939-4203',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 53.795926,
    lng: -113.644396,
  },
  {
    // LiquorConnect lists this location under the banner "GREAT CANADIAN
    // LIQUOR COMPANY" (not the shorter "GREAT CANADIAN LIQUOR" used elsewhere).
    id: 'great-canadian-liquor-compan-50062',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR COMPANY',
    carries: ['Gold'],
    address: '4515 47 Avenue',
    city: 'Rocky Mountain House',
    province: 'AB',
    postal: 'T4T 1C5',
    phone: '(403) 847-1011',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 52.370045,
    lng: -114.911279,
  },
  {
    id: 'great-canadian-liquor-50917',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '101 2 Avenue NW',
    city: 'Slave Lake',
    province: 'AB',
    postal: 'T0G 2A0',
    phone: '(780) 483-8183',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 55.282454,
    lng: -114.772464,
  },
  {
    id: 'great-canadian-liquor-50169',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '4309 50 Avenue',
    city: 'St Paul',
    province: 'AB',
    postal: 'T0A 3A3',
    phone: '(780) 645-5484',
    hours: 'Mon–Thu 10–11p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 53.990979,
    lng: -111.277049,
  },
  {
    id: 'great-canadian-liquor-50051',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '10-5004 46 Street',
    city: 'Sylvan Lake',
    province: 'AB',
    postal: 'T4S 1C2',
    phone: '(403) 887-3581',
    hours: 'Mon–Wed 10–11p · Thu 10–1p · Fri–Sat 10–12a · Sun 10–11p',
    lat: 52.309942,
    lng: -114.092558,
  },
  {
    // Listed on greatcanadianliquor.com/locations/ as "Sylvan Lake South" but
    // never seen in LiquorConnect's feed — no supplier Id to reuse, so `id` is
    // a stable synthetic slug and the sync will never match/absorb it.
    // Coordinates geocoded via OpenStreetMap Nominatim (rooftop match).
    id: 'great-canadian-liquor-sylvan-lake-south',
    type: 'retail',
    name: 'GREAT CANADIAN LIQUOR',
    carries: ['Gold'],
    address: '4413 50 Street',
    city: 'Sylvan Lake',
    province: 'AB',
    postal: 'T4S 1J9',
    lat: 52.3004646,
    lng: -114.09699,
  },
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
  {
    // AGLC sales confirm Root Beer Rush (SKU 144588), licence 78391700. Full
    // record from LiquorConnect (Suppliers?$filter=Number eq 78391700),
    // EstablishmentType "Liquor Store" (Retail Liquor Store - Private).
    // Coordinates are LiquorConnect's own.
    id: '99-liquor-link-52693',
    type: 'retail',
    name: '99 LIQUOR LINK',
    carries: ['Root Beer Rush'],
    address: '9855 63 Avenue NW',
    city: 'Edmonton',
    province: 'AB',
    postal: 'T6E 0G7',
    phone: '(780) 431-2685',
    lat: 53.499448,
    lng: -113.485591,
  },
];
