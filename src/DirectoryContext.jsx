import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useAppLocation } from './LocationContext.jsx';
import { demoBusinesses, demoDishes } from './directory/demoData.js';
import { manualBusinesses, manualDishes } from './directory/manualData.js';
import { readCache, loadLocation, RADIUS_M, MAX } from './directory/osm.js';
import { dedupe, byLocation, byId } from './directory/index.js';

const Ctx = createContext(null);
export function DirectoryProvider({ children }) {
  const { location } = useAppLocation();
  const [live, setLive] = useState({}); // locationId -> { items, fetchedAt, capped }
  const [state, setState] = useState({ status: 'loading', error: '' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const cached = readCache(location.id);
    if (cached && attempt === 0) { setLive((p) => ({ ...p, [location.id]: cached })); setState({ status: 'ok', error: '' }); return undefined; }
    setState({ status: 'loading', error: '' });
    loadLocation(location, { force: attempt > 0 })
      .then((r) => { if (!cancelled) { setLive((p) => ({ ...p, [location.id]: r })); setState({ status: 'ok', error: '' }); } })
      .catch((e) => { if (!cancelled) setState({ status: 'error', error: e.message || 'Could not load live data.' }); });
    return () => { cancelled = true; };
  }, [location, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  const value = useMemo(() => {
    const here = live[location.id];
    const status = here ? 'ok' : state.status === 'error' ? 'error' : 'loading';
    const manual = byLocation(manualBusinesses, location.id);
    const usingDemo = status === 'error' || (status === 'ok' && !here.items.length && !manual.length);
    const businesses = dedupe([...manual, ...(here?.items || []), ...(usingDemo ? byLocation(demoBusinesses, location.id) : [])]);
    const ids = new Set(businesses.map((b) => b.id));
    const dishes = [...manualDishes, ...demoDishes].filter((d) => ids.has(d.businessId));
    const everything = dedupe([...manualBusinesses, ...Object.values(live).flatMap((l) => l.items), ...demoBusinesses]);
    return { status, error: state.error, retry, usingDemo, businesses, dishes, getById: (id) => byId(everything, id),
      fetchedAt: here?.fetchedAt || null, capped: !!here?.capped, radiusKm: RADIUS_M / 1000, max: MAX };
  }, [live, state, location.id, retry]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useDirectory = () => { const v = useContext(Ctx); if (!v) throw new Error('useDirectory must be used inside DirectoryProvider'); return v; };
