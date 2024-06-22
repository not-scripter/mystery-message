"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect } from "react";

const CustomThemeProvider = ({ children }) => {
  const { themes, resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      const theme =
        resolvedTheme === "dark"
          ? themes.at(-2)
          : resolvedTheme === "light"
            ? themes.at(0)
            : resolvedTheme;

      themes.map((theme) => document.body.classList.remove(theme));
      document.body.classList.add(theme);
    }
  }, [resolvedTheme]);

  return <>{children}</>;
};

const ThemeProviderWrapper = ({ children, ...props }) => {
  return (
    <NextThemesProvider {...props}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  );
};

export default ThemeProviderWrapper;
