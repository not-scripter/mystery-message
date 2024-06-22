"use client";

import { useTheme } from "next-themes";

export default function page() {
  const { theme } = useTheme();
  return (
    <div className="w-full h-svh text-center bg-base text-text">
      Current Theme :
    </div>
  );
}
