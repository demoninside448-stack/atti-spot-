// Hand-entered businesses (clearly labelled "Manually added"). Add a record ONCE here and it appears everywhere.
// Use verificationStatus:'verified' only after you have checked the details yourself. Example (remove the // to use):
// { id:'manual-attur-example', source:'Manual', name:'Example Store', categories:['supermarket'], locationId:'attur',
//   address:'...', locality:'...', lat:11.59, lng:78.60, phone:null, website:null, openingHours:null,
//   verificationStatus:'unverified', updatedAt:'2026-10-30' }
import { normalizeBusiness } from './normalize.js';
const raw = [];
export const manualBusinesses = raw.map(normalizeBusiness);
export const manualDishes = []; // { id, name, foodCategory, businessId, locationId, diet, price:null, source:'Manual' }
