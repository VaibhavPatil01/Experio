import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import FilterModal from './FilterModal';

const PostFilters = ({ filter, setSearchParams, companyAndRoleQuery }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [isCompanyCollapsed, setIsCompanyCollapsed] = useState(false);
  const [isRoleCollapsed, setIsRoleCollapsed] = useState(false);
  const [matchScore, setMatchScore] = useState(70);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  // Parse arrays from filter if we choose to support multiple, for now just treat as strings or split
  const selectedCompanies = filter.company ? filter.company.split(',') : [];
  const selectedRoles = filter.jobRole ? filter.jobRole.split(',') : [];

  const handleCompanyChange = (company) => {
    let newCompanies = [...selectedCompanies];
    if (newCompanies.includes(company)) {
      newCompanies = newCompanies.filter((c) => c !== company);
    } else {
      newCompanies.push(company);
    }
    updateFilter('company', newCompanies.join(','));
  };

  const handleRoleChange = (role) => {
    let newRoles = [...selectedRoles];
    if (newRoles.includes(role)) {
      newRoles = newRoles.filter((r) => r !== role);
    } else {
      newRoles.push(role);
    }
    updateFilter('jobRole', newRoles.join(','));
  };

  const updateFilter = (key, value) => {
    setSearchParams({
      ...Object.fromEntries(
        Object.entries(filter).filter(([k, v]) => k && v && v.length > 0)
      ),
      [key]: value,
    });
  };

  const updateFilterBulk = (key, valuesArray) => {
    const updatedSearchParams = new URLSearchParams(window.location.search);
    if (valuesArray.length > 0) {
      updatedSearchParams.set(key, valuesArray.join(','));
    } else {
      updatedSearchParams.delete(key);
    }
    setSearchParams(updatedSearchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const companies = companyAndRoleQuery.data?.data?.company || [];
  const roles = companyAndRoleQuery.data?.data?.role || [];

  const filteredCompanies = companies.filter(c => c.toLowerCase().includes(companySearchTerm.toLowerCase()));
  const filteredRoles = roles.filter(r => r.toLowerCase().includes(roleSearchTerm.toLowerCase()));

  const visibleCompanies = filteredCompanies.slice(0, 5);
  const visibleRoles = filteredRoles.slice(0, 5);

  const experienceTypes = ['All', 'Full Time', 'Internship', 'Placement', 'Contract'];

  return (
    <div className="w-full text-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
        <button onClick={clearFilters} className="text-primary hover:underline text-xs font-medium cursor-pointer">Reset all</button>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-gray-800 text-[13px] tracking-wider uppercase mb-3">Search in posts</h4>
        <div className="relative">
          <input
            type="text"
            placeholder="Search keywords, topics..."
            value={filter.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full outline-none text-sm text-gray-600 border border-gray-200 bg-gray-50/50 rounded-lg py-2 pl-3 pr-10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {/* Company */}
      <div className="border-b border-gray-200 py-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsCompanyCollapsed(!isCompanyCollapsed)}
        >
          <h4 className="font-semibold text-gray-800 text-[13px] tracking-wider uppercase">Company</h4>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${isCompanyCollapsed ? 'rotate-180' : ''}`} />
        </div>
        
        {!isCompanyCollapsed && (
          <div className="pt-4">
            <div className="relative mb-4">
              <Search className="absolute left-0 top-1.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Company"
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                className="w-full outline-none text-[14px] text-gray-600 border-b border-gray-300 py-1 pl-6 focus:border-primary transition bg-transparent"
              />
            </div>
            <div className="space-y-3.5">
              {visibleCompanies.map((company) => (
                <label key={company} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCompanies.includes(company)}
                    onChange={() => handleCompanyChange(company)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                  />
                  <span className="text-[14px] text-gray-800 group-hover:text-gray-900 transition-colors">{company}</span>
                </label>
              ))}
            </div>
            {filteredCompanies.length > 5 && (
              <button
                onClick={() => setActiveModal('company')}
                className="text-blue-600 hover:text-blue-700 text-[12px] font-semibold mt-4 text-left w-full uppercase cursor-pointer"
              >
                {filteredCompanies.length - 5} MORE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Role */}
      <div className="border-b border-gray-200 py-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setIsRoleCollapsed(!isRoleCollapsed)}
        >
          <h4 className="font-semibold text-gray-800 text-[13px] tracking-wider uppercase">Role</h4>
          <ChevronUp className={`w-4 h-4 text-gray-500 transition-transform ${isRoleCollapsed ? 'rotate-180' : ''}`} />
        </div>
        
        {!isRoleCollapsed && (
          <div className="pt-4">
            <div className="relative mb-4">
              <Search className="absolute left-0 top-1.5 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Role"
                value={roleSearchTerm}
                onChange={(e) => setRoleSearchTerm(e.target.value)}
                className="w-full outline-none text-[14px] text-gray-600 border-b border-gray-300 py-1 pl-6 focus:border-primary transition bg-transparent"
              />
            </div>
            <div className="space-y-3.5">
              {visibleRoles.map((role) => (
                <label key={role} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => handleRoleChange(role)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50 cursor-pointer"
                  />
                  <span className="text-[14px] text-gray-800 group-hover:text-gray-900 transition-colors">{role}</span>
                </label>
              ))}
            </div>
            {filteredRoles.length > 5 && (
              <button
                onClick={() => setActiveModal('role')}
                className="text-blue-600 hover:text-blue-700 text-[12px] font-semibold mt-4 text-left w-full uppercase cursor-pointer"
              >
                {filteredRoles.length - 5} MORE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Experience Type */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-gray-800 text-[13px] tracking-wider uppercase mb-3">Experience Type</h4>
        <div className="flex flex-wrap gap-2">
          {experienceTypes.map((type) => {
            const isSelected = filter.articleType === type || (type === 'All' && !filter.articleType);
            return (
              <button
                key={type}
                onClick={() => updateFilter('articleType', type === 'All' ? '' : type)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary/30 hover:bg-primary/5'
                  }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div className="border-b border-gray-200 py-4">
        <h4 className="font-semibold text-gray-800 text-[13px] tracking-wider uppercase mb-3">Date Posted</h4>
        <div className="relative">
          <button
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className={`w-full flex items-center justify-between outline-none text-sm text-gray-600 bg-white rounded-lg py-2 px-3 transition cursor-pointer border ${isDateDropdownOpen ? 'border-primary/50 ring-1 ring-primary/50' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <span>{filter.datePosted || 'Anytime'}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDateDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDateDropdownOpen(false)}></div>
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-50 overflow-hidden py-1">
                {['Anytime', 'Past 24 hours', 'Past week', 'Past month'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      updateFilter('datePosted', option);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${(filter.datePosted || 'Anytime') === option ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Match Score */}
      <div className="border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between items-end mb-2">
          <h4 className="font-medium text-gray-800">Match Score</h4>
          <span className="text-xs text-gray-500 font-medium">{matchScore}% - 100%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={matchScore}
          onChange={(e) => setMatchScore(e.target.value)}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Apply Filters */}
      <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
        Apply Filters
      </button>

    {/* Filter Modals */}
      {activeModal === 'company' && (
        <FilterModal 
          title="Company"
          options={companies}
          initialSelected={selectedCompanies}
          onClose={() => setActiveModal(null)}
          onApply={(selections) => {
            updateFilterBulk('company', selections);
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'role' && (
        <FilterModal 
          title="Role"
          options={roles}
          initialSelected={selectedRoles}
          onClose={() => setActiveModal(null)}
          onApply={(selections) => {
            updateFilterBulk('jobRole', selections);
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
};

export default PostFilters;
