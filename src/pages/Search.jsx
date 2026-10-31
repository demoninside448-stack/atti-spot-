import { useSearchParams } from 'react-router-dom';
import { useAppLocation } from '../LocationContext.jsx';
import { useDirectory } from '../DirectoryContext.jsx';
import { searchBusinesses, searchDishes } from '../directory/index.js';
import { SearchBar, Empty, BusinessCard, DishCard } from '../components/Cards.jsx';
import DataBanner from '../components/DataBanner.jsx';

export default function Search() {
  const { location } = useAppLocation(); const dir = useDirectory();
  const [params, setParams] = useSearchParams(); const q = params.get('q') || '';
  const has = q.trim().length > 0;
  const bs = searchBusinesses(dir.businesses, q); const ds = searchDishes(dir.dishes, dir.businesses, q);
  return (
    <section className="container page">
      <h1>Search {location.name}</h1>
      <DataBanner />
      <SearchBar label="all" value={q} onChange={(v) => setParams(v ? { q: v } : {}, { replace: true })} placeholder="Business name, category, shop, cafe, gaming zone..." />
      {!has && <p className="empty">Type a business name or a category such as supermarket, cafe or gaming zone. Results are limited to {location.name}.</p>}
      {has && dir.status === 'loading' && <p className="empty">Loading...</p>}
      {has && dir.status !== 'loading' && !bs.length && !ds.length && <Empty text={`Nothing found for "${q.trim()}" in ${location.name}. Try a different word or clear the search.`} />}
      {bs.length > 0 && <><h2>Places ({bs.length})</h2><div className="grid">{bs.map((b) => <BusinessCard key={b.id} b={b} />)}</div></>}
      {ds.length > 0 && <><h2>Dishes ({ds.length})</h2><div className="grid">{ds.map((d) => <DishCard key={d.id} d={d} />)}</div></>}
    </section>
  );
}
