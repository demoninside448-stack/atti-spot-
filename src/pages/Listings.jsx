import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppLocation } from '../LocationContext.jsx';
import { useDirectory } from '../DirectoryContext.jsx';
import { byCategories, matches, dietOk, categoryLabels, restaurantFilters, restaurantPageCategories, hangoutTabs, hangoutPageCategories,
  shoppingFilters, shoppingPageCategories, foodChips, foodPageCategories } from '../directory/index.js';
import { SearchBar, Chips, Empty, BusinessCard, DishCard } from '../components/Cards.jsx';
import DataBanner from '../components/DataBanner.jsx';

const textOf = (b) => [b.name, categoryLabels(b).join(' '), b.address, b.locality, b.cuisine].join(' ');
const Results = ({ list, loading, emptyText }) => loading ? <p className="empty">Loading...</p>
  : list.length ? <div className="grid">{list.map((b) => <BusinessCard key={b.id} b={b} />)}</div> : <Empty text={emptyText} />;

export function Restaurants() {
  const [params] = useSearchParams(); const { location } = useAppLocation(); const dir = useDirectory();
  const [q, setQ] = useState(params.get('q') || ''); const [cat, setCat] = useState('All'); const [diet, setDiet] = useState('All');
  const list = byCategories(dir.businesses, cat === 'All' ? restaurantPageCategories : restaurantFilters[cat]).filter((b) => matches(q, textOf(b)) && dietOk(b, diet));
  return (
    <section className="container page">
      <h1>Restaurants in {location.name}</h1>
      <DataBanner />
      <SearchBar label="restaurants" value={q} onChange={setQ} placeholder="Search restaurants..." />
      <Chips options={Object.keys(restaurantFilters)} value={cat} onChange={setCat} />
      <Chips options={['Veg', 'Non-Veg']} value={diet} onChange={setDiet} />
      {diet !== 'All' && <p className="small muted">The Veg / Non-Veg filter only shows places whose source says so.</p>}
      <Results list={list} loading={dir.status === 'loading'} emptyText={`No restaurants match in ${location.name}.`} />
    </section>
  );
}

export function Food() {
  const { location } = useAppLocation(); const dir = useDirectory();
  const [q, setQ] = useState(''); const [chip, setChip] = useState('All'); const [diet, setDiet] = useState('All');
  const cats = chip === 'All' ? foodPageCategories : foodChips[chip].cats;
  const places = byCategories(dir.businesses, cats).filter((b) => matches(q, textOf(b)) && dietOk(b, diet));
  const dishes = dir.dishes.filter((d) => matches(q, d.name, d.foodCategory) && (chip === 'All' || foodChips[chip].dishes.includes(d.foodCategory)) && (diet === 'All' || dietOk(d, diet)));
  return (
    <section className="container page">
      <h1>Food in {location.name}</h1>
      <DataBanner />
      <SearchBar label="food" value={q} onChange={setQ} placeholder="Search food places or dishes..." />
      <Chips options={Object.keys(foodChips)} value={chip} onChange={setChip} />
      <Chips options={['Veg', 'Non-Veg']} value={diet} onChange={setDiet} />
      {dishes.length > 0 && <><h2>Dishes</h2><div className="grid">{dishes.map((d) => <DishCard key={d.id} d={d} />)}</div></>}
      {dir.status === 'ok' && !dir.dishes.length && <p className="small muted">Dish and menu data is not available from the data source, so no dishes or prices are shown.</p>}
      <h2>Food places</h2>
      <Results list={places} loading={dir.status === 'loading'} emptyText={`No food places match in ${location.name}.`} />
    </section>
  );
}

export function Shopping() {
  const { location } = useAppLocation(); const dir = useDirectory();
  const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  const list = byCategories(dir.businesses, cat === 'All' ? shoppingPageCategories : shoppingFilters[cat]).filter((b) => matches(q, textOf(b)));
  return (
    <section className="container page">
      <h1>Shopping in {location.name}</h1>
      <DataBanner />
      <SearchBar label="shopping" value={q} onChange={setQ} placeholder="Search shops..." />
      <Chips options={Object.keys(shoppingFilters)} value={cat} onChange={setCat} />
      <Results list={list} loading={dir.status === 'loading'} emptyText={`No shops match in ${location.name}.`} />
    </section>
  );
}

const THEME_KEY = { Cafes: 'cafe', Gaming: 'gaming', Parks: 'parks', Theatres: 'theatre' };
export function Hangout() {
  const { location } = useAppLocation(); const dir = useDirectory();
  const [q, setQ] = useState(''); const [tab, setTab] = useState('All');
  const theme = THEME_KEY[tab];
  // Category theme lives on <html data-cat>, independent of light/dark data-theme. Cleanup removes it on leaving.
  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.dataset.cat = theme;
    return () => { delete root.dataset.cat; };
  }, [theme]);
  const list = byCategories(dir.businesses, tab === 'All' ? hangoutPageCategories : hangoutTabs[tab]).filter((b) => matches(q, textOf(b)));
  return (
    <section className="container page">
      <h1>Hangout Spots in {location.name}</h1>
      <DataBanner />
      <SearchBar label="hangouts" value={q} onChange={setQ} placeholder="Search hangout spots..." />
      <Chips options={Object.keys(hangoutTabs)} value={tab} onChange={setTab} />
      <Results list={list} loading={dir.status === 'loading'} emptyText={`No hangout spots match in ${location.name}.`} />
    </section>
  );
}
