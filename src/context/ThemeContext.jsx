import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const ThemeContext =
  createContext();

export function ThemeProvider({
  children,
}) {

  const [
    darkMode,
    setDarkMode,
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        "darkMode"
      );

    return saved
      ? JSON.parse(saved)
      : false;
  });

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      JSON.stringify(
        darkMode
      )
    );

    document.body.style.background =
      darkMode
        ? "#020617"
        : "#f3f4f6";

    document.body.style.color =
      darkMode
        ? "#ffffff"
        : "#111827";

  }, [darkMode]);

  const toggleTheme =
    () =>
      setDarkMode(
        !darkMode
      );

  return (

    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        toggleTheme,
      }}
    >

      {children}

    </ThemeContext.Provider>
  );
}

export function useTheme() {

  return useContext(
    ThemeContext
  );
}