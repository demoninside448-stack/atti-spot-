// Live OpenStreetMap data via the free Overpass API. ONE combined query per location (not per page/category),
// cached in memory + localStorage for 24h, concurrent calls share one request, and failures throw readable errors.
// Coverage: places with a name within RADIUS_M of the location centre, capped at MAX elements. OSM is incomplete.
import { normalizeBusiness, hasCoords } from './normalize.js';

export const RADIUS_M = 5000, MAX = 400, TTL = 24 * 3600 * 1000;
// Explicit tag -> category mapping (edit here to change how OSM tags land in Atti Spot categories).
export const TAGS = {
  amenity: { restaurant: 'restaurant', cafe: 'cafe', fast_food: 'fast-food', food_court: 'fast-food', ice_cream: 'ice-cream', cinema: 'theatre', theatre: 'theatre' },
  shop: { bakery: 'bakery', confectionery: 'sweets', ice_cream: 'ice-cream', supermarket: 'supermarket', convenience: 'grocery', greengrocer: 'grocery',
    mall: 'shopping-centre', department_store: 'shopping-centre', clothes: 'clothing', mobile_phone: 'mobile-shop', electronics: 'electronics', hardware: 'hardware' },
  leisure: { park: 'park', garden: 'park', amusement_arcade: 'gaming', adult_gaming_centre: 'gaming' },
  tourism: { attraction: 'tourist' },
};
const FOOD = ['restaurant', 'fast-food', 'cafe'];
const ENDPOINTS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

export const buildQuery = (loc) => `[out:json][timeout:25];(${Object.entries(TAGS).map(([k, v]) =>
  `nwr["${k}"~"^(${Object.keys(v).join('|')})$"](around:${RADIUS_M},${loc.lat},${loc.lng});`).join('')});out center ${MAX};`;

export function toBusiness(e, loc, fetchedAt) {
  const t = e.tags || {}; if (!t.name) return null;
  let primary = null;
  for (const [k, m] of Object.entries(TAGS)) if (t[k] && m[t[k]]) { primary = m[t[k]]; break; }
  if (!primary) return null;
  const tags = []; const cu = t.cuisine || '';
  if (FOOD.includes(primary)) {
    if (/biryani/.test(cu)) tags.push('biryani'); if (/south_indian|dosa|idli/.test(cu)) tags.push('south-indian');
    if (/chinese/.test(cu)) tags.push('chinese'); if (/juice/.test(cu)) tags.push('juice');
  }
  const street = [t['addr:housenumber'], t['addr:street']].filter(Boolean).join(' ');
  const locality = t['addr:suburb'] || t['addr:city'] || '';
  const address = [street, t['addr:suburb'], t['addr:city']].filter(Boolean).join(', ') || null;
  const b = normalizeBusiness({ id: `osm-${e.type}-${e.id}`, source: 'OpenStreetMap', sourceId: `${e.type}/${e.id}`, name: t.name,
    categories: [primary, ...tags], locationId: loc.id, address, locality, lat: e.lat ?? e.center?.lat, lng: e.lon ?? e.center?.lon,
    phone: t.phone || t['contact:phone'] || null, website: t.website || t['contact:website'] || null, openingHours: t.opening_hours || null,
    cuisine: cu || null, diet: t['diet:vegetarian'] === 'only' ? 'veg' : t['diet:vegetarian'] === 'no' ? 'non-veg' : null,
    verificationStatus: 'unverified', updatedAt: fetchedAt });
  return hasCoords(b) ? b : null;
}

const mem = new Map(), inflight = new Map();
const key = (id) => `atti-spot:osm:v1:${id}`;
export function readCache(id) {
  if (mem.has(id) && Date.now() - mem.get(id).fetchedAtMs < TTL) return mem.get(id);
  try { const j = JSON.parse(localStorage.getItem(key(id)));
    if (j && Array.isArray(j.items) && Date.now() - j.fetchedAtMs < TTL) { mem.set(id, j); return j; } } catch { /* no cache */ }
  return null;
}
export function loadLocation(loc, { force = false } = {}) {
  if (!force) { const c = readCache(loc.id); if (c) return Promise.resolve(c); }
  if (inflight.has(loc.id)) return inflight.get(loc.id); // never fire duplicate concurrent requests
  const run = async () => {
    let last;
    for (const url of ENDPOINTS) {
      const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 30000);
      try {
        const res = await fetch(url, { method: 'POST', signal: ctrl.signal, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(buildQuery(loc)) });
        if (res.status === 429) throw new Error('OpenStreetMap is limiting requests right now. Please retry in a minute.');
        if (!res.ok) throw new Error(`The OpenStreetMap server answered ${res.status}.`);
        const json = await res.json(); const els = json.elements || []; const iso = new Date().toISOString(); const seen = new Map();
        els.forEach((e) => { const b = toBusiness(e, loc, iso); if (b && !seen.has(b.id)) seen.set(b.id, b); }); // same element = one record
        const result = { fetchedAt: iso, fetchedAtMs: Date.now(), items: [...seen.values()], capped: els.length >= MAX };
        mem.set(loc.id, result); try { localStorage.setItem(key(loc.id), JSON.stringify(result)); } catch { /* storage full/unavailable */ }
        return result;
      } catch (e) { last = e.name === 'AbortError' ? new Error('OpenStreetMap took too long to respond.') : e; } finally { clearTimeout(timer); }
    }
    throw last || new Error('Could not load OpenStreetMap data.');
  };
  const p = run().finally(() => { inflight.delete(loc.id); });
  inflight.set(loc.id, p); return p;
}
