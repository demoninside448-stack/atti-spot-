import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('Atti Spot UI error:', error, info.componentStack); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <section className="container page">
        <h1>Something went wrong on this page</h1>
        <p className="muted">The rest of the site still works. The error details are below and in the browser console.</p>
        <pre className="errbox">{String(this.state.error.message || this.state.error)}</pre>
        <button className="btn" onClick={() => this.setState({ error: null })}>Try again</button>{' '}
        <a href="#/">Go home</a>
      </section>
    );
  }
}
