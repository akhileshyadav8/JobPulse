"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default to dark or check stored preference
    const stored = localStorage.getItem("jobpulse_theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("jobpulse_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jobpulse_theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-slate-700/50 flex items-center justify-center text-slate-400">
        <Moon className="w-4 h-4" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark/Light Mode"
      className="p-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all shadow-sm flex items-center justify-center"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
      ) : (
        <Moon className="w-4 h-4 text-teal-400 hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
}
