
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X, BookOpen, User, GraduationCap, Search } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center animate-float">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse-slow"></div>
            </div>
            <span className="text-xl font-bold gradient-text">SkillSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/courses" className="text-gray-300 hover:text-white transition-colors hover:animate-float">
              <BookOpen className="w-5 h-5 inline mr-2" />
              Courses
            </Link>
            <Link to="/learn" className="text-gray-300 hover:text-white transition-colors hover:animate-float">
              Learn
            </Link>
            <Link to="/teach" className="text-gray-300 hover:text-white transition-colors hover:animate-float">
              Teach
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="glass-card hover:animate-float">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="glass-card"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-card mt-2 animate-slide-down">
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/courses"
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 inline mr-2" />
                Courses
              </Link>
              <Link
                to="/learn"
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Learn
              </Link>
              <Link
                to="/teach"
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Teach
              </Link>
              <Link
                to="/profile"
                className="block py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-4 h-4 inline mr-2" />
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
