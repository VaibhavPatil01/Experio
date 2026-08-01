import React, { useState } from 'react';
import { 
  Menu, Plus, PenSquare, Mic, Sparkles, Headphones
} from 'lucide-react';

const Assistant = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState('new');

  return (
    <div className="flex h-[calc(100vh-72px)] w-full bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[260px] bg-gray-50 dark:bg-[#171717] flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-3">
          <button 
            onClick={() => setActiveChatId('new')}
            className={`cursor-pointer flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-sm font-medium
              ${activeChatId === 'new' ? 'bg-gray-200 dark:bg-[#2f2f2f]' : 'hover:bg-gray-200 dark:hover:bg-[#2f2f2f]'}
            `}
          >
            <PenSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">Recents</h3>
            <div className="space-y-1">
              <RecentItem label="Chatbot Icon Suggestions" isActive={activeChatId === 1} onClick={() => setActiveChatId(1)} />
              <RecentItem label="Project Architecture Advice" isActive={activeChatId === 2} onClick={() => setActiveChatId(2)} />
              <RecentItem label="Database choice for project" isActive={activeChatId === 3} onClick={() => setActiveChatId(3)} />
              <RecentItem label="Matrix Cut DP" isActive={activeChatId === 4} onClick={() => setActiveChatId(4)} />
              <RecentItem label="WFH Request Email" isActive={activeChatId === 5} onClick={() => setActiveChatId(5)} />
              <RecentItem label="Segmentation fault in DP" isActive={activeChatId === 6} onClick={() => setActiveChatId(6)} />
              <RecentItem label="MongoDB Atlas Auth Error" isActive={activeChatId === 7} onClick={() => setActiveChatId(7)} />
              <RecentItem label="Job Platforms for Developers" isActive={activeChatId === 8} onClick={() => setActiveChatId(8)} />
              <RecentItem label="Profile UI Redesign" isActive={activeChatId === 9} onClick={() => setActiveChatId(9)} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-white dark:bg-[#212121]">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
             <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
             </button>
          </div>
        </div>

        {/* Empty State Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-[32px] font-semibold mb-8 text-gray-800 dark:text-[#d1d5db]">Where should we begin?</h1>
          
          <div className="w-full max-w-[760px] relative">
            <div className="flex items-center bg-gray-100 dark:bg-[#2f2f2f] rounded-[24px] p-2.5 pr-4 border border-transparent dark:border-gray-700/30">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors flex-shrink-0">
                <Plus className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <input 
                type="text" 
                placeholder="Ask anything"
                className="flex-1 bg-transparent border-none outline-none text-base px-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-w-0"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center">
                  <Mic className="w-5 h-5" strokeWidth={2} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center">
                  <Headphones className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const RecentItem = ({ label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`cursor-pointer flex items-center w-full px-2.5 py-2 rounded-lg transition-colors text-[13px] text-gray-700 dark:text-gray-200 text-left
      ${isActive ? 'bg-gray-200 dark:bg-[#2f2f2f]' : 'hover:bg-gray-200 dark:hover:bg-[#2f2f2f]'}
    `}
  >
    <span className="truncate">{label}</span>
  </button>
);

export default Assistant;
