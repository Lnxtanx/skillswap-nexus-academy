
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Learn', path: '/learn' },
    { name: 'Teach', path: '/teach' },
    { name: 'Profile', path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/20 animate-slide-down">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 hover:shadow-lg hover:shadow-primary-500/50 animate-float">
              <span className="text-white font-bold text-lg">SA</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block transition-all duration-300 group-hover:scale-105">
              SkillSwap Academy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 hover:scale-105 animate-fade-in ${
                  isActive(item.path)
                    ? 'bg-white/20 text-primary-400 shadow-lg shadow-primary-500/20'
                    : 'text-gray-300 hover:bg-white/10 hover:text-primary-400 hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center space-x-2 glass-card py-2 px-4 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300"
            >
              <Search className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Search</span>
            </Button>
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:scale-110 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-current transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                <div className={`w-full h-0.5 bg-current transition-all duration-500 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-full h-0.5 bg-current transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 animate-slide-up">
            <div className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-500 hover:scale-105 animate-fade-in ${
                    isActive(item.path)
                      ? 'bg-white/20 text-primary-400 shadow-lg'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-center space-x-2 glass-card py-3 mt-2 hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '500ms' }}
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search Courses</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
