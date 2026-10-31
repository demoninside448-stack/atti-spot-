import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { locations } from './directory/locations.js';

const KEY = 'atti-spot:location';
const Ctx = createContext(null);
const load = () => { try { return locations.find((l) => l.id === localStorage.getItem(KEY)) || locations[0]; } catch { return locations[0]; } };
const km = (a, b) => { const t = (x) => (x * Math.PI) / 180;
  const h = Math.sin(t(b.lat - a.lat) / 2) ** 2 + Math.cos(t(a.lat)) * Math.cos(t(b.lat)) * Math.sin(t(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h)); };

export function LocationProvider({ children }) {
  const [location, setLoc] = useState(load);
  const [geo, setGeo] = useState({ status: 'idle', message: '' });
  const setLocation = useCallback((id) => {
    const l = locations.find((x) => x.id === id); if (!l) return;
    setLoc(l); try { localStorage.setItem(KEY, l.id); } catch { /* storage unavailable */ }
  }, []);
  // Only called from a button click, so the browser asks for permission only after the user chooses it.
  const locateMe = useCallback(() => {
    if (!navigator.geolocation) return setGeo({ status: 'error', message: 'Location is not supported by this browser. Please choose a location manually.' });
    setGeo({ status: 'loading', message: 'Finding your location...' });
    navigator.geolocation.getCurrentPosition((p) => {
      const me = { lat: p.coords.latitude, lng: p.coords.longitude };
      const near = locations.map((l) => ({ l, d: km(me, l) })).sort((a, b) => a.d - b.d)[0];
      if (near.d <= 50) { setLocation(near.l.id); setGeo({ status: 'ok', message: `Using ${near.l.name}, the closest supported area.` }); }
      else setGeo({ status: 'outside', message: 'You seem to be outside our supported areas. Please choose a location manually.' });
    }, (e) => setGeo({ status: 'error', message: e.code === 1
      ? 'Location permission was denied. Please choose a location manually.'
      : 'Could not detect your location. Please choose a location manually.' }), { timeout: 10000 });
  }, [setLocation]);
  const value = useMemo(() => ({ location, setLocation, locateMe, geo }), [location, setLocation, locateMe, geo]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAppLocation = () => { const v = useContext(Ctx); if (!v) throw new Error('useAppLocation must be used inside LocationProvider'); return v; };
