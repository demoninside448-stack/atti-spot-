// Pure query functions over a list of canonical records. Pages get the list from useDirectory().
import { catsOf, categoryLabels } from './categories.js';
export { locations } from './locations.js';
export * from './categories.js';

const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
export const matches = (q, ...fields) => norm(fields.join(' ')).includes(norm(q));
export const dedupe = (list) => [...new Map(list.map((b) => [b.id, b])).values()];
export const byLocation = (list, loc) => list.filter((b) => b.locationId === loc);
export const byId = (list, id) => list.find((b) => b.id === id) || null;
// A business is returned once even when several of its categories match.
export const byCategories = (list, cats) => list.filter((b) => catsOf(b).some((c) => cats.includes(c)));
export const completeness = (b) => ['phone', 'openingHours', 'website', 'address'].filter((k) => b[k]).length;
export const featured = (list, cats, n = 4) => [...byCategories(list, cats)].sort((a, b) => completeness(b) - completeness(a) || a.name.localeCompare(b.name)).slice(0, n);
export const searchBusinesses = (list, q) => (norm(q) ? dedupe(list.filter((b) => matches(q, b.name, categoryLabels(b).join(' '), b.address, b.locality, b.cuisine))) : []);
export const dishesFor = (dishes, businessId) => dishes.filter((d) => d.businessId === businessId);
export const searchDishes = (dishes, list, q) => (norm(q) ? dishes.filter((d) => matches(q, d.name, d.foodCategory, byId(list, d.businessId)?.name)) : []);
export const dietOk = (b, diet) => diet === 'All' || b.diet === 'both' || (diet === 'Veg' ? b.diet === 'veg' : b.diet === 'non-veg');
