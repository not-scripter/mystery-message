import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import ThemeProvider from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className="bg-base text-text ">
          <ThemeProvider
            attribute="class"
            enableSystem
            defaultTheme="system"
            value={{
              light: "latte",
              dark: "mocha",
              system: "system",
            }}
            disableTransitionOnChange
            themes={["latte", "frappe", "macchiato", "mocha"]}
          >
            <NavBar />
            {children}
            <Toaster />
          </ThemeProvider>
          <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
          <script>eruda.init();</script>
        </body>
      </AuthProvider>
    </html>
  );
}
