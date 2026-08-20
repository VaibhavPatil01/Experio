import React from 'react';
import { assets, footer_data } from '../../assets/assets';
import Logo from './Logo';

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
      `}</style>
      <div style={{ fontFamily: '"Geist", sans-serif' }} className="w-full relative">
        <div className="w-full max-w-7xl mx-auto flex justify-center px-4 sm:px-8 md:px-16 lg:px-28 relative z-10 pointer-events-none">
          <img src={assets.standingFooter} alt="standing footer" className="h-64 sm:h-80 md:h-96 lg:h-[28rem] object-contain object-bottom pointer-events-auto" />
        </div>

        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent relative z-10"></div>

        <footer className="bg-white w-full text-black pt-6 lg:pt-8 px-4 sm:px-8 md:px-16 lg:px-28">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">

            <div className="w-full flex-1 space-y-4">
              <a href="/" className="block">
                <Logo className="w-32 sm:w-40 h-auto text-primary" />
              </a>
              <p className="text-sm/6 text-neutral-600">
                Experio is a student-led platform empowering peers with firsthand insights into interviews across diverse companies and roles. By contributing and engaging, users foster a culture of collaboration and growth.
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Labore modi beatae veritatis. Consequuntur id magni consectetur eaque obcaecati. Quisquam inventore id minima ratione nisi aliquam quam, quod deserunt. Sit labore, praesentium omnis nesciunt fugiat quasi reprehenderit quisquam veritatis nisi dignissimos facere qui ut enim provident nihil, magnam velit animi unde?
              </p>
              <div className="flex gap-5 md:gap-6 order-1 md:order-2">
                <a href="https://github.com/VaibhavPatil01/Experio" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/vaibhav-patil13" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="mailto:vaibhavvpatil132@gmail.com" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </a>
                <a href="https://vaibhav-portfolio-navy.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </a>
                {/* <a href="https://github.com/VaibhavPatil01/Experio" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
                  </svg>
                </a> */}
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
            <p className="text-neutral-600 text-sm">Copyright © 2025 Experio.</p>
            <p className="text-sm text-neutral-600">Built with <span className='text-primary'>❤︎</span> by Vaibhav Patil</p>
          </div>

          <div className="relative mt-2 z-0">
            <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl h-full max-h-64 bg-slate-100 rounded-full blur-[100px] pointer-events-none"></div>
            <h1 className="text-center font-extrabold leading-[0.7] text-transparent text-[clamp(4rem,15vw,15rem)] [-webkit-text-stroke:1px_#D4D4D4] relative z-10">
              Experio
            </h1>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
