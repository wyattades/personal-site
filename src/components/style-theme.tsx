"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLatest, useLocalStorage } from "react-use";

import { BodyProps } from "~/components/body-props";

const ThemeCtx = createContext<{
  mode: ThemeKey;
  setMode: (next: ThemeKey) => void;
  toggleMode: () => void;
  changeCount: number;
} | null>(null);

const supportsColorScheme =
  typeof window === "undefined"
    ? true
    : (window.matchMedia?.("(prefers-color-scheme)")?.matches ?? false);

type ThemeKey = "light" | "dark";

const ORDER: [ThemeKey, ...ThemeKey[]] = supportsColorScheme
  ? [
      "light",
      "dark",
      // "system" TODO: add system support
    ]
  : ["light", "dark"];

const useIsFirstMount = () => {
  const [first, setFirst] = useState(true);
  useEffect(() => setFirst(false), []);
  return first;
};

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  let [mode, setMode] = useLocalStorage<ThemeKey>("style-theme", ORDER[0]);
  mode ||= ORDER[0];

  const changeCounter = useRef(0);

  const latestMode = useLatest(mode);

  const toggleMode = useCallback(() => {
    changeCounter.current++;
    const i = ORDER.indexOf(latestMode.current);
    setMode(ORDER[i >= ORDER.length - 1 || i < 0 ? 0 : i + 1]);
  }, []);

  const isFirst = useIsFirstMount();

  return (
    <ThemeCtx.Provider
      value={{
        mode: isFirst ? ORDER[0] : mode,
        setMode,
        toggleMode,
        changeCount: changeCounter.current,
      }}
    >
      {children}
      <BodyProps className={`theme-${mode}`} />
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);
