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

    const html =
      document.documentElement;

    const body =
      document.body;

    const root =
      document.getElementById(
        "root"
      );

    /* =========================
        DARK MODE
    ========================= */

    if (darkMode) {

      html.classList.add(
        "dark"
      );

      html.style.background =
        "#020617";

      body.style.background =
        "#020617";

      body.style.color =
        "#ffffff";

      if (root) {

        root.style.background =
          "#020617";

        root.style.color =
          "#ffffff";
      }

    }

    /* =========================
        LIGHT MODE
    ========================= */

    else {

      html.classList.remove(
        "dark"
      );

      html.style.background =
        "#f3f4f6";

      body.style.background =
        "#f3f4f6";

      body.style.color =
        "#111827";

      if (root) {

        root.style.background =
          "#f3f4f6";

        root.style.color =
          "#111827";
      }
    }

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