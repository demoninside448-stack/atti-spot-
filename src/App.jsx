import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import MapPage from './pages/MapPage.jsx';
import { Restaurants, Food, Hangout, Shopping } from './pages/Listings.jsx';
import Search from './pages/Search.jsx';
import Details from './pages/Details.jsx';
import { About, Contact, NotFound } from './pages/Static.jsx';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0); // braces: the effect must return undefined or a cleanup function, never scrollTo's result
  }, [pathname]);
  return (
    <Layout>
      <ErrorBoundary key={pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<Details />} />
        <Route path="/business/:id" element={<Details />} />
        <Route path="/search" element={<Search />} />
        <Route path="/food" element={<Food />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/hangout" element={<Hangout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ErrorBoundary>
    </Layout>
  );
}
