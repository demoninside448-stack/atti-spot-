import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryLabels, categoryById } from '../directory/index.js';
import { useDirectory } from '../DirectoryContext.jsx';

// Label comes from source + verification (text, not colour alone).
const badgeFor = (b) => b.verificationStatus === 'verified' ? ['verified', 'Verified'] : b.source === 'Demo' ? ['demo', 'Demo']
  : b.source === 'OpenStreetMap' ? ['osm', 'OpenStreetMap'] : ['unverified', 'Manually added'];
export const StatusBadge = ({ b }) => { const [cls, text] = badgeFor(b); return <span className={'badge ' + cls}>{text}</span>; };

export function Photo({ item, className = '', icon }) {
  const [bad, setBad] = useState(false);
  const src = item.image || item.images?.[0];
  const fallback = icon || categoryById[item.primaryCategory]?.icon || '🍽️';
  return (
    <div className={'photo ' + className}>
      {src && !bad ? <img src={src} alt={item.name} loading="lazy" onError={() => setBad(true)} />
        : <div className="ph" role="img" aria-label={item.name + ' (no photo yet)'}>{fallback}</div>}
      <StatusBadge b={item} />
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder, label }) {
  return (
    <div className="searchbar">
      <label className="sr" htmlFor={'s-' + label}>{label}</label>
      <input id={'s-' + label} type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && <button type="button" className="clear" aria-label="Clear search" onClick={() => onChange('')}>✕</button>}
      <span className="sbtn" aria-hidden="true">🔍</span>
    </div>
  );
}

// options: strings or {id,label,icon}
export function Chips({ options, value, onChange, all = true }) {
  const items = [...(all ? [{ id: 'All', label: 'All' }] : []), ...options.map((o) => (typeof o === 'string' ? { id: o, label: o } : o))];
  return (
    <div className="chips" role="group" aria-label="Filters">
      {items.map((o) => (
        <button key={o.id} className={'chip' + (value === o.id ? ' on' : '')} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.icon ? o.icon + ' ' : ''}{o.label}</button>))}
    </div>
  );
}

export const Empty = ({ text = 'No results found. Try a different search or filter.' }) => <p className="empty">{text}</p>;

const dietText = { veg: 'Veg', 'non-veg': 'Non-Veg', both: 'Veg & Non-Veg' };
export function BusinessCard({ b, selected, onShowOnMap }) {
  const label = categoryLabels(b).join(' · ');
  const verified = b.verificationStatus === 'verified';
  return (
    <article className={'card' + (selected ? ' sel' : '')}>
      <Photo item={b} />
      <div className="card-b">
        <h3><Link to={'/business/' + b.id}>{b.name}</Link></h3>
        <p className="muted">{label}{b.diet ? ' · ' + dietText[b.diet] : ''}</p>
        <p className="muted small">{b.locality || b.address || ''}</p>
        {!verified && <p className="small notv">Details not verified</p>}
        {onShowOnMap && <button className="chip" onClick={onShowOnMap}>📍 Show on map</button>}
      </div>
    </article>
  );
}

export function DishCard({ d }) {
  const biz = useDirectory().getById(d.businessId);
  return (
    <article className="card">
      <Photo item={d} icon="🍽️" />
      <div className="card-b">
        <h3><Link to={'/business/' + d.businessId}>{d.name}</Link></h3>
        <p className="small">{d.price ? '₹' + d.price : <span className="notv">Price not verified</span>}</p>
        <p className="muted small">{d.foodCategory}{d.diet ? ' · ' + dietText[d.diet] : ''}</p>
        {biz && <p className="muted small">at {biz.name}</p>}
      </div>
    </article>
  );
}
