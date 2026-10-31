# Atti Spot
Windows (Node.js LTS installed): in this folder run `npm install`, then `npm run dev` -> http://localhost:5173 ; `npm run build` checks the production build.

## Central directory (src/directory + src/DirectoryContext.jsx)
- normalize.js   canonical record: id, source, sourceId, name, primaryCategory, categoryTags, locationId, address, lat/lng, phone, website, openingHours, verificationStatus, updatedAt
- categories.js  categories, 3 top-level groups, map groups, which categories each page shows
- osm.js         Overpass loader: ONE query per location (5 km radius, max 400 elements), explicit tag->category table (TAGS), 24h cache, shared in-flight request, retry
- manualData.js  hand-entered businesses (labelled "Manually added"); add a record ONCE and it appears on every relevant page
- demoData.js    demo records, shown only as a labelled fallback when live data fails or is empty
- index.js       pure query functions (by category, search, featured, dishes...)
Every page reads the same list through useDirectory(); map markers, cards, search and details use the same record id.

## Limits
OpenStreetMap coverage is incomplete and unverified. Menus, dish prices, ratings and photos are not provided by OSM, so they are never shown unless entered manually.
