import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import LogoutButton from './LogoutButton.jsx';
import { useAppDispatch, useAppSelector } from '../redux/store.js';
import useOutsideAlerter from '../hooks/useOutsideAlerter.js';
import { themeAction } from '../redux/theme/themeState.js';
import { ChevronDown, MenuIcon, Moon, Sun, X } from 'lucide-react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.userState.isLoggedIn);
  const user = useAppSelector((state) => state.userState.user);
  const theme = useAppSelector((state) => state.themeState.theme);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAiToolsOpen, setIsAiToolsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navBottomOffset, setNavBottomOffset] = useState(0);
  const aiTools = [
    { label: 'AI Resume Maker', path: '/ai-resume-maker' },
    { label: 'AI Resume Analyser', path: '/ai-resume-analyser' },
    { label: 'AI Mock Interview', path: '/ai-mock-interview' }
  ];

  const handleCloseNavbar = () => {
    setIsNavOpen(false);
    setShowDropdown(false);
    setIsAiToolsOpen(false);
  };

  const dropdownRef = useRef(null);

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

  // return (
  //   <div className="sticky top-0 z-50 dark:bg-black shadow-[var(--box-shadow)] border-borderColor transition-all">
  //     <div className="flex items-center justify-between px-7 sm:px-6 md:px-7 lg:px-12 xl:px-30 py-3 sm:py-2 text-gray-950 dark:text-white  dark:bg-black">
  //       <Link to="/" onClick={handleCloseNavbar}>
  //         <img src={theme == 'light' ? assets.logogreenblackpng : assets.logogreenwhitepng} className="h-10 sm:h-12" alt="Logo" />
  //       </Link>

  //       <button
  //         className="md:hidden cursor-pointer"
  //         aria-label="Menu"
  //         onClick={() => setIsNavOpen(!isNavOpen)}
  //       >
  //         <img
  //           src={isNavOpen ? assets.close_icon : assets.menu_icon}
  //           alt="menu"
  //           className="h-6 w-6"
  //         />
  //       </button>

  //       <div
  //         className={`max-md:fixed max-md:h-screen max-md:w-full max-md:top-16 max-md:right-0 border-borderColor flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-md:p-3 bg-white dark:bg-gray-950 transition-all duration-300 ${isNavOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'}`}
  //       >
  //         <Link to="/" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
  //           Home
  //         </Link>
  //         <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
  //           Posts
  //         </Link>
  //         <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
  //           AI Powered Mock Interview
  //         </Link>
  //         <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
  //           AI Resume Analyzer
  //         </Link>
  //         <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
  //           AI Resume Maker
  //         </Link>
  //         {isLoggedIn && (
  //           <Link to="/post" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
  //             Create Post
  //           </Link>
  //         )}

  //         <div className="flex max-sm:flex-col items-start sm:items-center gap-2 sm:gap-3">
  //           <button
  //             type="button"
  //             onClick={() => dispatch(themeAction.toggleTheme())}
  //             className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-800   transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
  //             aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
  //             title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
  //           >
  //             {theme === 'light' ? <Moon className="text-sm opacity-60" /> : <Sun />}
  //           </button>

  //           {!isLoggedIn ? (
  //             <Link
  //               onClick={handleCloseNavbar}
  //               to="/login"
  //               className="cursor-pointer px-4 py-1 md:px-6 md:py-2 bg-primary hover:bg-primary/95 transition-all text-white text-sm sm:text-base rounded-md"
  //             >
  //               Login
  //             </Link>
  //           ) : (
  //             <div className="relative" ref={dropdownRef}>
  //               <button
  //                 onClick={() => {
  //                   setShowDropdown(!showDropdown);
  //                   handleCloseNavbar;
  //                 }}
  //                 className="cursor-pointer px-5 py-2 md:px-5 md:py-2 bg-primary hover:bg-primary/95 text-white text-sm sm:text-base rounded-md md:max-w-[150px] truncate"
  //               >
  //                 Hi, {user.username}
  //               </button>

  //               {showDropdown && (
  //                 <div className="absolute mt-1 sm:mt-2 w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-borderColor dark:border-gray-700 overflow-hidden z-50">
  //                   <Link
  //                     to={`/profile/${user?.userId}`}
  //                     onClick={() => {
  //                       setShowDropdown(false);
  //                       setIsNavOpen(false);
  //                     }}
  //                     className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-md"
  //                   >
  //                     Profile
  //                   </Link>
  //                   <Link
  //                     to="/user/search"
  //                     onClick={() => {
  //                       setShowDropdown(false);
  //                       setIsNavOpen(false);
  //                     }}
  //                     className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
  //                   >
  //                     Users
  //                   </Link>
  //                   <LogoutButton
  //                     classNames="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-md"
  //                     onClickCallback={handleCloseNavbar}
  //                   >
  //                     Logout
  //                   </LogoutButton>
  //                 </div>
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <nav
      ref={dropdownRef}
      className={`sticky top-0 z-50 flex items-center justify-between w-full pt-3 pb-2 px-6 md:px-16 lg:px-24 xl:px-40 text-sm ${
        isScrolled
          ? 'bg-white/75 backdrop-blur-xl dark:bg-black'
          : 'bg-transparent dark:bg-black'
      }`}
    >
      <Link to="/" onClick={handleCloseNavbar}>
        <img
          src={theme == 'light' ? assets.logogreenblackpng : assets.logogreenwhitepng}
          className="h-10 sm:h-12"
          alt="Logo"
        />
      </Link>

      <div className="hidden md:flex items-center gap-8 text-slate-800 dark:text-white">
        <a href="#" className="hover:text-green-600">
          Home
        </a>
        <a href="#features" className="hover:text-green-600">
          Experiences
        </a>
        <div className="group relative">
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1 hover:text-green-600"
          >
            AI Tools
            <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          <div className="invisible absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 translate-y-2 rounded-md border border-slate-200 bg-white py-2 text-slate-800 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
            {aiTools.map((tool) => (
              <Link
                key={tool.label}
                to={tool.path}
                className="block px-4 py-2.5 text-sm transition hover:bg-green-50 hover:text-green-600 dark:hover:bg-gray-800"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
        <a href="#cta" className="hover:text-green-600">
          Contact
        </a>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group">
          <button
            type="button"
            onClick={() => dispatch(themeAction.toggleTheme())}
            className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-transform duration-300 hover:scale-105 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:rotate-12" />
            ) : (
              <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
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
              className="cursor-pointer h-10 px-5 bg-primary hover:bg-primary/95 text-white rounded-full md:max-w-[150px] truncate"
            >
              Hi, {user.username}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-borderColor dark:border-gray-700 overflow-hidden z-50">
                <Link
                  to={`/profile/${user?.userId}`}
                  onClick={handleCloseNavbar}
                  className="block px-3 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                >
                  Profile
                </Link>
                <Link
                  to="/user/search"
                  onClick={handleCloseNavbar}
                  className="block px-3 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                >
                  Users
                </Link>
                <LogoutButton
                  classNames="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
                  onClickCallback={handleCloseNavbar}
                >
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
        className={`fixed left-0 right-0 z-40 flex h-screen flex-col gap-1 overflow-y-auto bg-white px-6 py-5 text-base text-slate-800 shadow-lg transition-transform duration-300 md:hidden dark:bg-gray-950 dark:text-white ${
          isNavOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          top: `${navBottomOffset}px`
        }}
      >
        <a href="#" onClick={handleCloseNavbar} className="rounded-md px-2 py-3 hover:text-green-600">
          Home
        </a>
        <a
          href="#features"
          onClick={handleCloseNavbar}
          className="rounded-md px-2 py-3 hover:text-green-600"
        >
          Features
        </a>
        <div className="px-2 py-3">
          <button
            type="button"
            onClick={() => setIsAiToolsOpen(!isAiToolsOpen)}
            className="flex w-full cursor-pointer items-center justify-between font-medium hover:text-green-600"
            aria-expanded={isAiToolsOpen}
          >
            <span>AI Tools</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isAiToolsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ${
              isAiToolsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="mt-2 flex min-h-0 flex-col gap-1 pl-3">
            {aiTools.map((tool) => (
              <Link
                key={tool.label}
                to={tool.path}
                onClick={handleCloseNavbar}
                className="rounded-md py-2 text-sm text-slate-600 hover:text-green-600 dark:text-gray-300"
              >
                {tool.label}
              </Link>
            ))}
            </div>
          </div>
        </div>
        <a
          href="#cta"
          onClick={handleCloseNavbar}
          className="rounded-md px-2 py-3 hover:text-green-600"
        >
          Contact
        </a>
        {isLoggedIn && (
          <Link
            to="/post"
            onClick={handleCloseNavbar}
            className="rounded-md px-2 py-3 hover:text-green-600"
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
