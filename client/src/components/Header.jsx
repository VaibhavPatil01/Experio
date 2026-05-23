import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import LogoutButton from './LogoutButton.jsx';
import { useAppDispatch, useAppSelector } from '../redux/store.js';
import useOutsideAlerter from '../hooks/useOutsideAlerter.js';
import { themeAction } from '../redux/theme/themeState.js';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.userState.isLoggedIn);
  const user = useAppSelector((state) => state.userState.user);
  const theme = useAppSelector((state) => state.themeState.theme);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleCloseNavbar = () => {
    setIsNavOpen(false);
    setShowDropdown(false);
  };

  const dropdownRef = useRef(null);

  useOutsideAlerter(dropdownRef, () => {
    if (showDropdown) {
      setShowDropdown(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  className={`sticky top-0 z-50 flex items-center justify-between w-full pt-3 pb-2 px-6 md:px-16 lg:px-24 xl:px-40 text-sm ${
    isScrolled
      ? 'bg-white/75 backdrop-blur-xl dark:bg-black shadow-sm'
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
          Features
        </a>
        <a href="#testimonials" className="hover:text-green-600">
          Testimonials
        </a>
        <a href="#cta" className="hover:text-green-600">
          Contact
        </a>
      </div>

      <div className="flex gap-2">
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
        <a
  href=""
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
</a>
      </div>

      <button onClick={() => setIsNavOpen(true)} className="md:hidden active:scale-90 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="lucide lucide-menu"
        >
          <path d="M4 5h16M4 12h16M4 19h16" />
        </svg>
      </button>
    </nav>
  );
};

export default Navbar;
