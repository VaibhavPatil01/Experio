import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const FilterModal = ({ title, options, initialSelected, onApply, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([...initialSelected]);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (option) => {
    setSelected(prev => 
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const handleApply = () => {
    onApply(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-sm font-bold tracking-wider uppercase text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${title}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none text-sm text-gray-700 border border-gray-300 rounded-md py-2 pl-9 pr-3 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition"
            />
          </div>
        </div>

        {/* Options Grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                  />
                  <span className="text-[13px] text-gray-700 group-hover:text-gray-900 truncate" title={option}>
                    {option}
                  </span>
                </label>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-sm py-8">
                No {title.toLowerCase()} found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end items-center gap-4">
          <button 
            onClick={handleClearAll}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors uppercase cursor-pointer"
          >
            Clear All
          </button>
          <button 
            onClick={handleApply}
            className="px-6 py-2 bg-primary hover:bg-primary/95 text-white text-sm font-medium rounded-md transition-all cursor-pointer shadow-sm uppercase tracking-wide"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default FilterModal;
