import React from 'react';
import { CodeXml, ShieldCheck, GitBranch, Lock, Users, ArrowUpRight, Star, Eye } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
// import githubBlue from '../assets/images/icons/githubblue.png';
// import githubGreen from '../assets/images/icons/githubgreen.png';

const FeatureItem = ({ icon, title, description, isLast }) => (
  <div className={`flex items-start gap-4 ${!isLast ? 'border-b border-primary/20 pb-5' : ''}`}>
    <div className="bg-primary/10 p-3 rounded-xl flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col text-left mt-0.5">
      <h3 className="text-slate-800 font-semibold text-[15px]">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-snug">{description}</p>
    </div>
  </div>
);

const GithubSection = () => {
  // const theme = localStorage.getItem('primaryColor') || 'green';
  // const currentIllustration = theme === 'darkblue' ? githubBlue : githubGreen;
  return (
    <section className="w-full pt-20 pb-12 px-4 text-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">

        {/* Small Title */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 rounded-full px-4 py-1.5 w-fit">
            <CodeXml width={16} />
            <span className="font-medium">Open Source</span>
          </div>
        </div>

        {/* Big Title */}
        <h2 className="text-3xl sm:text-4xl font-medium text-slate-700 mb-4">
          Built With Precision<br />
          Explore Our{' '}
          <span className="text-primary relative inline-block">
            GitHub
            <svg
              className="absolute -bottom-3 left-0 w-full text-primary h-3"
              viewBox="0 0 100 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M5 8 Q 50 -2 95 8 M 20 18 Q 45 12 70 18"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{' '}
          Repository
        </h2>

        {/* Description */}
        <p className="text-gray-500 max-w-2xl mx-auto text-base mb-12">
          Explore the source code behind Experio — thoughtfully architected,
          cleanly styled, and built with scalability and maintainability in mind. From design
          patterns to performance, every line reflects real-world engineering standards.
        </p>

        {/* Card Container */}
        <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 md:p-12 pb-6 md:pb-8 w-full relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center justify-between">

            {/* Left side content */}
            <div className="w-full md:w-[42%] flex flex-col gap-5">
              <FeatureItem
                icon={<ShieldCheck className="text-primary" size={20} />}
                title="Clean Code"
                description="Well structured & easily maintainable"
              />
              <FeatureItem
                icon={<GitBranch className="text-primary" size={20} />}
                title="Scalable"
                description="Built for growth & high performance"
              />
              <FeatureItem
                icon={<Lock className="text-primary" size={20} />}
                title="Secure"
                description="Following best practices & industry standards"
              />
              <FeatureItem
                icon={<Users className="text-primary" size={20} />}
                title="Community"
                description="Open to contributions & collaboration"
                isLast
              />
            </div>

            {/* Right side UI */}
            <div className="w-full md:w-[55%] flex justify-center mt-8 md:mt-0 relative">
              {/* Decorative Stars */}
              <svg className="absolute -top-4 left-4 md:left-0 w-5 h-5 text-primary/80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C24 12 12 13.5 12 24C12 24 12 13.5 0 12C0 12 12 10.5 12 0Z" /></svg>
              <svg className="absolute top-12 right-12 md:-right-4 w-3.5 h-3.5 text-primary/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C24 12 12 13.5 12 24C12 24 12 13.5 0 12C0 12 12 10.5 12 0Z" /></svg>
              <svg className="absolute bottom-16 left-8 md:-left-6 w-4 h-4 text-primary/70" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C24 12 12 13.5 12 24C12 24 12 13.5 0 12C0 12 12 10.5 12 0Z" /></svg>
              <svg className="absolute -bottom-8 right-16 w-5 h-5 text-primary/90" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C12 0 12 10.5 24 12C24 12 12 13.5 12 24C12 24 12 13.5 0 12C0 12 12 10.5 12 0Z" /></svg>

              <div className="relative w-full max-w-[380px] mx-auto mt-2">
                {/* Left Dashed String (Anchored Top-Left) */}
                <svg className="absolute -left-24 top-0 w-40 h-32 pointer-events-none text-slate-300 z-0 overflow-visible" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round">
                  <path d="M 0 60 C 40 120, 90 90, 100 50" />
                </svg>

                {/* Right Dashed String (Anchored Bottom-Right) */}
                <svg className="absolute -right-20 -bottom-8 w-48 h-72 pointer-events-none text-slate-300 z-0 overflow-visible" viewBox="0 0 150 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" strokeLinecap="round">
                  <path d="M -10 160 C 60 260, 170 200, 140 80 C 120 0, 140 -50, 160 -100" />
                </svg>

                {/* Floating Code Icon (Top Left) */}
                <div className="absolute -top-6 -left-1 md:-left-5 bg-primary text-white p-3 rounded-[14px] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] transform -rotate-[10deg] hover:rotate-0 transition-transform duration-300 z-20">
                  <CodeXml size={26} strokeWidth={2.5} />
                </div>
                
                {/* Floating GitHub Icon (Bottom Right) */}
                <div className="absolute -bottom-6 -right-1 md:-right-5 bg-primary text-white p-3.5 rounded-[16px] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] transform rotate-[10deg] hover:rotate-0 transition-transform duration-300 z-20">
                  <FaGithub size={36} />
                </div>

                {/* Dark Code Editor Window */}
                <div className="bg-[#0a0a0a] rounded-xl shadow-2xl overflow-hidden border border-gray-800 transform -rotate-2 transition-transform hover:rotate-0 duration-500 w-[88%] mx-auto">
                  {/* Window Header */}
                  <div className="bg-[#2d2d2d] px-3.5 py-2.5 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                  </div>
                  {/* Code Area */}
                  <div className="p-3.5 md:p-4 text-left font-mono text-[11px] md:text-[12px] leading-loose overflow-x-auto text-gray-300">
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">1</span>
                      <span className="text-green-400">// Interview Experience Platform</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">2</span>
                      <span><span className="text-purple-400">const</span> <span className="text-blue-300">experience</span> <span className="text-gray-300">=</span> {'{'}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">3</span>
                      <span className="pl-6"><span className="text-yellow-300">cleancode</span>: <span className="text-orange-300">true</span>,</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">4</span>
                      <span className="pl-6"><span className="text-yellow-300">scalable</span>: <span className="text-orange-300">true</span>,</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">5</span>
                      <span className="pl-6"><span className="text-yellow-300">maintainable</span>: <span className="text-orange-300">true</span>,</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">6</span>
                      <span className="pl-6"><span className="text-yellow-300">performance</span>: <span className="text-green-300">'optimized'</span>,</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">7</span>
                      <span className="pl-6"><span className="text-yellow-300">builtwith</span>: <span className="text-green-300">'precision'</span></span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">8</span>
                      <span>{'}'};</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-6 text-right select-none pr-4">9</span>
                      <span><span className="text-purple-400">export default</span> <span className="text-blue-300">experience</span>;</span>
                    </div>
                  </div>
                </div>

                {/* Repository Stats Card */}
                <div className="absolute -right-2 md:-right-6 -top-4 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 p-3.5 transform rotate-3 transition-transform hover:rotate-6 duration-500 w-[180px] md:w-48 z-10">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2.5">
                    <h4 className="font-bold text-gray-800 text-[12px] md:text-[13px]">Repository Stats</h4>
                    <FaGithub className="text-gray-800 text-base" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-3 h-3 text-primary" />
                        <span className="text-[11px] md:text-[12px] font-medium">5tars</span>
                      </div>
                      <span className="font-bold text-gray-800 text-[11px] md:text-[12px]">23k</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <GitBranch className="w-3 h-3 text-primary" />
                        <span className="text-[11px] md:text-[12px] font-medium">Forks</span>
                      </div>
                      <span className="font-bold text-gray-800 text-[11px] md:text-[12px]">420</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Eye className="w-3 h-3 text-primary" />
                        <span className="text-[11px] md:text-[12px] font-medium">Watchers</span>
                      </div>
                      <span className="font-bold text-gray-800 text-[11px] md:text-[12px]">66</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-3 h-3 text-primary" />
                        <span className="text-[11px] md:text-[12px] font-medium">Contributors</span>
                      </div>
                      <span className="font-bold text-gray-800 text-[11px] md:text-[12px]">25+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 md:mt-16">
            <a
              href="https://github.com/VaibhavPatil01/Interview-Experience-GSMCOE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center"
            >
              <FaGithub size={20} />
              View Source Code
              <ArrowUpRight size={18} />
            </a>
            <a
              href="https://github.com/VaibhavPatil01/Interview-Experience-GSMCOE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-primary/20 hover:bg-primary/10 text-primary px-6 py-3 rounded-lg font-medium transition-colors bg-white w-full sm:w-auto justify-center"
            >
              <Star size={20} className="text-primary" />
              Star on GitHub
              <span className="text-sm font-semibold ml-1 bg-primary/10 px-2 py-0.5 rounded text-primary">2.3k</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GithubSection;
