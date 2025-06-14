
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon } from 'lucide-react';

const ThemeToggle = () => {
  useEffect(() => {
    // Force dark mode on load
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-10 h-10 rounded-full glass-card p-0 hover:scale-110 transition-all duration-500 hover:rotate-12 hover:shadow-lg hover:shadow-blue-500/30"
    >
      <div className="relative w-5 h-5">
        <div className="transition-all duration-500 hover:animate-pulse">
          <Moon className="w-5 h-5 text-blue-400" />
        </div>
      </div>
    </Button>
  );
};

export default ThemeToggle;
