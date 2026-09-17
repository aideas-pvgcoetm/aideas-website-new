"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ThemeSwitch = ({ onToggle }: { onToggle: () => void }) => {
  // Theme state is always read from localStorage (the source of truth),
  // matching the existing Navbar mechanism: localStorage.getItem('aideas-theme')
  // This ensures the UI always reflects the current theme,
  // and there's no hydration mismatch since we read from persisted storage.

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Read current theme from localStorage on each render
  // This mirrors the existing Navbar logic: localStorage.getItem('aideas-theme')
  const stored = localStorage.getItem("aideas-theme") as "dark" | "light" | null;
  const isDark = stored === "dark";
  const isLight = stored === "light";

  return (
    <div
      onClick={onToggle}
      role="button"
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex items-center justify-center h-10 w-24 rounded-full bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "cursor-pointer"
      )}
    >
      <span
        className="absolute left-2 h-8 w-8 rounded-full bg-white transition-transform duration-300"
        style={{ transform: isDark ? "translateX(16px)" : "translateX(0)" }}
      />
      <span className="absolute right-2 h-8 w-8 rounded-full bg-white transition-transform duration-300" />
      <SunIcon
        className="text-yellow-400 transition-colors"
        size={20}
        style={{ opacity: isDark ? 0 : 1 }}
      />
      <MoonIcon
        className="text-yellow-400 transition-colors"
        size={20}
        style={{ opacity: isLight ? 0 : 1 }}
      />
    </div>
  );
};

export default ThemeSwitch;