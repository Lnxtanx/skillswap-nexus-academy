
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search courses, skills, or instructors...",
  onSearch,
  suggestions = ['JavaScript', 'React', 'Python', 'Design', 'Marketing', 'Photography']
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      console.log('Searching:', query);
      if (onSearch) {
        onSearch(query.trim());
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    console.log('Searching:', suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Search Input */}
      <div className="relative transform transition-all duration-500 hover:scale-105 group-focus-within:scale-105">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-primary-500" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-4 glass rounded-2xl border border-white/30 focus:border-primary-500 focus:outline-none text-white placeholder-gray-400 transition-all duration-500 focus:shadow-2xl focus:shadow-primary-500/20 animate-glow"
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <Button 
            onClick={handleSearch}
            size="sm"
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-6 py-2 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary-500/30"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-white/30 shadow-xl z-10 animate-slide-up backdrop-blur-xl">
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3 animate-fade-in">
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1 glass rounded-full text-sm hover:bg-white/20 transition-all duration-300 text-gray-400 hover:text-primary-400 hover:scale-105 animate-fade-in hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
