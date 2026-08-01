import React, { useState } from 'react';
import { X, MoreHorizontal, Maximize2, Plus, Smile, ArrowUp, Mail, Volume2, VolumeX } from 'lucide-react';
import robotIcon from '../assets/images/icons/chatroboticon.png';

const ChatbotModal = ({ isOpen, onClose }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[420px] h-[calc(100vh-48px)] max-h-[800px] bg-[#f7f7f8] rounded-[24px] shadow-2xl flex flex-col z-[9999] overflow-hidden border border-gray-100 font-sans">
      
      {/* Header Area */}
      <div className="relative pt-4 px-4 flex justify-between items-start z-10">
        
        {/* Expand Button */}
        <div className="relative flex">
          <button className="peer cursor-pointer w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-800">
              <polyline points="11 6 6 6 6 11" />
              <polyline points="13 18 18 18 18 13" />
            </svg>
          </button>
          <div className="pointer-events-none absolute left-1/2 top-10 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-y-0 peer-hover:opacity-100">
            Expand
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900" />
          </div>
        </div>
        
        {/* Floating Header Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-sm px-4 py-1.5 flex items-center gap-3">
          <div className="relative">
            <img src={robotIcon} alt="AI" className="w-7 h-7 object-cover rounded-full" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-900 leading-tight">AI assistant</span>
            <span className="text-[11px] text-gray-500 leading-tight">Text Support</span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Options Button */}
          <div className="relative flex">
            <button 
              onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              className={`peer cursor-pointer w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors ${isOptionsOpen ? 'bg-gray-200' : 'bg-gray-200/50'}`}
            >
              <svg viewBox="0 0 28 28" aria-hidden="true" className="w-5 h-5 text-gray-800" fill="currentColor">
                <path d="M7,16 C8.1045695,16 9,15.1045695 9,14 C9,12.8954305 8.1045695,12 7,12 C5.8954305,12 5,12.8954305 5,14 C5,15.1045695 5.8954305,16 7,16 Z M14,16 C15.1045695,16 16,15.1045695 16,14 C16,12.8954305 15.1045695,12 14,12 C12.8954305,12 12,12.8954305 12,14 C12,15.1045695 12.8954305,16 14,16 Z M21,16 C22.1045695,16 23,15.1045695 23,14 C23,12.8954305 22.1045695,12 21,12 C19.8954305,12 19,12.8954305 19,14 C19,15.1045695 19.8954305,16 21,16 Z"></path>
              </svg>
            </button>
            <div className={`pointer-events-none absolute left-1/2 top-10 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 ${isOptionsOpen ? 'hidden' : 'peer-hover:translate-y-0 peer-hover:opacity-100'}`}>
              Options
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900" />
            </div>

            {/* Options Dropdown Menu */}
            {isOptionsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOptionsOpen(false)}></div>
                <div className="absolute right-0 top-10 mt-1 w-[200px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 py-1.5 z-50 flex flex-col">
                  <button className="cursor-pointer flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors w-full text-left text-[14px]">
                    <Mail className="w-5 h-5" />
                    <span>Send transcript</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent closing dropdown if desired, but actually normal dropdowns close on click. Oh wait, toggles usually don't close the dropdown immediately, or maybe they do? Let's just let it toggle. We can prevent default if we want to keep it open.
                      setIsSoundOn(!isSoundOn);
                    }}
                    className="cursor-pointer flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-gray-800 transition-colors w-full text-left text-[14px]"
                  >
                    <div className="flex items-center gap-3">
                      {isSoundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      <span>Sounds</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors duration-200 ${isSoundOn ? 'bg-[#238a59] justify-end' : 'bg-gray-300 justify-start'}`}>
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Close Button */}
          <div className="relative flex">
            <button onClick={onClose} className="peer cursor-pointer w-8 h-8 rounded-full bg-gray-200/50 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <svg viewBox="0 0 28 28" aria-hidden="true" className="w-5 h-5 text-gray-800" fill="currentColor">
                <path d="M9.70710678,8.29289322 L14,12.585 L18.2928932,8.29289322 C18.6834175,7.90236893 19.3165825,7.90236893 19.7071068,8.29289322 C20.0976311,8.68341751 20.0976311,9.31658249 19.7071068,9.70710678 L15.415,14 L19.7071068,18.2928932 C20.0976311,18.6834175 20.0976311,19.3165825 19.7071068,19.7071068 C19.3165825,20.0976311 18.6834175,20.0976311 18.2928932,19.7071068 L14,15.415 L9.70710678,19.7071068 C9.31658249,20.0976311 8.68341751,20.0976311 8.29289322,19.7071068 C7.90236893,19.3165825 7.90236893,18.6834175 8.29289322,18.2928932 L12.585,14 L8.29289322,9.70710678 C7.90236893,9.31658249 7.90236893,8.68341751 8.29289322,8.29289322 C8.68341751,7.90236893 9.31658249,7.90236893 9.70710678,8.29289322 Z" fillRule="nonzero"></path>
              </svg>
            </button>
            <div className="pointer-events-none absolute right-0 top-10 z-50 translate-y-1 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 peer-hover:translate-y-0 peer-hover:opacity-100">
              Minimize Window
              <div className="absolute right-3 top-0 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content Area */}
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-4 flex flex-col gap-4 scrollbar-hide">
        
        {/* Welcome Message */}
        <div className="flex gap-3">
          <img src={robotIcon} alt="AI" className="w-6 h-6 rounded-full object-cover shrink-0 mt-1" />
          <div className="text-[14px] text-gray-700 leading-relaxed">
            Good morning! Welcome to Chatbot, powered by Text. It's a pleasure to have you here exploring the best AI chatbot software for your website. To assist you better, could you please share your <strong>name</strong> and <strong>email</strong> with me? This will help me provide you with the most relevant information and support. Looking forward to helping you!
          </div>
        </div>

        <div className="flex-1"></div>

        {/* Suggested Prompts */}
        <div className="flex flex-col gap-2.5 items-start mt-4">
          <button className="text-left bg-gray-200/60 hover:bg-gray-200 transition-colors rounded-[20px] px-4 py-2.5 text-[13.5px] text-gray-700 max-w-[90%]">
            How does ChatBot improve customer support?
          </button>
          <button className="text-left bg-gray-200/60 hover:bg-gray-200 transition-colors rounded-[20px] px-4 py-2.5 text-[13.5px] text-gray-700 max-w-[90%]">
            Can ChatBot handle sales and product recommendations?
          </button>
          <button className="text-left bg-gray-200/60 hover:bg-gray-200 transition-colors rounded-[20px] px-4 py-2.5 text-[13.5px] text-gray-700 max-w-[90%]">
            Is technical knowledge required to set up ChatBot?
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-2">
        <div className="bg-white rounded-full flex items-center gap-3 px-2 py-2 shadow-sm border border-gray-100">
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
          <input 
            type="text" 
            placeholder="Write a message..." 
            className="flex-1 bg-transparent outline-none text-[14px] text-gray-800 placeholder-gray-400"
          />
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 hover:bg-gray-200 transition-colors mr-0.5">
            <ArrowUp className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* Footer Powered By */}
      <div className="py-2.5 flex justify-center items-center gap-1.5 text-[11px] text-gray-400">
        Powered by 
        <div className="flex items-center gap-1 font-bold text-gray-500">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          text.com
        </div>
      </div>

    </div>
  );
};

export default ChatbotModal;
