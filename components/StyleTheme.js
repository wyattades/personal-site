import React, { createContext, useCallback, useContext, useRef } from 'react';
import { useLocalStorage, useLatest } from 'react-use';

import { BodyProps } from 'components/BodyProps';

const ThemeCtx = createContext(null);

const supportsColorScheme =
  typeof window === 'undefined'
    ? true
    : window.matchMedia?.('(prefers-color-scheme)')?.matches ?? false;

const ORDER = supportsColorScheme
  ? ['light', 'dark', 'system']
  : ['light', 'dark'];

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useLocalStorage('style-theme', ORDER[0]);
  const changeCounter = useRef(0);

  const latestMode = useLatest(mode);
  const toggleMode = useCallback(() => {
    changeCounter.current++;
    const i = ORDER.indexOf(latestMode.current);
    setMode(ORDER[i >= ORDER.length - 1 || i < 0 ? 0 : i + 1]);
  }, []);

  return (
    <ThemeCtx.Provider
      value={{ mode, setMode, toggleMode, changeCount: changeCounter.current }}
    >
      {children}
      <BodyProps className={`theme-${mode}`} />
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);
