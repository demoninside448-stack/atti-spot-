import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BRAND } from '../config.js';
import LocationPicker from './LocationPicker.jsx';
import { useTheme } from '../ThemeContext.jsx';
const links = [['/', 'Home'], ['/map', 'Map'], ['/restaurants', 'Restaurants'], ['/food', 'Food'], ['/shopping', 'Shopping'], ['/hangout', 'Hangout'], ['/search', 'Search']];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { mode, setMode } = useTheme();
  return (
    <>
      <header className="header">
        <div className="container header-in">
          <Link to="/" className="logo" onClick={() => setOpen(false)}>
            <span className="logo-pin">📍</span>
            <span><b>{BRAND.name}</b><small>{BRAND.tagline}</small></span>
          </Link>
          <LocationPicker />
          <select className="theme-select" aria-label="Colour theme" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
          </select>
          <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
          <nav className={'nav' + (open ? ' open' : '')} aria-label="Main">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="container foot-in">
          <div><b>{BRAND.name}</b><p>{BRAND.tagline}</p><p className="muted">Early demo. Listings are sample data, not verified businesses.</p></div>
          <div className="foot-links">
            <Link to="/about">About Us</Link><Link to="/contact">Contact Us</Link>
            <Link to="/map">Map</Link><Link to="/restaurants">Restaurants</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
