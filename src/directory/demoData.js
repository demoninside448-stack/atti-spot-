// DEMO records only: shown as a clearly labelled fallback when live OpenStreetMap data is unavailable.
// Real hand-entered businesses go in manualData.js, live OSM records come from osm.js.
import { locations } from './locations.js';
import { normalizeBusiness } from './normalize.js';

const T = [ // key, name, categories (first = primary), diet, featured
  ['south-indian', 'Demo South Indian Restaurant', ['south-indian', 'restaurant'], 'veg', true],
  ['biryani', 'Demo Biryani House', ['biryani', 'restaurant'], 'non-veg', true],
  ['mess', 'Demo Meals Mess', ['meals-mess'], 'both', true],
  ['chinese', 'Demo Chinese Kitchen', ['chinese', 'restaurant'], 'non-veg', true],
  ['fastfood', 'Demo Fast Food Corner', ['fast-food'], 'non-veg', false],
  ['cafe', 'Demo Cafe', ['cafe'], 'veg', false],
  ['bakery', 'Demo Bakery', ['bakery'], 'veg', false],
  ['sweets', 'Demo Sweet Shop', ['sweets'], 'veg', false],
  ['juice', 'Demo Juice Shop', ['juice'], 'veg', false],
  ['icecream', 'Demo Ice Cream Parlour', ['ice-cream'], 'veg', false],
  ['gaming', 'Demo Gaming Zone', ['gaming'], null, false],
  ['theatre', 'Demo Theatre', ['theatre'], null, false],
  ['park', 'Demo Park', ['park'], null, false],
  ['supermarket', 'Demo Supermarket', ['supermarket'], null, false],
  ['mall', 'Demo Shopping Centre', ['shopping-centre'], null, false],
];
const D = [ // dish name, food category, business key, diet
  ['Chicken Biryani', 'Biryani', 'biryani', 'non-veg'], ['Masala Dosa', 'Dosa', 'south-indian', 'veg'],
  ['Veg Meals', 'Meals', 'south-indian', 'veg'], ['Meals', 'Meals', 'mess', 'both'],
  ['Parotta & Salna', 'Parotta', 'mess', 'non-veg'], ['Chicken 65', 'Chicken', 'fastfood', 'non-veg'],
  ['Egg Fried Rice', 'Chinese', 'chinese', 'non-veg'], ['Tea', 'Drinks', 'cafe', 'veg'],
  ['Coffee', 'Drinks', 'cafe', 'veg'], ['Fresh Juice', 'Drinks', 'juice', 'veg'], ['Veg Puff', 'Snacks', 'bakery', 'veg'],
];

export const demoBusinesses = locations.flatMap((L) => T.map(([key, name, cats, diet], i) => {
  const a = i * 2.4, r = 0.004 * Math.sqrt(i + 1); // spread demo pins around the city centre
  return normalizeBusiness({ id: `${L.id}-${key}`, source: 'Demo', name, categories: cats, locationId: L.id, locality: `${L.name} (demo)`,
    lat: L.lat + r * Math.sin(a), lng: L.lng + r * Math.cos(a), diet, description: 'Demo record for layout testing. Not a real business.',
    verificationStatus: 'demo' });
}));
export const demoDishes = locations.flatMap((L) => D.map(([name, foodCategory, key, diet], i) => ({
  id: `${L.id}-dish-${i}`, name, foodCategory, businessId: `${L.id}-${key}`, locationId: L.id, diet,
  image: null, price: null, source: 'Demo' })));
