import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { LocationProvider } from './LocationContext.jsx';
import { DirectoryProvider } from './DirectoryContext.jsx';
import { ThemeProvider } from './ThemeContext.jsx';
import './styles.css';
createRoot(document.getElementById('root')).render(
  <React.StrictMode><HashRouter><ThemeProvider><LocationProvider><DirectoryProvider><App /></DirectoryProvider></LocationProvider></ThemeProvider></HashRouter></React.StrictMode>);
