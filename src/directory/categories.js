// Extensible category list. A business lists one or more category ids (first = primary).
export const categories = [
  { id: 'restaurant', label: 'Hotels & Restaurants', group: 'food', icon: '🍽️' },
  { id: 'south-indian', label: 'South Indian', group: 'food', icon: '🥞' },
  { id: 'biryani', label: 'Biryani', group: 'food', icon: '🍛' },
  { id: 'meals-mess', label: 'Meals & Mess', group: 'food', icon: '🍱' },
  { id: 'fast-food', label: 'Fast Food & Street Food', group: 'food', icon: '🍔' },
  { id: 'chinese', label: 'Chinese', group: 'food', icon: '🍜' },
  { id: 'cafe', label: 'Cafe & Coffee', group: 'food', icon: '☕' },
  { id: 'bakery', label: 'Bakery', group: 'food', icon: '🥐' },
  { id: 'sweets', label: 'Sweets', group: 'food', icon: '🍬' },
  { id: 'juice', label: 'Juice Shop', group: 'food', icon: '🧃' },
  { id: 'ice-cream', label: 'Ice Cream', group: 'food', icon: '🍦' },
  { id: 'supermarket', label: 'Supermarket', group: 'shopping', icon: '🛒' },
  { id: 'grocery', label: 'Grocery', group: 'shopping', icon: '🧺' },
  { id: 'shopping-centre', label: 'Shopping Centre', group: 'shopping', icon: '🛍️' },
  { id: 'clothing', label: 'Clothing Shop', group: 'shopping', icon: '👕' },
  { id: 'mobile-shop', label: 'Mobile Shop', group: 'shopping', icon: '📱' },
  { id: 'electronics', label: 'Electronics Shop', group: 'shopping', icon: '🔌' },
  { id: 'hardware', label: 'Hardware Shop', group: 'shopping', icon: '🔧' },
  { id: 'gaming', label: 'Gaming Zone', group: 'fun', icon: '🎮' },
  { id: 'theatre', label: 'Theatre & Cinema', group: 'fun', icon: '🎬' },
  { id: 'park', label: 'Park', group: 'fun', icon: '🌳' },
  { id: 'tourist', label: 'Tourist Attraction', group: 'fun', icon: '📸' },
  { id: 'hangout-other', label: 'Other Hangout', group: 'fun', icon: '✨' },
];
export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
export const groupLabels = { food: 'Food & Dining', shopping: 'Shopping & Retail', fun: 'Entertainment & Hangout' };
export const catsOf = (b) => [b.primaryCategory, ...(b.categoryTags || [])].filter(Boolean);
export const categoryLabels = (b) => catsOf(b).map((c) => categoryById[c]?.label).filter(Boolean);

// The nine map discovery groups (marker colour/icon + categories they include).
export const mapGroups = [
  { id: 'restaurants', label: 'Hotels & Restaurants', icon: '🍽️', color: '#f97316', categories: ['restaurant', 'south-indian', 'biryani', 'meals-mess', 'chinese'] },
  { id: 'cafes', label: 'Cafes & Coffee', icon: '☕', color: '#92400e', categories: ['cafe'] },
  { id: 'bakeries', label: 'Bakeries & Sweets', icon: '🥐', color: '#db2777', categories: ['bakery', 'sweets'] },
  { id: 'juice', label: 'Juice & Ice Cream', icon: '🍦', color: '#0891b2', categories: ['juice', 'ice-cream'] },
  { id: 'fastfood', label: 'Fast & Street Food', icon: '🍔', color: '#dc2626', categories: ['fast-food'] },
  { id: 'gaming', label: 'Gaming Zones', icon: '🎮', color: '#7c3aed', categories: ['gaming'] },
  { id: 'theatres', label: 'Theatres & Cinemas', icon: '🎬', color: '#b91c1c', categories: ['theatre'] },
  { id: 'parks', label: 'Parks & Hangouts', icon: '🌳', color: '#16a34a', categories: ['park', 'tourist', 'hangout-other'] },
  { id: 'shopping', label: 'Supermarkets & Grocery', icon: '🛒', color: '#2563eb', categories: ['supermarket', 'grocery', 'shopping-centre'] },
  { id: 'retail', label: 'Shops & Retail', icon: '🛍️', color: '#0f766e', categories: ['clothing', 'mobile-shop', 'electronics', 'hardware'] },
];
export const allMapCategories = mapGroups.flatMap((g) => g.categories);
export const groupOf = (b) => mapGroups.find((g) => g.categories.includes(b.primaryCategory)) || mapGroups.find((g) => catsOf(b).some((c) => g.categories.includes(c))) || mapGroups[0];

// Page views are just category sets over the SAME directory.
export const restaurantFilters = { 'South Indian': ['south-indian'], Biryani: ['biryani'], Chinese: ['chinese'], 'Fast Food': ['fast-food'], Cafe: ['cafe'], Meals: ['meals-mess'] };
export const restaurantPageCategories = ['restaurant', 'south-indian', 'biryani', 'meals-mess', 'chinese', 'fast-food', 'cafe'];
export const hangoutTabs = { Cafes: ['cafe'], Gaming: ['gaming'], Parks: ['park'], Theatres: ['theatre'], Other: ['tourist', 'hangout-other'] };
export const hangoutPageCategories = Object.values(hangoutTabs).flat();
export const hangoutHomeCategories = ['gaming', 'park', 'theatre'];
export const shoppingFilters = { Supermarkets: ['supermarket'], Grocery: ['grocery'], Clothes: ['clothing'], Mobile: ['mobile-shop'], Electronics: ['electronics'], Hardware: ['hardware'], 'Shopping Centres': ['shopping-centre'] };
export const shoppingPageCategories = Object.values(shoppingFilters).flat();
export const foodChips = {
  Biryani: { cats: ['biryani'], dishes: ['Biryani', 'Chicken'] }, 'South Indian': { cats: ['south-indian'], dishes: ['Dosa'] },
  Meals: { cats: ['meals-mess'], dishes: ['Meals', 'Parotta'] }, Chinese: { cats: ['chinese'], dishes: ['Chinese'] },
  'Fast Food': { cats: ['fast-food'], dishes: ['Chicken', 'Snacks'] }, Cafes: { cats: ['cafe'], dishes: ['Drinks'] },
  'Bakery & Sweets': { cats: ['bakery', 'sweets'], dishes: ['Snacks'] }, 'Juice & Ice Cream': { cats: ['juice', 'ice-cream'], dishes: ['Drinks'] } };
export const foodPageCategories = [...new Set([...restaurantPageCategories, ...Object.values(foodChips).flatMap((c) => c.cats)])];
