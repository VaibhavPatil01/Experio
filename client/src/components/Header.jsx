import React, { useState, useRef } from 'react';
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

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-black shadow-[var(--box-shadow)] border-borderColor transition-all">
      <div className="flex items-center justify-between px-7 sm:px-6 md:px-7 lg:px-12 xl:px-30 py-3 sm:py-2 text-gray-950 dark:text-white bg-white dark:bg-black">
        <Link to="/" onClick={handleCloseNavbar}>
          <img src={theme == 'light' ? assets.logogreenblackpng : assets.logogreenwhitepng} className="h-10 sm:h-12" alt="Logo" />
        </Link>

        <button
          className="md:hidden cursor-pointer"
          aria-label="Menu"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <img
            src={isNavOpen ? assets.close_icon : assets.menu_icon}
            alt="menu"
            className="h-6 w-6"
          />
        </button>

        <div
          className={`max-md:fixed max-md:h-screen max-md:w-full max-md:top-16 max-md:right-0 border-borderColor flex flex-col md:flex-row items-start md:items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 max-md:p-3 bg-white dark:bg-gray-950 transition-all duration-300 ${isNavOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'}`}
        >
          <Link to="/" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
            Home
          </Link>
          <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
            Posts
          </Link>
          <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
            AI Powered Mock Interview
          </Link>
          <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
            AI Resume Analyzer
          </Link>
          <Link to="/posts" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
            AI Resume Maker
          </Link>
          {isLoggedIn && (
            <Link to="/post" onClick={handleCloseNavbar} className="px-2 py-1 text-base">
              Create Post
            </Link>
          )}

          <div className="flex max-sm:flex-col items-start sm:items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => dispatch(themeAction.toggleTheme())}
              className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-800   transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <Moon className="text-sm opacity-60" /> : <Sun />}
            </button>

            {!isLoggedIn ? (
              <Link
                onClick={handleCloseNavbar}
                to="/login"
                className="cursor-pointer px-4 py-1 md:px-6 md:py-2 bg-primary hover:bg-primary/95 transition-all text-white text-sm sm:text-base rounded-md"
              >
                Login
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setShowDropdown(!showDropdown);
                    handleCloseNavbar;
                  }}
                  className="cursor-pointer px-5 py-2 md:px-5 md:py-2 bg-primary hover:bg-primary/95 text-white text-sm sm:text-base rounded-md md:max-w-[150px] truncate"
                >
                  Hi, {user.username}
                </button>

                {showDropdown && (
                  <div className="absolute mt-1 sm:mt-2 w-40 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-borderColor dark:border-gray-700 overflow-hidden z-50">
                    <Link
                      to={`/profile/${user?.userId}`}
                      onClick={() => {
                        setShowDropdown(false);
                        setIsNavOpen(false);
                      }}
                      className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-md"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/user/search"
                      onClick={() => {
                        setShowDropdown(false);
                        setIsNavOpen(false);
                      }}
                      className="block px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Users
                    </Link>
                    <LogoutButton
                      classNames="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-b-md"
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
      </div>
    </div>
  );
};

export default Navbar;



