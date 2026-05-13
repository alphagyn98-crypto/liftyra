"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "fitmorph-theme";

const defaultThemeContext: ThemeContextValue = {
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultThemeContext);

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const setTheme = (value: Theme) => {
    setThemeState(value);
    applyTheme(value);
    window.localStorage.setItem(STORAGE_KEY, value);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
