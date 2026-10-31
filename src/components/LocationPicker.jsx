import { useEffect, useRef, useState } from 'react';
import { locations, matches } from '../directory/index.js';
import { useAppLocation } from '../LocationContext.jsx';

export default function LocationPicker() {
  const { location, setLocation, locateMe, geo } = useAppLocation();
  const [open, setOpen] = useState(false); const [q, setQ] = useState(''); const box = useRef(null);
  useEffect(() => {
    if (!open) return;
    const key = (e) => e.key === 'Escape' && setOpen(false);
    const away = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('keydown', key); document.addEventListener('mousedown', away);
    return () => { document.removeEventListener('keydown', key); document.removeEventListener('mousedown', away); };
  }, [open]);
  const list = locations.filter((l) => matches(q, l.name, l.region));
  return (
    <div className="picker" ref={box}>
      <button className="picker-btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>📍 {location.name} ▾</button>
      {open && (
        <div className="picker-pop" role="dialog" aria-label="Choose location">
          <input type="search" autoFocus aria-label="Search locations" placeholder="Search city or locality..." value={q} onChange={(e) => setQ(e.target.value)} />
          <ul>{list.map((l) => (
            <li key={l.id}><button className={l.id === location.id ? 'on' : ''} onClick={() => { setLocation(l.id); setOpen(false); setQ(''); }}>
              {l.name}<small>{l.region}</small></button></li>))}</ul>
          {!list.length && <p className="small muted">No supported location matches. More areas are added as data becomes available.</p>}
          <button className="btn ghost" onClick={locateMe} disabled={geo.status === 'loading'}>Use My Location</button>
          {geo.message && <p className="small" role="status">{geo.message}</p>}
        </div>
      )}
    </div>
  );
}
