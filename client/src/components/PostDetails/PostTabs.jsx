import React from 'react';
import { Briefcase, MessageSquare, ListTree, Lightbulb, DollarSign, LineChart } from 'lucide-react';

const PostTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'process', label: 'Interview Process', icon: ListTree },
    { id: 'tips', label: 'Tips', icon: Lightbulb },
    { id: 'salary', label: 'Salary', icon: DollarSign },
    { id: 'insights', label: 'Insights', icon: LineChart },
  ];

  return (
    <div className="border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
      <div className="flex gap-10 min-w-max px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 pt-2 relative text-sm font-semibold transition-colors cursor-pointer
                ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
              {tab.label}

              {/* Active Tab Indicator Line */}
              {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PostTabs;
