// Canonical business record. Every source (OSM, manual, demo) is normalised to this shape.
// Missing values stay null/empty: nothing is invented. `categories` is a derived convenience (primary + tags).
export function normalizeBusiness(r) {
  const cats = r.categories || [r.primaryCategory, ...(r.categoryTags || [])];
  return {
    id: r.id, source: r.source || 'Manual', sourceId: r.sourceId ?? null, name: r.name,
    primaryCategory: cats[0], categoryTags: cats.slice(1), categories: cats, locationId: r.locationId,
    address: r.address ?? null, locality: r.locality || '', lat: r.lat, lng: r.lng,
    phone: r.phone ?? null, website: r.website ?? null, openingHours: r.openingHours ?? null,
    description: r.description || '', images: r.images || [], cuisine: r.cuisine ?? null, diet: r.diet ?? null,
    verificationStatus: r.verificationStatus || 'unverified', updatedAt: r.updatedAt ?? null,
  };
}
export const hasCoords = (b) => Number.isFinite(b.lat) && Number.isFinite(b.lng);
