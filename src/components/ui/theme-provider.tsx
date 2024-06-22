"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";
import { useEffect } from "react";

const CustomThemeProvider = ({ children }: ThemeProviderProps) => {
  const { themes, resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      const theme: any =
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

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  );
}
