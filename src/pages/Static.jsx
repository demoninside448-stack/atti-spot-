import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';

export const NotFound = () => <section className="container page"><h1>Page not found</h1><Link to="/">Go home</Link></section>;

export const About = () => (
  <section className="container page narrow">
    <h1>About Us</h1>
    <p>{BRAND.name} is a local discovery platform to help people explore restaurants, dishes and hangout places.</p>
    <p>We are starting with Attur, Salem district, Tamil Nadu, and will add verified local businesses gradually. Listings currently shown are demo records.</p>
  </section>
);

export function Contact() {
  const [f, setF] = useState({ name: '', email: '', message: '' }); const [err, setErr] = useState({}); const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Please enter a valid email.';
    if (f.message.trim().length < 5) x.message = 'Please enter a message.';
    setErr(x); setDone(!Object.keys(x).length);
  };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <section className="container page narrow">
      <h1>Contact Us</h1>
      <p className="muted">Have a question or want to list your restaurant? Write to us.</p>
      <p className="notice">Note: the form is not connected to any email or backend yet, so nothing is actually sent.</p>
      <form onSubmit={submit} noValidate className="form">
        {[['name', 'Name', 'text'], ['email', 'Email', 'email']].map(([k, l, t]) => (
          <div key={k}><label htmlFor={k}>{l}</label><input id={k} type={t} value={f[k]} onChange={set(k)} />{err[k] && <span className="err">{err[k]}</span>}</div>))}
        <div><label htmlFor="message">Message</label><textarea id="message" rows="5" value={f.message} onChange={set('message')} />{err.message && <span className="err">{err.message}</span>}</div>
        <button className="btn" type="submit">Send</button>
        {done && <p role="status" className="notice">Form validated. Not sent: no destination is configured yet.</p>}
      </form>
    </section>
  );
}
