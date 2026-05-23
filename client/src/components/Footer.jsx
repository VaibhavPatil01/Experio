import React from 'react';
import { assets, footer_data } from '../assets/assets';
import { useAppDispatch, useAppSelector } from '../redux/store.js';

const Footer = () => {
  const theme = useAppSelector((state) => state.themeState.theme);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-38 bg-primary/10 ">
      <div className="flex flex-col lg:flex-row lg:items-center items-start justify-between gap-6 md:gap-15 py-7 border-b border-gray-500/30  text-gray-500">
        <div>
          <img
            src={theme == 'light' ? assets.logogreenblackpng : assets.logogreenwhitepng}
            alt="logo"
            className="w-30 sm:w-30 "
          />
          <p className="mt-3">
            Mozify is a student-led platform empowering peers with firsthand insights into
            interviews across diverse companies and roles. Whether preparing for placements or
            refining strategies, students learn from those who’ve been there. By contributing and
            engaging, users foster a culture of collaboration, growth, and shared success.
          </p>
          <div className="flex items-center gap-5 mt-6">
            <a href="https://www.facebook.com/people/Genba-Sopanrao-Moze-College-of-Engineering-Balewadi/100086298229102/">
              {' '}
              <img src={assets.facebook_icon} className="w-5 h-5" alt="" />{' '}
            </a>
            <a href="https://www.instagram.com/gsmoze_official/">
              {' '}
              <img src={assets.insta_icon} className="w-5 h-5" alt="" />{' '}
            </a>
            <a href="mailto:interviewexperiencegsmcoe@gmail.com">
              {' '}
              <img src={assets.mail_icon} className="w-5 h-5" alt="" />{' '}
            </a>

            <a href="https://x.com/prebuiltui" target="_blank" rel="noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-twitter size-5 hover:text-indigo-500"
                aria-hidden="true"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a href="#" class="text-neutral-600 hover:text-neutral-700">
              <svg
                class="opacity-90"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href={link.path} className="hover:underline transition">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2026 © Mozify - All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
