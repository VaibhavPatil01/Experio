import React from 'react';
import { assets, footer_data } from '../assets/assets';

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
      `}</style>
      <div style={{ fontFamily: '"Geist", sans-serif' }} className="w-full">
        <div className="w-full max-w-7xl mx-auto flex justify-center px-4 sm:px-8 md:px-16 lg:px-28 -mb-[1px] relative z-10 pointer-events-none">
          <img src={assets.standingfooter} alt="standing footer" className="h-64 sm:h-80 md:h-96 lg:h-[28rem] object-contain pointer-events-auto" />
        </div>
        <footer className="bg-white w-full text-black pt-12 lg:pt-16 px-4 sm:px-8 md:px-16 lg:px-28 overflow-hidden border-t border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">

            <div className="w-full flex-1 space-y-4">
              <a href="/" className="block">
                <img
                  src={assets.logogreenblackpng}
                  alt="logo"
                  className="w-32 sm:w-40"
                />
              </a>
              <p className="text-sm/6 text-neutral-600">
                Mozify is a student-led platform empowering peers with firsthand insights into interviews across diverse companies and roles. By contributing and engaging, users foster a culture of collaboration and growth.
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore modi beatae veritatis. Consequuntur id magni consectetur eaque obcaecati. Quisquam inventore id minima ratione nisi aliquam quam, quod deserunt. Sit labore, praesentium omnis nesciunt fugiat quasi reprehenderit quisquam veritatis nisi dignissimos facere qui ut enim provident nihil, magnam velit animi unde?
              </p>
              <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                {/* Twitter */}
                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                {/* Github */}
                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                {/* Linkedin */}
                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                {/* Youtube */}
                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </a>
              </div>
            </div>

            <div className="w-full lg:w-auto flex justify-start lg:justify-end gap-16 md:gap-24">
              {footer_data.map((section, index) => (
                <div key={index}>
                  <h3 className="font-medium text-sm mb-4">{section.title}</h3>
                  <ul className="space-y-3 text-sm text-neutral-800">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <a href={link.path} className="hover:text-neutral-700">{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-6 pt-2 border-t border-neutral-300 flex justify-between items-center z-10 relative">
            <p className="text-neutral-600 text-sm">© 2026 Mozify</p>
            <p className="text-sm text-neutral-600">All rights reserved.</p>
          </div>

          <div className="relative mt-2 z-0">
            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-slate-100 rounded-full blur-[100px] pointer-events-none"></div>
            <h1 className="text-center font-extrabold leading-[0.7] text-transparent text-[clamp(4rem,15vw,15rem)] [-webkit-text-stroke:1px_#D4D4D4] relative z-10">
              Mozify
            </h1>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
