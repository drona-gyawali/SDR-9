import React from "react";

interface NavbarProps {
  children?: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 w-full transition-colors duration-300">
      {/* Maintenance Announcement Bar */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-800/20 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
          <p className="text-[12px] md:text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-500 text-center">
            Email service under maintenance till April 30
          </p>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800/50 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/20" />
            <span className="text-zinc-900 dark:text-zinc-100">
              Secure<span className="bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Transfer</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {children}
          </div>
        </div>
      </nav>
    </div>
  );
}