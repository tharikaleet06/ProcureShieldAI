import React from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ theme, onToggle }) => {
  const isLight = theme === 'light';

  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-xl border transition-all flex items-center justify-center cursor-pointer shadow-sm ${
        isLight
          ? 'bg-white border-slate-300 text-amber-500 hover:bg-slate-100 hover:border-slate-400'
          : 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800 hover:text-amber-300 hover:border-slate-700'
      }`}
      title={isLight ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
      aria-label="Toggle Theme"
    >
      {isLight ? (
        <Moon className="w-4 h-4 text-slate-700 hover:text-slate-900" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 animate-in spin-in-180 duration-200" />
      )}
    </button>
  );
};
