import React, { useState, useEffect } from 'react';
import { 
  Menu, Plus, PenSquare, Sparkles, Search, PanelLeft,
  ThumbsUp, ThumbsDown, Copy, RotateCw, MoreHorizontal, Edit2, Upload, Pin, PinOff, Trash2, MessageCircle
} from 'lucide-react';

const MOCK_MESSAGES = {
  1: [
    { id: 1, sender: 'user', text: 'Can you suggest some chatbot icons?', timestamp: 'Yesterday 10:28 PM' },
    { id: 2, sender: 'assistant', text: 'Hi! 👋 Here are a few icon suggestions for a chatbot:\n\n1. **Robot Head:** Classic and friendly.\n2. **Speech Bubble with Sparkles:** Shows AI assistant capabilities.\n3. **Minimalist Waveform:** Good for voice-focused bots.\n\nWhich style do you prefer?', timestamp: 'Yesterday 10:29 PM' }
  ],
  2: [
    { id: 1, sender: 'user', text: 'I need architecture advice for my MERN stack project.', timestamp: 'Today 10:00 AM' },
    { id: 2, sender: 'assistant', text: 'Sure! For a scalable MERN app, consider a layered architecture:\n\n- **Routes Layer:** Express router definitions.\n- **Controllers:** Request validation and HTTP responses.\n- **Services:** Core business logic.\n- **Data Access:** Mongoose models and queries.\n\nThis keeps your code modular and testable.', timestamp: 'Today 10:02 AM' }
  ]
};

const DEFAULT_MESSAGES = [
  { id: 1, sender: 'user', text: 'This is test chat', timestamp: 'Yesterday 10:28 PM' },
  { id: 2, sender: 'assistant', text: 'Hi! 👋 Test received successfully.\n\nHow can I help you today?', timestamp: 'Yesterday 10:28 PM' },
  { id: 3, sender: 'user', text: 'This is the second test message', timestamp: 'Today 12:05 AM' },
  { id: 4, sender: 'assistant', text: 'Second test message received successfully as well. ✅\n\nEverything seems to be working. If you\'re testing message delivery, context retention, or another feature, let me know what you\'d like to verify next.', timestamp: 'Today 12:05 AM' }
];

const Assistant = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [activeChatId, setActiveChatId] = useState('new');
  const [inputValue, setInputValue] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, label: "Chatbot Icon Suggestions", isPinned: false },
    { id: 2, label: "Project Architecture Advice", isPinned: false },
    { id: 3, label: "Database choice for project", isPinned: false },
    { id: 4, label: "Matrix Cut DP", isPinned: false },
    { id: 5, label: "WFH Request Email", isPinned: false },
    { id: 6, label: "Segmentation fault in DP", isPinned: false },
    { id: 7, label: "MongoDB Atlas Auth Error", isPinned: false },
    { id: 8, label: "Job Platforms for Developers", isPinned: false },
    { id: 9, label: "Profile UI Redesign", isPinned: false }
  ]);

  const togglePin = (e, id) => {
    e.stopPropagation();
    setChatHistory(prev => prev.map(chat => 
      chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  };

  const pinnedChats = chatHistory.filter(c => c.isPinned);
  const recentChats = chatHistory.filter(c => !c.isPinned);

  const currentMessages = MOCK_MESSAGES[activeChatId] || DEFAULT_MESSAGES;

  const renderInputBar = () => (
    <div className="w-full max-w-[760px] relative">
      <div className="flex items-center bg-gray-100 dark:bg-[#2f2f2f] rounded-[24px] p-2 pr-2 border border-transparent dark:border-gray-700/30">
        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors flex-shrink-0">
          <Sparkles className="w-5 h-5" strokeWidth={2} />
        </button>
        <input 
          type="text" 
          placeholder="Ask anything"
          className="flex-1 bg-transparent border-none outline-none text-base px-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 min-w-0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex items-center gap-3 flex-shrink-0 pr-1">
          <div className="relative flex items-center justify-center">
            <button className="peer cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="22"></line>
              </svg>
            </button>
            {/* Tooltip */}
            <div className="pointer-events-none absolute left-1/2 top-full mt-3 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
              Dictate
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <button className="peer cursor-pointer flex items-center justify-center">
              <div className="w-[42px] h-[42px] bg-primary text-white rounded-full flex items-center justify-center shadow-sm">
                {inputValue.trim() ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <polyline points="5 11 12 4 19 11"></polyline>
                  </svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 8.5v4"/>
                    <path d="M8.5 4.5v12"/>
                    <path d="M12.5 6.5v8"/>
                    <path d="M16.5 8.5v4"/>
                  </svg>
                )}
              </div>
            </button>
            {/* Tooltip */}
            <div className="pointer-events-none absolute left-1/2 top-full mt-3 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
              {inputValue.trim() ? "Send Message" : "Start Voice"}
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const currentChat = chatHistory.find(c => c.id === activeChatId);
  const isCurrentChatPinned = currentChat?.isPinned || false;

  return (
    <div className="flex h-[calc(100vh-72px)] w-full bg-white dark:bg-[#212121] text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Collapsed Sidebar (Desktop Only) */}
      {!isSidebarOpen && (
        <div className="hidden md:flex flex-col items-center py-3 w-[68px] bg-gray-50 dark:bg-[#171717] h-full shrink-0 border-r border-transparent dark:border-white/5">
          <div className="flex flex-col items-center gap-1 w-full px-2">
            
            <div className="relative flex items-center justify-center w-full mb-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="peer p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer w-full flex justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 z-50 -translate-y-1/2 -translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                Open sidebar
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full">
              <button 
                onClick={() => setActiveChatId('new')}
                className="peer p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer w-full flex justify-center"
              >
                <PenSquare className="w-5 h-5" />
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 z-50 -translate-y-1/2 -translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                New chat
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full">
              <button 
                className="peer p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer w-full flex justify-center"
              >
                <Search className="w-5 h-5" />
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 z-50 -translate-y-1/2 -translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                Search
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full">
              <button 
                className="peer p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer w-full flex justify-center"
              >
                <Pin className="w-5 h-5 rotate-45" />
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 z-50 -translate-y-1/2 -translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                Pinned chats
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>

            <div className="relative flex items-center justify-center w-full">
              <button 
                className="peer p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer w-full flex justify-center"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 ml-2 z-50 -translate-y-1/2 -translate-x-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-x-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                Recent chats
                <div className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        bg-gray-50 dark:bg-[#171717] flex flex-col
        transition-all duration-300 ease-in-out overflow-hidden shrink-0
        ${isSidebarOpen ? 'w-[260px] translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'}
      `}>
        <div className="p-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="relative flex items-center justify-center">
              <button className="peer p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer">
                <Search className="w-5 h-5" />
              </button>
              <div className="pointer-events-none absolute left-1/2 top-full mt-2 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                Search
                <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <button onClick={() => setIsSidebarOpen(false)} className="peer p-1.5 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] transition-colors cursor-pointer">
                <PanelLeft className="w-5 h-5" />
              </button>
              <div className="pointer-events-none absolute right-0 top-full mt-2 z-50 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-y-0 peer-hover:opacity-100 dark:bg-white dark:text-gray-900">
                Close sidebar
                <div className="absolute right-3.5 top-0 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900 dark:bg-white" />
              </div>
            </div>
          </div>
          <button 
            onClick={() => setActiveChatId('new')}
            className={`cursor-pointer flex items-center gap-3 w-full p-2 rounded-lg transition-colors text-[15px] font-medium
              ${activeChatId === 'new' ? 'bg-gray-200 dark:bg-[#2f2f2f]' : 'hover:bg-gray-200 dark:hover:bg-[#2f2f2f]'}
            `}
          >
            <PenSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span>New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {pinnedChats.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">Pinned</h3>
              <div className="space-y-1">
                {pinnedChats.map(chat => (
                  <RecentItem 
                    key={chat.id}
                    label={chat.label} 
                    isActive={activeChatId === chat.id} 
                    onClick={() => setActiveChatId(chat.id)}
                    isPinned={chat.isPinned}
                    onTogglePin={(e) => togglePin(e, chat.id)}
                    isDropdownOpen={openDropdownId === chat.id}
                    onToggleDropdown={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === chat.id ? null : chat.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {recentChats.length > 0 && (
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 px-2 mb-2">Recents</h3>
              <div className="space-y-1">
                {recentChats.map(chat => (
                  <RecentItem 
                    key={chat.id}
                    label={chat.label} 
                    isActive={activeChatId === chat.id} 
                    onClick={() => setActiveChatId(chat.id)}
                    isPinned={chat.isPinned}
                    onTogglePin={(e) => togglePin(e, chat.id)}
                    isDropdownOpen={openDropdownId === chat.id}
                    onToggleDropdown={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === chat.id ? null : chat.id);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
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
            {activeChatId !== 'new' && (
              <>
                <button className="cursor-pointer flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors text-[14px] font-medium text-gray-700 dark:text-gray-200">
                  <Upload className="w-4 h-4" strokeWidth={2.5} />
                  <span>Share</span>
                </button>
                <div className="relative">
                  <button 
                    className="cursor-pointer p-1.5 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdownId(openDropdownId === 'header' ? null : 'header');
                    }}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {openDropdownId === 'header' && (
                    <div 
                      className="absolute right-0 top-full mt-1 w-[160px] bg-white dark:bg-[#2f2f2f] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] rounded-xl border border-gray-100 dark:border-gray-700 z-[100] py-1.5 flex flex-col cursor-default font-normal" 
                      onClick={e => e.stopPropagation()}
                    >
                      <button 
                        className="cursor-pointer flex items-center gap-3 px-3 py-1.5 text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left w-full"
                        onClick={(e) => {
                          if (activeChatId !== 'new') {
                            togglePin(e, activeChatId);
                          }
                          setOpenDropdownId(null);
                        }}
                      >
                        {isCurrentChatPinned ? (
                          <UnpinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Pin className="w-4 h-4 text-gray-500 dark:text-gray-400 rotate-45" strokeWidth={2} />
                        )}
                        {isCurrentChatPinned ? 'Unpin chat' : 'Pin chat'}
                      </button>
                      <div className="h-px w-full bg-gray-100 dark:bg-gray-700/50 my-1.5" />
                      <button className="cursor-pointer flex items-center gap-3 px-3 py-1.5 text-[14px] text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left w-full">
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Body & Input Area */}
        <div className="flex-1 flex flex-col items-center overflow-y-auto w-full relative">
          {activeChatId === 'new' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-[760px]">
              <h1 className="text-[32px] font-semibold mb-8 text-gray-800 dark:text-[#d1d5db]">Where should we begin?</h1>
              {renderInputBar()}
            </div>
          ) : (
            <div className="flex-1 w-full max-w-[760px] p-4 flex flex-col gap-6 pb-6">
              {currentMessages.map((msg, index) => (
                <div key={msg.id} className="flex flex-col">
                  {(index === 0 || msg.timestamp !== currentMessages[index-1].timestamp) && (
                    <div className="text-center text-xs text-gray-400 dark:text-gray-500 my-4 font-medium">
                      {msg.timestamp}
                    </div>
                  )}

                  {msg.sender === 'user' ? (
                    <div className="flex flex-col items-end group mt-2">
                      <div className="bg-primary text-white px-5 py-2.5 rounded-2xl max-w-[80%] leading-relaxed">
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"><Copy className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start group w-full mt-2">
                      <div className="text-gray-900 dark:text-gray-100 pr-4 py-2 max-w-[100%] whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-gray-400">
                        <button className="p-1.5 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"><RotateCw className="w-4 h-4" /></button>
                        <button className="p-1.5 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2f2f2f] rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fixed Input Area at Bottom */}
        <div className="w-full flex flex-col items-center p-4 bg-gradient-to-t from-white via-white dark:from-[#212121] dark:via-[#212121] to-transparent pt-0 shrink-0">
          {activeChatId !== 'new' && renderInputBar()}
          <div className="text-center text-[11px] text-gray-500 mt-2 font-medium">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>

      </div>
    </div>
  );
};

const UnpinIcon = ({ className }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M17.1218 1.87023C15.7573 0.505682 13.4779 0.76575 12.4558 2.40261L9.75191 6.73289L11.1969 8.17793C11.2355 8.1273 11.2723 8.07415 11.3071 8.01845L14.1523 3.46191C14.493 2.91629 15.2528 2.8296 15.7076 3.28445L20.6359 8.21274C21.0907 8.66759 21.0041 9.42737 20.4584 9.76806L15.9019 12.6133C15.8462 12.6481 15.793 12.6848 15.7424 12.7234L17.1874 14.1684L21.5177 11.4645C23.1546 10.4424 23.4147 8.16307 22.0501 6.79852L17.1218 1.87023Z" fill="currentColor"/>
    <path d="M3.56525 8.85242C3.6015 8.26612 3.84962 7.68582 4.32883 7.27422L5.77735 8.72274C5.75784 8.72967 5.73835 8.7368 5.71886 8.74414C5.64516 8.7719 5.61855 8.80285 5.60548 8.82181C5.58877 8.84604 5.56651 8.8937 5.56144 8.97583C5.55046 9.15333 5.62872 9.40686 5.82846 9.6066L14.3137 18.0919C14.5135 18.2916 14.767 18.3699 14.9445 18.3589C15.0266 18.3538 15.0743 18.3316 15.0985 18.3149C15.1175 18.3018 15.1484 18.2752 15.1762 18.2015C15.1835 18.182 15.1907 18.1625 15.1976 18.143L16.6461 19.5915C16.2345 20.0707 15.6542 20.3188 15.0679 20.3551C14.2853 20.4035 13.4808 20.0874 12.8995 19.5061L9.36397 15.9705L2.68394 22.6506C2.29342 23.0411 1.66025 23.0411 1.26973 22.6506C0.879206 22.26 0.879206 21.6269 1.26973 21.2363L7.94975 14.5563L4.41425 11.0208C3.83293 10.4395 3.51687 9.63502 3.56525 8.85242Z" fill="currentColor"/>
    <path d="M2.00789 2.00786C1.61736 2.39838 1.61736 3.03155 2.00789 3.42207L20.5862 22.0004C20.9767 22.3909 21.6099 22.3909 22.0004 22.0004C22.391 21.6099 22.391 20.9767 22.0004 20.5862L3.4221 2.00786C3.03158 1.61733 2.39841 1.61733 2.00789 2.00786Z" fill="currentColor"/>
  </svg>
);

const RecentItem = ({ label, isActive, onClick, isPinned, onTogglePin, isDropdownOpen, onToggleDropdown }) => (
  <button 
    onClick={onClick}
    className={`group relative cursor-pointer flex items-center w-full px-2.5 py-2 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-200 text-left
      ${isActive ? 'bg-gray-200 dark:bg-[#2f2f2f]' : 'hover:bg-gray-200 dark:hover:bg-[#2f2f2f]'}
      ${isDropdownOpen ? 'overflow-visible' : 'overflow-hidden'}
    `}
  >
    <span className="truncate block w-full pr-8 group-hover:pr-12 transition-all">{label}</span>
    <div className={`absolute right-2 flex items-center gap-1.5 transition-opacity ${isDropdownOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      <div 
        className="p-0.5 hover:text-gray-900 dark:hover:text-gray-100 text-gray-400"
        onClick={onTogglePin}
      >
        {isPinned ? (
          <UnpinIcon className="w-4 h-4" />
        ) : (
          <Pin className="w-4 h-4 rotate-45" />
        )}
      </div>
      <div className="relative">
        <div 
          className="p-0.5 hover:text-gray-900 dark:hover:text-gray-100 text-gray-400"
          onClick={onToggleDropdown}
        >
          <MoreHorizontal className="w-[18px] h-[18px]" />
        </div>

        {isDropdownOpen && (
          <div 
            className="absolute right-0 top-full mt-1 w-[160px] bg-white dark:bg-[#2f2f2f] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] rounded-xl border border-gray-100 dark:border-gray-700 z-[100] py-1.5 flex flex-col cursor-default font-normal" 
            onClick={e => e.stopPropagation()}
          >
            <button className="cursor-pointer flex items-center gap-3 px-3 py-1.5 text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left w-full">
              <Upload className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              Share
            </button>
            <button className="cursor-pointer flex items-center gap-3 px-3 py-1.5 text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left w-full">
              <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400" strokeWidth={2} />
              Rename
            </button>
            <button 
              className="cursor-pointer flex items-center gap-3 px-3 py-1.5 text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3f3f3f] transition-colors text-left w-full"
              onClick={(e) => { onTogglePin(e); onToggleDropdown(e); }}
            >
              {isPinned ? (
                <UnpinIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <Pin className="w-4 h-4 text-gray-500 dark:text-gray-400 rotate-45" strokeWidth={2} />
              )}
              {isPinned ? 'Unpin chat' : 'Pin chat'}
            </button>
            <div className="h-px w-full bg-gray-100 dark:bg-gray-700/50 my-1.5" />
            <button className="cursor-pointer flex items-center gap-3 px-3 py-1.5 text-[14px] text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left w-full">
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  </button>
);

export default Assistant;
