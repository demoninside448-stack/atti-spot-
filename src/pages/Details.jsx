import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dishesFor, categoryLabels, locations } from '../directory/index.js';
import { useAppLocation } from '../LocationContext.jsx';
import { useDirectory } from '../DirectoryContext.jsx';
import { Photo, StatusBadge } from '../components/Cards.jsx';
import { NotFound } from './Static.jsx';

export default function Details() {
  const { location } = useAppLocation(); const dir = useDirectory(); const nav = useNavigate();
  const { id } = useParams(); const [tab, setTab] = useState('Overview');
  const b = dir.getById(id);
  if (!b) return dir.status === 'loading' ? <section className="container page"><p className="empty">Loading...</p></section> : <NotFound />;
  const menu = dishesFor(dir.dishes, b.id); const nv = <span className="notv">Not available</span>;
  const city = locations.find((l) => l.id === b.locationId)?.name;
  const osmUrl = b.source === 'OpenStreetMap' ? `https://www.openstreetmap.org/${b.sourceId}` : null;
  const safeSite = /^https?:\/\//i.test(b.website || '') ? b.website : null;
  return (
    <section className="container page">
      <button className="chip" onClick={() => nav(-1)}>← Back</button>
      {b.locationId !== location.id && <p className="notice">This place is in {city}. Your selected location is {location.name}.</p>}
      <Photo item={b} className="cover" />
      <h1>{b.name} <StatusBadge b={b} /></h1>
      <p className="muted">{categoryLabels(b).join(' · ')}{b.cuisine ? ` · cuisine: ${b.cuisine.replace(/;/g, ', ')}` : ''}</p>
      <div className="info">
        <div><b>Address</b><br />{b.address || b.locality || nv}</div>
        <div><b>Phone</b><br />{b.phone ? <a href={'tel:' + b.phone}>{b.phone}</a> : nv}</div>
        <div><b>Opening hours</b><br />{b.openingHours || nv}</div>
        <div><b>Website</b><br />{safeSite ? <a href={safeSite} target="_blank" rel="noopener noreferrer">{safeSite}</a> : nv}</div>
      </div>
      <p><a target="_blank" rel="noopener noreferrer" href={`https://www.openstreetmap.org/?mlat=${b.lat}&mlon=${b.lng}#map=18/${b.lat}/${b.lng}`}>View location on OpenStreetMap</a></p>
      <div className="tabs" role="tablist">
        {['Overview', 'Menu', 'Photos'].map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {tab === 'Overview' && <div><h2>About</h2><p>{b.description || 'No description available.'}</p>
        <p className="small muted">Source: {b.source}{osmUrl && <> (<a href={osmUrl} target="_blank" rel="noopener noreferrer">{b.sourceId}</a>)</>}. Status: {b.verificationStatus}.
          {b.updatedAt ? ` Last fetched or updated: ${new Date(b.updatedAt).toLocaleString()}.` : ''} Information may be incomplete or out of date.</p></div>}
      {tab === 'Menu' && (menu.length ? <ul>{menu.map((d) => <li key={d.id}>{d.name} · {d.price ? '₹' + d.price : 'price not verified'}</li>)}</ul> : <p className="empty">No menu or price data is available from the source.</p>)}
      {tab === 'Photos' && <p className="empty">No photos available.</p>}
    </section>
  );
}
