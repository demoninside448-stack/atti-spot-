import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
const KEY = 'atti-spot:theme';
const Ctx = createContext(null);
const read = () => { try { const m = localStorage.getItem(KEY); return ['light', 'dark', 'system'].includes(m) ? m : 'system'; } catch { return 'system'; } };

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(read);
  const setMode = useCallback((m) => { setModeState(m); try { localStorage.setItem(KEY, m); } catch { /* ignore */ } }, []);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => { document.documentElement.dataset.theme = mode === 'system' ? (mq.matches ? 'dark' : 'light') : mode; };
    apply();
    if (mode !== 'system') return undefined;
    mq.addEventListener('change', apply); // follows OS appearance live while in System mode
    return () => { mq.removeEventListener('change', apply); };
  }, [mode]);
  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useTheme = () => useContext(Ctx);
