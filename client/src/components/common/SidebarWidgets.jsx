import React from 'react';
import { Hash, Flame, ChevronDown } from 'lucide-react';
import { assets } from '../../assets/assets';

export const PopularSubjectsWidget = () => {
  const subjects = [
    { name: 'Data Structures', count: '12.4K' },
    { name: 'System Design', count: '8.7K' },
    { name: 'Behavioral', count: '7.1K' },
    { name: 'Algorithms', count: '6.3K' },
    { name: 'OOPs', count: '4.2K' },
    { name: 'Low Level Design', count: '3.6K' },
    { name: 'DBMS', count: '2.8K' },
    { name: 'Case Study', count: '2.4K' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Popular Subjects</h3>
        <button className="text-primary text-xs font-medium hover:underline">View all</button>
      </div>
      <div className="space-y-3">
        {subjects.map((subject, index) => (
          <div key={index} className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-100 transition-colors">
                <Hash className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">{subject.name}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{subject.count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useQuery } from '@tanstack/react-query';
import { getTopCompanies } from '../../services/postServices.js';

export const TopCompaniesWidget = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['top-companies'],
    queryFn: () => getTopCompanies()
  });

  const companies = data?.data || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Top Companies</h3>
        <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
          View all
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-4"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-4">
          {companies.map((company, index) => (
            <div key={index} className="flex justify-between items-center group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-100 text-gray-700">
                  {company._id ? company._id.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">{company._id || 'Unknown'}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">{company.count} posts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


