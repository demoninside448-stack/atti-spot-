import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppLocation } from '../LocationContext.jsx';
import { useDirectory } from '../DirectoryContext.jsx';
import { featured, byCategories, hangoutHomeCategories, foodPageCategories, shoppingPageCategories } from '../directory/index.js';
import { BusinessCard, DishCard } from '../components/Cards.jsx';
import DataBanner from '../components/DataBanner.jsx';

const cats = [['Biryani', '🍛'], ['South Indian', '🥞'], ['Fast Food', '🍔'], ['Cafes', '☕'], ['Bakery & Sweets', '🥐']];
const Row = ({ title, to, items, render }) => items.length ? (
  <><div className="sec-h"><h2>{title}</h2><Link to={to}>See all →</Link></div><div className="grid">{items.map(render)}</div></>) : null;

export default function Home() {
  const { location } = useAppLocation(); const dir = useDirectory(); const nav = useNavigate(); const [q, setQ] = useState('');
  const go = (e) => { e.preventDefault(); nav('/search' + (q.trim() ? '?q=' + encodeURIComponent(q.trim()) : '')); };
  const list = dir.businesses; const card = (b) => <BusinessCard key={b.id} b={b} />;
  const nothing = dir.status === 'ok' && !list.length;
  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <p className="eyebrow">Explore · Eat · Hangout</p>
            <h1>Discover <span className="or">Great Food</span> in {location.name}</h1>
            <p className="lead">Find restaurants, shops, cafes and hangout spots in {location.name}. Change your location any time from the header.</p>
            <form className="searchbar big" onSubmit={go} role="search">
              <label className="sr" htmlFor="hs">Search</label>
              <input id="hs" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search places in ${location.name}...`} />
              <button className="btn" type="submit">Search</button>
            </form>
          </div>
          <aside className="hero-card" aria-label="Directory summary">
            <h2>Exploring {location.name}</h2><p className="muted small">{location.region}</p>
            <dl><div><dt>{byCategories(list, foodPageCategories).length}</dt><dd>food places</dd></div><div><dt>{byCategories(list, shoppingPageCategories).length}</dt><dd>shops</dd></div><div><dt>{byCategories(list, hangoutHomeCategories.concat(['cafe'])).length}</dt><dd>hangouts</dd></div></dl>
            <Link to="/map" className="btn">Open map</Link>
          </aside>
        </div>
      </section>
      <section className="container">
        <DataBanner />
        <div className="cats">{cats.map(([c, i]) => <Link key={c} to="/food" className="cat"><span>{i}</span>{c}</Link>)}</div>
        {nothing && <p className="empty">Nothing is listed for {location.name} yet.</p>}
        <Row title={`Featured Restaurants in ${location.name}`} to="/restaurants" items={featured(list, ['restaurant', 'south-indian', 'biryani', 'meals-mess', 'chinese', 'fast-food'], 4)} render={card} />
        <Row title="Popular Dishes" to="/food" items={dir.dishes.slice(0, 4)} render={(d) => <DishCard key={d.id} d={d} />} />
        <Row title="Popular Cafes" to="/hangout" items={featured(list, ['cafe'], 4)} render={card} />
        <Row title="Shops & Supermarkets" to="/shopping" items={featured(list, shoppingPageCategories, 4)} render={card} />
        <Row title="Nearby Hangout Spots" to="/hangout" items={featured(list, hangoutHomeCategories, 4)} render={card} />
        <div className="promo">
          <div><h2>Explore {location.name} on the map</h2><p>Every place on the map opens the same details page as its card.</p></div>
          <Link to="/map" className="btn">Explore Map</Link>
        </div>
      </section>
    </>
  );
}
