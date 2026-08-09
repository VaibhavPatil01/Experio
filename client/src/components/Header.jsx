import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import notificationIcon from '../assets/images/icons/notification-13-svgrepo-com.svg';
import emptyBellGif from '../assets/images/icons/icons8-bell.gif';
import Logo from './Logo.jsx';
import LogoutButton from './LogoutButton.jsx';
import { useAppDispatch, useAppSelector } from '../redux/store.js';
import useOutsideAlerter from '../hooks/useOutsideAlerter.js';
import { themeAction } from '../redux/theme/themeState.js';
import { ChevronDown, MenuIcon, Moon, Sun, X, Users, LogOut, Settings, CheckCheck, Trash2 } from 'lucide-react';
import { useNotificationContext } from '../context/NotificationContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { getUserProfileStats } from '../services/userServices.js';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.userState.isLoggedIn);
  const user = useAppSelector((state) => state.userState.user);
  const theme = useAppSelector((state) => state.themeState.theme);

  const { 
    notifications, 
    unreadCount, 
    isFetching, 
    error,
    hasMore, 
    loadMoreNotifications, 
    loadInitialNotifications,
    markAsRead, 
    markAllAsRead,
    activeTab,
    setActiveTab
  } = useNotificationContext();

  const { data: profileData } = useQuery({
    queryKey: ['profile', user?.userId],
    queryFn: () => getUserProfileStats(user?.userId),
    enabled: !!user?.userId,
  });

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navBottomOffset, setNavBottomOffset] = useState(0);

  const handleCloseNavbar = () => {
    setIsNavOpen(false);
    setShowDropdown(false);
    setIsNotificationOpen(false);
  };

  const getTimeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return Math.floor(seconds) + 's ago';
  };

  const getNotificationText = (n) => {
    const actorName = n.actorId ? n.actorId.username : 'Someone';
    const othersCount = n.groupCount && n.groupCount > 1 ? ` and ${n.groupCount - 1} others` : '';
    
    switch (n.type) {
      case 'POST_MATCH':
        const score = n.similarityScore ?? n.metadata?.matchPercentage ?? 0;
        return `New experience matches your profile by ${score}%.`;
      case 'POST_COMMENT':
        return `${actorName}${othersCount} commented on your experience.`;
      case 'POST_LIKE':
        return `${actorName}${othersCount} liked your experience.`;
      case 'POST_DISLIKE':
        return `${actorName}${othersCount} disliked your experience.`;
      case 'COMMENT_REPLY':
      case 'REPLY_REPLY':
        return `${actorName}${othersCount} replied to your comment.`;
      default:
        return 'You have a new notification.';
    }
  };

  const handleNotificationClick = (e, n) => {
    e.stopPropagation();
    if (!n.isRead) {
      markAsRead(n._id);
    }
    setIsNotificationOpen(false);
    
    if (n.type === 'POST_MATCH' || n.type === 'POST_LIKE' || n.type === 'POST_DISLIKE' || n.type === 'POST_COMMENT' || n.type === 'COMMENT_REPLY' || n.type === 'REPLY_REPLY') {
      const postId = n.postId?._id || n.postId;
      if (postId) {
        let url = `/post/${postId}`;
        if (n.type === 'POST_COMMENT' || n.type === 'COMMENT_REPLY' || n.type === 'REPLY_REPLY') {
          const hashId = n.entityId || n.commentId;
          if (hashId) url += `#comment-${hashId}`;
        }
        navigate(url);
      }
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isFetching) {
      loadMoreNotifications();
    }
  };

  const updateNavBottomOffset = () => {
    if (dropdownRef.current) {
      setNavBottomOffset(dropdownRef.current.getBoundingClientRect().bottom);
    }
  };

  useOutsideAlerter(dropdownRef, () => {
    if (showDropdown) {
      setShowDropdown(false);
    }
  });

  useOutsideAlerter(notificationRef, () => {
    if (isNotificationOpen) {
      setIsNotificationOpen(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
      updateNavBottomOffset();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateNavBottomOffset);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateNavBottomOffset);
    };
  }, []);

  useEffect(() => {
    if (!isNavOpen) {
      return;
    }

    let animationFrameId;
    const syncDrawerPosition = () => {
      updateNavBottomOffset();
      animationFrameId = requestAnimationFrame(syncDrawerPosition);
    };

    syncDrawerPosition();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isNavOpen]);

  return (
    <nav
      ref={dropdownRef}
      className={`sticky top-0 z-50 flex items-center justify-between w-full pt-3 pb-2 px-6 md:px-16 lg:px-24 xl:px-40 text-sm ${isScrolled
          ? 'bg-white/75 backdrop-blur-xl dark:bg-black'
          : 'bg-transparent dark:bg-black'
        }`}
    >
      <Link to="/" onClick={handleCloseNavbar}>
        <Logo className="h-10 sm:h-12 w-auto text-primary" />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-slate-800 dark:text-white">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <Link to="/posts" className="hover:text-primary">
          Experiences
        </Link>
        <Link to="/resume" className="hover:text-primary">
          Resume
        </Link>
        <Link to="/assistant" className="hover:text-primary">
          Assistant
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="peer cursor-pointer inline-flex h-10 w-10 relative items-center justify-center rounded-full border border-gray-200 bg-white transition-transform duration-300 hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <img src={notificationIcon} alt="Notifications" className="h-[22px] w-[22px] opacity-70 dark:invert pointer-events-none" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* Tooltip */}
          <div
            className="
      pointer-events-none absolute left-1/2 top-12 z-50
      -translate-x-1/2 translate-y-1
      whitespace-nowrap rounded-lg
      bg-gray-900 px-3 py-1.5 text-xs font-medium text-white
      opacity-0 shadow-lg ring-1 ring-white/10
      transition-all duration-200
      peer-hover:translate-y-0 peer-hover:opacity-100
      dark:bg-white dark:text-gray-900
      ${isNotificationOpen ? 'hidden' : ''}
    "
          >
            Notifications
            {/* Tooltip Arrow */}
            <div
              className="
        absolute left-1/2 top-0 h-2 w-2
        -translate-x-1/2 -translate-y-1/2 rotate-45
        bg-gray-900 dark:bg-white
      "
            />
          </div>

          {/* Notification Modal */}
          {isNotificationOpen && (
            <div className="fixed sm:absolute left-1/2 sm:left-auto right-auto sm:-right-16 md:-right-24 -translate-x-1/2 sm:translate-x-0 top-[4.5rem] sm:top-[3.25rem] w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 z-[100] overflow-hidden flex flex-col cursor-default" onClick={e => e.stopPropagation()}>
              <div className="p-4 pb-0 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllAsRead()}
                      className="text-xs text-primary hover:underline font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="flex px-4 border-b border-gray-200 dark:border-gray-700">
                  {['All', 'Matches', 'Interactions'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative pb-3 px-3 mr-2 font-medium text-sm transition-colors cursor-pointer ${
                        activeTab === tab
                          ? 'text-primary dark:text-primary' 
                          : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[350px] sm:h-[450px] overflow-y-auto custom-scrollbar" onScroll={handleScroll}>
                {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2 p-4 text-center">
                    <p>{error}</p>
                    {!error.includes('Session expired') && (
                      <button 
                        onClick={() => {
                          if (notifications.length === 0) loadInitialNotifications();
                          else loadMoreNotifications();
                        }} 
                        className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-green-700 transition"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                ) : notifications.length === 0 && !isFetching ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <img src={emptyBellGif} alt="Empty Notifications" className="w-16 h-16 mb-3 opacity-80" />
                    <p className="font-medium text-gray-600 dark:text-gray-300">You’re all caught up!</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n._id || n.eventId} 
                      onClick={(e) => handleNotificationClick(e, n)}
                      className={`flex gap-3 sm:gap-4 p-4 transition-colors border-l-2 cursor-pointer relative text-left ${n.isRead ? 'hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent' : 'bg-blue-50/50 dark:bg-blue-900/10 border-primary'} ${n._isNew ? 'animate-slide-down-fade' : ''}`}
                    >
                      {!n.isRead && <div className="absolute left-2 top-[30px] w-1.5 h-1.5 rounded-full bg-primary"></div>}
                      
                      {n.type === 'POST_MATCH' ? (
                        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-green-500 to-emerald-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-[14px] overflow-hidden">
                          {n.similarityScore ?? n.metadata?.matchPercentage ?? 0}%
                        </div>
                      ) : n.actorId?.profilePicture || n.actorId?.profilePic ? (
                        <img src={n.actorId.profilePicture || n.actorId.profilePic} alt="Profile" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-[#001b44] flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px] overflow-hidden uppercase">
                          {n.actorId?.username?.slice(0, 2) || 'USR'}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] sm:text-[14px] leading-snug ${n.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white font-medium'}`}>
                          {getNotificationText(n)}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {n.type.replace('_', ' ').toLowerCase()}
                          </span>
                          <span className="text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
                            {getTimeAgo(n.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isFetching && (
                  <div className="p-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative group">
          <button
            type="button"
            onClick={() => dispatch(themeAction.toggleTheme())}
            className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-transform duration-300 hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="h-[19px] w-[19px] opacity-70 transition-transform duration-300 group-hover:rotate-12" />
            ) : (
              <Sun className="h-[20px] w-[20px] transition-transform duration-300 group-hover:rotate-90" />
            )}
          </button>

          {/* Tooltip */}
          <div
            className="
      pointer-events-none absolute left-1/2 top-12 z-50
      -translate-x-1/2 translate-y-1
      whitespace-nowrap rounded-lg
      bg-gray-900 px-3 py-1.5 text-xs font-medium text-white
      opacity-0 shadow-lg ring-1 ring-white/10
      transition-all duration-200
      group-hover:translate-y-0 group-hover:opacity-100
      dark:bg-white dark:text-gray-900
    "
          >
            Switch to {theme === 'light' ? 'dark' : 'light'} mode
            {/* Tooltip Arrow */}
            <div
              className="
        absolute left-1/2 top-0 h-2 w-2
        -translate-x-1/2 -translate-y-1/2 rotate-45
        bg-gray-900 dark:bg-white
      "
            />
          </div>
        </div>
        {!isLoggedIn ? (
          <Link
            to="/login"
            onClick={handleCloseNavbar}
            className="
              hidden md:inline-flex items-center justify-center
              h-10 px-8 rounded-full
              border border-slate-300 dark:border-slate-700
              bg-white/80 dark:bg-slate-900/80
              text-slate-700 dark:text-white
              font-medium
              transition-transform duration-300
              hover:scale-[1.02]
              hover:bg-slate-100 dark:hover:bg-slate-800
              hover:border-slate-300 dark:hover:border-slate-600
              hover:shadow-md
              active:scale-95
            "
          >
            Login
          </Link>
        ) : (
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="cursor-pointer flex items-center gap-2.5 h-[42px] pr-4 pl-1 bg-primary/10 dark:bg-gray-800 rounded-full border border-transparent"
            >
              <div className="w-[34px] h-[34px] rounded-full bg-black flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                {profileData?.profilePicture || user?.profilePicture ? (
                  <img src={profileData?.profilePicture || user?.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.username ? user.username[0].toUpperCase() : 'V'
                )}
              </div>
              <span className="text-[15px] font-medium text-gray-900 dark:text-gray-100 truncate max-w-[75px]">
                Hi, {user?.username}
              </span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-gray-900 dark:text-gray-100 ml-0.5">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="16" y2="12" />
                <line x1="4" y1="18" x2="12" y2="18" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-[190px] bg-white dark:bg-gray-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] rounded-lg border border-gray-100 dark:border-gray-700 z-[100] py-3 flex flex-col gap-1.5">
                <Link
                  to={`/profile/${user?.userId}`}
                  onClick={handleCloseNavbar}
                  className="flex items-center gap-3 px-4 py-1.5 text-[15px] font-medium text-[#001b44] dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <div className="w-[22px] h-[22px] rounded-full bg-black flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0 overflow-hidden">
                    {profileData?.profilePicture || user?.profilePicture ? (
                      <img src={profileData?.profilePicture || user?.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.username ? user.username[0].toUpperCase() : 'V'
                    )}
                  </div>
                  View Profile
                </Link>
                <Link
                  to="/user/search"
                  onClick={handleCloseNavbar}
                  className="flex items-center gap-3 px-4 py-1.5 text-[15px] font-medium text-[#001b44] dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Users className="w-[22px] h-[22px]" strokeWidth={1.5} />
                  Users
                </Link>
                <Link
                  to="/settings"
                  onClick={handleCloseNavbar}
                  className="flex items-center gap-3 px-4 py-1.5 text-[15px] font-medium text-[#001b44] dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  <Settings className="w-[22px] h-[22px]" strokeWidth={1.5} />
                  Settings
                </Link>
                <LogoutButton
                  classNames="flex items-center gap-3 w-full text-left px-4 py-1.5 text-[15px] font-medium text-[#001b44] dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                  onClickCallback={handleCloseNavbar}
                >
                  <LogOut className="w-[22px] h-[22px]" strokeWidth={1.5} />
                  Logout
                </LogoutButton>
              </div>
            )}
          </div>
        )}

        <button
          className="md:hidden active:scale-90 transition cursor-pointer"
          aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isNavOpen}
          onClick={() => {
            updateNavBottomOffset();
            setIsNavOpen(!isNavOpen);
          }}
        >
          {/* <img
            src={isNavOpen ? assets.close_icon : assets.menu_icon}
            alt=""
            className="h-6 w-6 dark:invert cursor-pointer"
          /> */}
          {isNavOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      <div
        className={`fixed left-0 right-0 z-40 flex h-screen flex-col gap-1 overflow-y-auto bg-white px-6 py-5 text-base text-slate-800 shadow-lg transition-transform duration-300 md:hidden dark:bg-gray-950 dark:text-white ${isNavOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        style={{
          top: `${navBottomOffset}px`
        }}
      >
        <Link to="/" onClick={handleCloseNavbar} className="rounded-md px-2 py-3 hover:text-primary">
          Home
        </Link>
        <Link
          to="/posts"
          onClick={handleCloseNavbar}
          className="rounded-md px-2 py-3 hover:text-primary"
        >
          Experiences
        </Link>
        <Link
          to="/resume"
          onClick={handleCloseNavbar}
          className="rounded-md px-2 py-3 hover:text-primary"
        >
          Resume
        </Link>
        <Link
          to="/assistant"
          onClick={handleCloseNavbar}
          className="rounded-md px-2 py-3 hover:text-primary"
        >
          Assistant
        </Link>
        {isLoggedIn && (
          <Link
            to="/post"
            onClick={handleCloseNavbar}
            className="rounded-md px-2 py-3 hover:text-primary"
          >
            Create Post
          </Link>
        )}

        <div className="mt-3 border-t border-slate-200 pt-4 dark:border-gray-800">
          {!isLoggedIn ? (
            <Link
              to="/login"
              onClick={handleCloseNavbar}
              className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 px-8 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="cursor-pointer h-10 px-5 bg-primary hover:bg-primary/95 text-white rounded-full max-w-[180px] truncate"
              >
                Hi, {user.username}
              </button>

              {showDropdown && (
                <div className="mt-2 w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-borderColor dark:border-gray-700 overflow-hidden z-50">
                  <Link
                    to={`/profile/${user?.userId}`}
                    onClick={handleCloseNavbar}
                    className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/user/search"
                    onClick={handleCloseNavbar}
                    className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Users
                  </Link>
                  <Link
                    to="/settings"
                    onClick={handleCloseNavbar}
                    className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Settings
                  </Link>
                  <LogoutButton
                    classNames="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClickCallback={handleCloseNavbar}
                  >
                    Logout
                  </LogoutButton>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
