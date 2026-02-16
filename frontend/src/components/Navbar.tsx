import React from "react";

interface NavbarProps {
  children?: React.ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800/50 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/20" />
          <span className="text-zinc-900 dark:text-zinc-100">
            Secure<span className="bg-linear-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">Transfer</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {children}
        </div>
      </div>
    </nav>
  );
}