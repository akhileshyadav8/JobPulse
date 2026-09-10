import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              JobPulse
            </span>
          </Link>
          <span className="hidden md:inline-block text-sm text-slate-400 border-l border-slate-700 pl-4">
            India's Real-Time Job Engine
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Jobs
          </Link>
          <Link href="/companies" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Companies
          </Link>
          <Link href="/blog" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-200 hover:text-white transition-colors">
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="md:hidden text-slate-200">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
