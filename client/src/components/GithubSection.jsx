import React from 'react';
import { CodeXml, ShieldCheck, GitBranch, Lock, Users, ArrowUpRight, Star } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import githubIllustration from '../assets/images/icons/github_illustration.png';

const FeatureItem = ({ icon, title, description, isLast }) => (
  <div className={`flex items-start gap-4 ${!isLast ? 'border-b border-green-200/50 pb-5' : ''}`}>
    <div className="bg-[#e9f5ec] p-3 rounded-xl flex-shrink-0">
      {icon}
    </div>
    <div className="flex flex-col text-left mt-0.5">
      <h3 className="text-slate-800 font-semibold text-[15px]">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 leading-snug">{description}</p>
    </div>
  </div>
);

const GithubSection = () => {
  return (
    <section className="w-full pt-20 pb-12 px-4 text-center">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">

        {/* Small Title */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-4 py-1.5 w-fit">
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
          Explore the source code behind Interview Experience GSMCOE — thoughtfully architected,
          cleanly styled, and built with scalability and maintainability in mind. From design
          patterns to performance, every line reflects real-world engineering standards.
        </p>

        {/* Card Container */}
        <div className="bg-[#f3f9f5] border border-green-100/50 rounded-[2rem] p-8 md:p-12 pb-6 md:pb-8 w-full relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center justify-between">

            {/* Left side content */}
            <div className="w-full md:w-[42%] flex flex-col gap-5">
              <FeatureItem
                icon={<ShieldCheck className="text-green-600" size={20} />}
                title="Clean Code"
                description="Well structured & easily maintainable"
              />
              <FeatureItem
                icon={<GitBranch className="text-green-600" size={20} />}
                title="Scalable"
                description="Built for growth & high performance"
              />
              <FeatureItem
                icon={<Lock className="text-green-600" size={20} />}
                title="Secure"
                description="Following best practices & industry standards"
              />
              <FeatureItem
                icon={<Users className="text-green-600" size={20} />}
                title="Community"
                description="Open to contributions & collaboration"
                isLast
              />
            </div>

            {/* Right side Image */}
            <div className="w-full md:w-[55%] flex justify-center mt-8 md:mt-0">
              <img
                src={githubIllustration}
                alt="GitHub Repository Overview"
                className="w-full max-w-2xl object-contain drop-shadow-sm transform md:scale-110"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 md:mt-16">
            <a
              href="https://github.com/VaibhavPatil01/Interview-Experience-GSMCOE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center"
            >
              <FaGithub size={20} />
              View Source Code
              <ArrowUpRight size={18} />
            </a>
            <a
              href="https://github.com/VaibhavPatil01/Interview-Experience-GSMCOE"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-green-200 hover:bg-green-50 text-green-700 px-6 py-3 rounded-lg font-medium transition-colors bg-white w-full sm:w-auto justify-center"
            >
              <Star size={20} className="text-green-600" />
              Star on GitHub
              <span className="text-sm font-semibold ml-1 bg-green-50 px-2 py-0.5 rounded text-green-800">2.3k</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GithubSection;
