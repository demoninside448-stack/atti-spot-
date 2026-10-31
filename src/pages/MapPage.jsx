import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { byCategories, mapGroups, allMapCategories, groupOf, categoryLabels, matches } from '../directory/index.js';
import { hasCoords } from '../directory/normalize.js';
import { TILE } from '../config.js';
import { useAppLocation } from '../LocationContext.jsx';
import { useDirectory } from '../DirectoryContext.jsx';
import { SearchBar, Chips, Empty, BusinessCard } from '../components/Cards.jsx';
import DataBanner from '../components/DataBanner.jsx';

const pinIcon = (g, on) => L.divIcon({ className: '', html: `<div class="pin${on ? ' on' : ''}" style="background:${g.color}">${g.icon}</div>`, iconSize: [34, 34], iconAnchor: [17, 17] });
function popupEl(b) { // DOM nodes, not HTML strings: names are never injected as markup
  const d = document.createElement('div'); const t = document.createElement('b'); t.textContent = b.name;
  const a = document.createElement('a'); a.href = `#/business/${b.id}`; a.textContent = 'View details';
  d.append(t, document.createElement('br'), categoryLabels(b).join(' · '), document.createElement('br'), a);
  return d;
}

export default function MapPage() {
  const { location, locateMe, geo } = useAppLocation(); const dir = useDirectory();
  const [q, setQ] = useState(''); const [group, setGroup] = useState('All'); const [sel, setSel] = useState(null); const [tileErr, setTileErr] = useState(false);
  const el = useRef(null), map = useRef(null), layer = useRef(null), markers = useRef(new Map());
  const g = mapGroups.find((x) => x.id === group);

  // Map markers and cards both come from this one filtered list of directory records (real coordinates only).
  const list = useMemo(() => byCategories(dir.businesses, g ? g.categories : allMapCategories)
    .filter((b) => hasCoords(b) && matches(q, b.name, categoryLabels(b).join(' '), b.address, b.locality)), [dir.businesses, g, q]);

  // 1. Create the map once; full cleanup so Back/Forward and StrictMode never leave two maps on one element.
  useEffect(() => {
    if (map.current) return undefined;
    const m = L.map(el.current).setView([location.lat, location.lng], 14);
    const t = L.tileLayer(TILE.url, { attribution: TILE.attribution, maxZoom: 19 }).addTo(m);
    t.on('tileerror', () => setTileErr(true)); t.on('tileload', () => setTileErr(false));
    layer.current = L.layerGroup().addTo(m); map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize()); ro.observe(el.current);
    return () => { ro.disconnect(); m.remove(); map.current = null; layer.current = null; markers.current.clear(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Re-centre when the shared location changes.
  useEffect(() => { map.current?.setView([location.lat, location.lng], 14); setSel(null); }, [location.id]); // eslint-disable-line

  // 3. Markers follow the list; 4. selected styling.
  useEffect(() => {
    const lg = layer.current; if (!lg) return;
    lg.clearLayers(); markers.current.clear();
    list.forEach((b) => { const gr = groupOf(b);
      const mk = L.marker([b.lat, b.lng], { icon: pinIcon(gr, false), title: b.name }).bindPopup(popupEl(b));
      mk.on('click', () => setSel(b.id)); lg.addLayer(mk); markers.current.set(b.id, { mk, gr }); });
  }, [list]);
  useEffect(() => { markers.current.forEach(({ mk, gr }, id) => mk.setIcon(pinIcon(gr, id === sel))); }, [sel, list]);

  const show = (b) => { setSel(b.id); map.current?.panTo([b.lat, b.lng]); markers.current.get(b.id)?.mk.openPopup(); };

  return (
    <section className="mapwrap">
      <aside className="mapside">
        <h1 className="h-sm">Map: {location.name}</h1>
        <DataBanner />
        <SearchBar label="map" value={q} onChange={setQ} placeholder="Search places by name..." />
        <Chips options={mapGroups.map((x) => ({ id: x.id, label: x.label, icon: x.icon }))} value={group} onChange={setGroup} />
        <button className="btn ghost" onClick={locateMe} disabled={geo.status === 'loading'}>📍 Use My Location</button>
        {geo.message && <p className="small" role="status">{geo.message}</p>}
        {tileErr && <p className="small errtxt" role="alert">Map tiles could not be loaded. Check your internet connection.</p>}
        {dir.status !== 'loading' && <p className="small muted">{list.length} place{list.length === 1 ? '' : 's'} shown.</p>}
        {dir.status === 'loading' ? <p className="empty">Loading...</p>
          : list.length ? list.map((b) => <BusinessCard key={b.id} b={b} selected={b.id === sel} onShowOnMap={() => show(b)} />) : <Empty text={`No places match in ${location.name}.`} />}
      </aside>
      <div className="map" ref={el} role="region" aria-label={`Map of ${location.name}`} />
    </section>
  );
}
