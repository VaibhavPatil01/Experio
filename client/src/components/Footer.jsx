import React from 'react';
import { assets, footer_data } from '../assets/assets';
import { useAppDispatch, useAppSelector } from '../redux/store.js';

const Footer = () => {
  const theme = useAppSelector((state) => state.themeState.theme);

  return (
    <div
      className="
    relative overflow-hidden
    px-6 md:px-16 lg:px-24 xl:px-38

    bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),transparent_55%)]

    dark:bg-black
    dark:bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.12),transparent_50%)]

    dark:text-white
  "
    >
      <div className="
  flex flex-col lg:flex-row
  lg:items-start
  justify-between

  gap-10 lg:gap-16

  py-10

  border-b border-gray-300/30 dark:border-gray-700/40

  text-gray-600 dark:text-gray-400
">
        <div>
          <img
            src={theme == 'light' ? assets.logogreenblackpng : assets.logogreenwhitepng}
            alt="logo"
            className="w-30 sm:w-30 "
          />
          <p className="mt-3 dark:text-gray-400">
            Mozify is a student-led platform empowering peers with firsthand insights into
            interviews across diverse companies and roles. Whether preparing for placements or
            refining strategies, students learn from those who’ve been there. By contributing and
            engaging, users foster a culture of collaboration, growth, and shared success.
          </p>
          <div className="flex items-center gap-5 mt-6">
            <a href="https://x.com/prebuiltui" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="
      size-5
      text-slate-700 dark:text-white
      opacity-80
      transition-all duration-300
      hover:text-green-500
      hover:-translate-y-0.5 
    "
                aria-hidden="true"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" class="text-neutral-600 hover:text-neutral-700">
              <svg
                class="opacity-90"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="
      size-5
      text-slate-700 dark:text-white
      opacity-80
      transition-all duration-300
      hover:text-green-500
      hover:-translate-y-0.5 
    "
                aria-hidden="true"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="#" className="group">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="
      size-5
      text-slate-700 dark:text-white
      opacity-80
      transition-all duration-300
      hover:text-green-500
      hover:-translate-y-0.5
    "
  >
    <path
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</a>

<a href="#" className="group">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="
      size-5
      text-slate-700 dark:text-white
      opacity-80
      transition-all duration-300
      hover:text-green-500
      hover:-translate-y-0.5
    "
  >
    <path
      d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</a>

<a href="#" className="group">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="
      size-5
      text-slate-700 dark:text-white
      opacity-80
      transition-all duration-300
      hover:text-green-500
      hover:-translate-y-0.5
    "
  >
    <path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex  xl:justify-between w-full md:w-[45%] xl:gap-5 gap-15">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2 dark:text-white whitespace-nowrap">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.path} className="
  whitespace-nowrap
  hover:underline
  transition
  dark:text-gray-400
">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="py-4 text-center text-sm md:text-base text-gray-500/80 dark:text-gray-400">
        Copyright 2026 © Mozify - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
