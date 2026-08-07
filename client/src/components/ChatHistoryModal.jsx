import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { fetchSessions } from '../services/chatServices';

const ChatHistoryModal = ({ isOpen, onClose, activeSessionId, onSessionSelect }) => {
  const [historySessions, setHistorySessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchHistory();
    } else {
      document.body.style.overflow = '';
      setSearchQuery(''); // Clear search on close
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await fetchSessions();
      const sessionsArray = Array.isArray(data) ? data : (data.sessions || []);
      setHistorySessions(sessionsArray);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${Math.max(1, diff)} secs ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} wk ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} mo ago`;
    return `${Math.floor(diff / 31536000)} yr ago`;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Inner Modal Box */}
      <div 
        className="w-full max-w-[600px] h-[550px] max-h-[85vh] bg-[#f7f7f8] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="w-full p-3 bg-white rounded-t-xl border-b border-gray-100">
          <input 
            type="text"
            placeholder="Search all convos..."
            className="w-full bg-white text-gray-800 text-[13px] outline-none px-4 py-2.5 rounded-md border border-gray-300 focus:border-primary transition-colors placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* List */}
        <div className="w-full flex-1 overflow-y-auto chat-scroll flex flex-col p-2 overscroll-contain">
          {isLoadingHistory ? (
            <div className="text-gray-400 text-sm text-center mt-4">Loading...</div>
          ) : (
            (() => {
              const filtered = historySessions.filter(s => s.title?.toLowerCase().includes(searchQuery.toLowerCase()));
              const currentSession = activeSessionId ? filtered.find(s => s._id === activeSessionId) : null;
              const previousSessions = activeSessionId ? filtered.filter(s => s._id !== activeSessionId) : filtered;

              const renderSession = (session) => (
                <div 
                  key={session._id} 
                  onClick={() => {
                    onSessionSelect(session._id);
                    onClose();
                  }}
                  className="group flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors border border-transparent hover:border-gray-200"
                >
                  <span className="text-[14px] truncate mr-4 font-medium">{session.title}</span>
                  <div className="flex items-center gap-4 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                    <span className="text-[12px] text-gray-400">{getRelativeTime(session.updatedAt || session.createdAt)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                    </button>
                  </div>
                </div>
              );

              return (
                <>
                  {currentSession && (
                    <div className="mb-4">
                      <h3 className="text-[12px] font-semibold text-gray-400 mb-1 px-3 tracking-wider">Current</h3>
                      {renderSession(currentSession)}
                    </div>
                  )}
                  
                  {previousSessions.length > 0 && (
                    <div>
                      <h3 className="text-[12px] font-semibold text-gray-400 mb-1 px-3 tracking-wider">Previous</h3>
                      {previousSessions.map(session => renderSession(session))}
                    </div>
                  )}
                </>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryModal;
