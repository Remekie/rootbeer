// Sync RETAIL stockists from LiquorConnect (Connect Logistics / AGLC) into
// src/lib/stores.retail.json.
//
//   node scripts/sync-stores.mjs           rewrite stores.retail.json from the live API
//   node scripts/sync-stores.mjs --check    report drift only, write nothing, exit 1 if drift
//
// It fetches every store carrying a Zyra SKU (Root Beer Rush / Gold / Coco Mist)
// from the public OData API the liquorconnect.com store-finder itself calls:
//   https://appapi.liquorconnect.com/odata/Products({id})/Suppliers
//
// Existing stores keep their curated fields (coords, hours, address casing); only
// `carries` is refreshed so "In stock" stays honest. New stores are built from the
// API (title-cased address/city, compact hours). Delisted stores are dropped.
// On-premise clubs live in stores.clubs.ts and are never touched here.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RETAIL_JSON = path.resolve(__dirname, '../src/lib/stores.retail.json');

const API = 'https://appapi.liquorconnect.com/odata/';
// SKU id -> display name. Listed in the canonical `carries` order (RBR first).
const SKUS = [
  ['144588', 'Root Beer Rush'],
  ['141422', 'Gold'],
  ['141421', 'Coco Mist'],
];
const CANON = SKUS.map(([, name]) => name);
const CHECK = process.argv.includes('--check');

// Coordinate fallbacks for the rare store the API returns without lat/lng.
const CITY_CENTRES = {
  edmonton: [53.5461, -113.4938],
  calgary: [51.0447, -114.0719],
  'st. albert': [53.6305, -113.6256],
  'sherwood park': [53.5417, -113.2958],
  'spruce grove': [53.545, -113.9008],
  'fort saskatchewan': [53.7128, -113.2135],
  'grande prairie': [55.1707, -118.7947],
  'medicine hat': [50.0405, -110.6764],
  'lac la biche': [54.7686, -111.9653],
  'rocky mountain house': [52.3766, -114.9188],
};
const AB_CENTROID = [53.9333, -116.5765];

// ── helpers ──────────────────────────────────────────────────────────────────
const idFromSlug = (slug) => {
  const m = String(slug).match(/(\d+)$/);
  return m ? m[1] : null;
};
const slugify = (name, id) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + id;

const KEEP_UPPER = new Set(['NW', 'NE', 'SW', 'SE', 'N', 'S', 'E', 'W']);
const titleCase = (str) =>
  String(str).trim().toLowerCase().split(/\s+/).map((w) => {
    if (KEEP_UPPER.has(w.toUpperCase())) return w.toUpperCase();
    return w
      .replace(/^([a-z])/, (c) => c.toUpperCase())
      .replace(/([-.'])([a-z])/g, (_m, p, c) => p + c.toUpperCase());
  }).join(' ');

const fmtTime = (t) => {
  if (!t) return null;
  const m = String(t).trim().toLowerCase().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (!m) return String(t).trim();
  const [, h, min, ap] = m;
  return h + (min !== '00' ? ':' + min : '') + ap[0];
};

const DAYS = [
  ['Monday', 'Mon'], ['Tuesday', 'Tue'], ['Wednesday', 'Wed'], ['Thursday', 'Thu'],
  ['Friday', 'Fri'], ['Saturday', 'Sat'], ['Sunday', 'Sun'],
];
const fmtHours = (api) => {
  const pairs = DAYS.map(([full, ab]) => {
    const o = fmtTime(api[full + 'Open']);
    const c = fmtTime(api[full + 'Close']);
    return { ab, txt: o && c ? `${o}–${c}` : null };
  });
  if (pairs.every((p) => !p.txt)) return undefined;
  // group consecutive days that share the same hours string
  const groups = [];
  for (const p of pairs) {
    const last = groups[groups.length - 1];
    if (last && last.txt === p.txt) last.end = p.ab;
    else groups.push({ start: p.ab, end: p.ab, txt: p.txt });
  }
  return groups
    .map((g) => {
      const label = g.start === g.end ? g.start : `${g.start}–${g.end}`;
      return g.txt ? `${label} ${g.txt}` : `${label} Closed`;
    })
    .join(' · ');
};

const coordsOf = (api) => {
  const lat = Number(api.Latitude);
  const lng = Number(api.Longitude);
  if (lat && lng && Math.abs(lat) > 1 && Math.abs(lng) > 1) return [lat, lng];
  const key = String(api.City || '').trim().toLowerCase();
  if (CITY_CENTRES[key]) {
    console.warn(`  ! ${api.Name?.trim()} has no API coords — using ${key} city centre`);
    return CITY_CENTRES[key];
  }
  console.warn(`  !! ${api.Name?.trim()} has no API coords and unknown city "${api.City}" — using AB centroid`);
  return AB_CENTROID;
};

const canonCarries = (set) => CANON.filter((c) => set.has(c));
const sameSet = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

const buildStore = (api, carriesSet) => {
  const [lat, lng] = coordsOf(api);
  const name = String(api.Name).trim();
  const store = {
    id: slugify(name, api.Id),
    type: 'retail',
    name,
    carries: canonCarries(carriesSet),
    address: titleCase(api.StreetAddress || ''),
    city: titleCase(api.City || ''),
    province: String(api.Province || 'AB').trim().toUpperCase(),
    postal: String(api.PostalCode || '').trim(),
  };
  const phone = String(api.Phone || '').trim();
  if (phone) store.phone = phone;
  const hours = fmtHours(api);
  if (hours) store.hours = hours;
  store.lat = lat;
  store.lng = lng;
  return store;
};

// ── fetch the live union ─────────────────────────────────────────────────────
async function fetchUnion() {
  const byId = new Map();
  for (const [id, sku] of SKUS) {
    const res = await fetch(`${API}Products(${id})/Suppliers`, {
      headers: { Accept: 'application/json', 'User-Agent': 'rootbeervodka-store-sync' },
    });
    if (!res.ok) throw new Error(`LiquorConnect ${sku} (${id}) -> HTTP ${res.status}`);
    const json = await res.json();
    const rows = json.value || [];
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error(`LiquorConnect ${sku} (${id}) returned 0 stores — refusing to wipe data`);
    }
    for (const row of rows) {
      const key = String(row.Id);
      if (!byId.has(key)) byId.set(key, { api: row, carries: new Set() });
      byId.get(key).carries.add(sku);
    }
    await new Promise((r) => setTimeout(r, 800)); // be polite to the API
  }
  return byId;
}

// ── reconcile prev retail.json against the live union ────────────────────────
function reconcile(prev, union) {
  const prevById = new Map(prev.map((s, i) => [idFromSlug(s.id), { store: s, order: i }]));
  const added = [], removedNames = [], carriesChanged = [];
  const merged = [];

  for (const [id, { api, carries }] of union) {
    const existing = prevById.get(id);
    if (existing) {
      const next = canonCarries(carries);
      if (sameSet(existing.store.carries, next)) {
        merged.push({ store: existing.store, order: existing.order });
      } else {
        carriesChanged.push(`${existing.store.name}: [${existing.store.carries}] -> [${next}]`);
        merged.push({ store: { ...existing.store, carries: next }, order: existing.order });
      }
    } else {
      const store = buildStore(api, carries);
      added.push(`${store.name} [${store.city}] carries: ${store.carries.join(', ')}`);
      merged.push({ store, order: Number.MAX_SAFE_INTEGER });
    }
  }
  for (const s of prev) {
    if (!union.has(idFromSlug(s.id))) removedNames.push(`${s.name} [${s.city}]`);
  }

  // Root-Beer-Rush stores first; existing keep their prior order; new ones append
  // within their group, tie-broken by name.
  merged.sort((a, b) => {
    const ga = a.store.carries.includes('Root Beer Rush') ? 0 : 1;
    const gb = b.store.carries.includes('Root Beer Rush') ? 0 : 1;
    if (ga !== gb) return ga - gb;
    if (a.order !== b.order) return a.order - b.order;
    return a.store.name.localeCompare(b.store.name);
  });

  return { next: merged.map((m) => m.store), added, removedNames, carriesChanged };
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  const prev = JSON.parse(fs.readFileSync(RETAIL_JSON, 'utf8'));
  const union = await fetchUnion();
  console.log(`Live union: ${union.size} unique retail stores across ${SKUS.length} Zyra SKUs`);

  const { next, added, removedNames, carriesChanged } = reconcile(prev, union);

  console.log(`\nSummary: +${added.length} added  -${removedNames.length} removed  ~${carriesChanged.length} carries-changed  (total ${next.length})`);
  if (added.length) console.log('  ADDED:\n' + added.map((a) => '    + ' + a).join('\n'));
  if (removedNames.length) console.log('  REMOVED:\n' + removedNames.map((a) => '    - ' + a).join('\n'));
  if (carriesChanged.length) console.log('  CARRIES:\n' + carriesChanged.map((a) => '    ~ ' + a).join('\n'));

  const nextJson = JSON.stringify(next, null, 2) + '\n';
  const prevJson = fs.readFileSync(RETAIL_JSON, 'utf8');
  const changed = nextJson !== prevJson;

  if (CHECK) {
    console.log(changed ? '\n--check: DRIFT detected (nothing written).' : '\n--check: up to date.');
    process.exit(changed ? 1 : 0);
  }
  if (!changed) {
    console.log('\nNo changes — stores.retail.json already up to date.');
    return;
  }
  fs.writeFileSync(RETAIL_JSON, nextJson);
  console.log('\nWrote src/lib/stores.retail.json');
}

main().catch((err) => {
  console.error('sync-stores failed:', err.message);
  process.exit(1);
});
