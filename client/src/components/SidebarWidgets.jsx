import React from 'react';
import { Hash, Flame, ChevronDown } from 'lucide-react';
import { assets } from '../assets/assets';

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

export const TopCompaniesWidget = () => {
  // We can use generic colored squares or initial letter for mock logos if actual logos aren't available
  const companies = [
    { name: 'Google', count: '6.2K', color: 'bg-red-100 text-red-500' },
    { name: 'Microsoft', count: '5.1K', color: 'bg-blue-100 text-blue-500' },
    { name: 'Amazon', count: '4.8K', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Flipkart', count: '2.3K', color: 'bg-blue-100 text-blue-600' },
    { name: 'Adobe', count: '1.8K', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 text-sm">Top Companies</h3>
        <button className="text-primary text-xs font-medium hover:underline flex items-center gap-1">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {companies.map((company, index) => (
          <div key={index} className="flex justify-between items-center group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${company.color}`}>
                {company.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">{company.name}</span>
            </div>
            <span className="text-xs text-gray-400 font-medium">{company.count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );
};


