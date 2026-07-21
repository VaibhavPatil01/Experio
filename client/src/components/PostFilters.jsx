import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

const PostFilters = ({ filter, setSearchParams, companyAndRoleQuery }) => {
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllRoles, setShowAllRoles] = useState(false);
  const [isCompanyCollapsed, setIsCompanyCollapsed] = useState(false);
  const [isRoleCollapsed, setIsRoleCollapsed] = useState(false);
  const [matchScore, setMatchScore] = useState(70);

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

  const clearFilters = () => {
    setSearchParams({});
  };

  const companies = companyAndRoleQuery.data?.data?.company || [
    'Google', 'Microsoft', 'Amazon', 'Adobe', 'Flipkart', 'Netflix', 'JPMorgan Chase & Co.'
  ];

  const roles = companyAndRoleQuery.data?.data?.role || [
    'Software Engineer', 'SDE Intern', 'Product Manager', 'Data Scientist', 'Backend Developer'
  ];

  const visibleCompanies = showAllCompanies ? companies : companies.slice(0, 5);
  const visibleRoles = showAllRoles ? roles : roles.slice(0, 5);

  const experienceTypes = ['All', 'Full Time', 'Internship', 'Placement', 'Contract'];

  return (
    <div className="w-full text-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg text-gray-800">Filters</h3>
        <button onClick={clearFilters} className="text-primary hover:underline text-xs font-medium">Reset all</button>
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
            {companies.length > 5 && !showAllCompanies && (
              <button
                onClick={() => setShowAllCompanies(true)}
                className="text-blue-600 hover:text-blue-700 text-[12px] font-semibold mt-4 text-left w-full uppercase"
              >
                {companies.length - 5} MORE
              </button>
            )}
            {showAllCompanies && (
              <button
                onClick={() => setShowAllCompanies(false)}
                className="text-gray-500 hover:text-gray-700 text-[12px] font-semibold mt-4 text-left w-full uppercase"
              >
                SHOW LESS
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
            {roles.length > 5 && !showAllRoles && (
              <button
                onClick={() => setShowAllRoles(true)}
                className="text-blue-600 hover:text-blue-700 text-[12px] font-semibold mt-4 text-left w-full uppercase"
              >
                {roles.length - 5} MORE
              </button>
            )}
            {showAllRoles && (
              <button
                onClick={() => setShowAllRoles(false)}
                className="text-gray-500 hover:text-gray-700 text-[12px] font-semibold mt-4 text-left w-full uppercase"
              >
                SHOW LESS
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
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${isSelected
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
        <select
          className="w-full outline-none text-sm text-gray-600 border border-gray-200 bg-white rounded-lg py-2 px-3 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition appearance-none cursor-pointer"
          defaultValue="Anytime"
        >
          <option value="Anytime">Anytime</option>
          <option value="Past 24 hours">Past 24 hours</option>
          <option value="Past week">Past week</option>
          <option value="Past month">Past month</option>
        </select>
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
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
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

    </div>
  );
};

export default PostFilters;
