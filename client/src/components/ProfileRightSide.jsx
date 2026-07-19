import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Sparkles, FileText, Trash2, Plus, X, Link2 } from 'lucide-react';
import penIcon from '../assets/images/icons/pen-svgrepo-com.svg';

const ProfileRightSide = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [isSocialLinkModalOpen, setIsSocialLinkModalOpen] = useState(false);
  const [isNewLink, setIsNewLink] = useState(false);
  const [currentLink, setCurrentLink] = useState('');
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isNewAward, setIsNewAward] = useState(false);
  const [awardTitle, setAwardTitle] = useState('');
  const [awardDescription, setAwardDescription] = useState('');
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [summaryText, setSummaryText] = useState("I am looking for an opportunity where I can apply my skills in software development, problem-solving, and web application deployment, while continuing to learn from experienced professionals. I value roles that provide a balance of hands-on development and growth opportunities, allowing me to contribute meaningfully to the team and the product.");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    'Profile summary',
    'Work experience',
    'Skills',
    'Education',
    'Job preferences',
    'Personal details',
  ];

  const dropdownItems = [
    'Courses & certifications',
    'Projects',
    'Awards',
    'Social links',
    'Language',
  ];

  const skillsList = [
    'Boot Strap', 'C++', 'Css', 'Redux', 'Problem Solving', 'Html', 'Node.js', 'Express.js', 'Sql', 'Git',
    'Communcation', 'TailwindCSS', 'Mysql', 'Javascript', 'Mongodb', 'React.js', 'Postman',
    'Data Structures And Algorithms', 'Css 3', 'Html5', 'Express', 'Node', 'React', 'Rest Apis',
    'Asynchronous programming', 'Github', 'Vite', 'Restful Apis', 'Webpack', 'Software Development',
    'Back-End Web Development', 'Debugging Tool', 'Analytical Skills', 'Apis', 'Web Services', 'UI', 'Vercel',
    'ChatGPT', 'Netlify', 'Gemini'
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Navbar Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-2">
        <div className="flex items-center justify-between gap-2 relative">
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {navItems.map((item) => (
              <button
                key={item}
                className="whitespace-nowrap px-4 py-2 text-[15px] font-medium text-gray-500 hover:text-gray-800 rounded-md transition-colors"
              >
                {item}
                {item === 'Work experience' && (
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full ml-1.5 align-text-top mt-1"></span>
                )}
              </button>
            ))}
          </div>

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`p-1 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-md transition-colors ml-2 cursor-pointer ${dropdownOpen ? 'bg-green-100 text-green-800' : ''}`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-[100] py-2">
                {dropdownItems.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2.5 text-[15px] text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Profile summary</h3>
          <button onClick={() => setIsSummaryModalOpen(true)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <img src={penIcon} alt="edit" className="w-[22px] h-[22px] opacity-60 hover:opacity-100 transition-opacity" />
          </button>
        </div>
        <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
          I am looking for an opportunity where I can apply my skills in software development, application deployment, while continuing to learn from experienced professionals. I value a balance of hands-on development and growth opportunities, allowing me to contribute to both the team and the product.
        </p>
        <button className="flex items-center gap-2 border-[1.5px] border-green-200 text-green-700 px-5 py-2 rounded-full font-semibold text-[15px] hover:bg-green-50 transition-colors shadow-sm">
          <Sparkles className="w-4 h-4 text-green-600" /> Generate by AI
        </button>
      </div>

      {/* Resume Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
        <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between mb-4 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-800 text-[15px]">Vaibhav_Patil_Resume.pdf</span>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <button className="text-green-700 font-semibold text-[15px] hover:text-green-800 transition-colors">
          Replace resume
        </button>
      </div>

      {/* Work Experience Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">Work experience</h3>
        <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Skills Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Skills</h3>
          <button 
            onClick={() => setIsSkillsModalOpen(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <img src={penIcon} alt="edit" className="w-[22px] h-[22px] opacity-60 hover:opacity-100 transition-opacity" />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2.5">
          {(showAllSkills ? skillsList : skillsList.slice(0, 10)).map((skill, index) => (
            <span key={index} className="bg-gray-50/80 text-gray-600 px-3 py-1.5 rounded-full text-[14px] font-medium border border-gray-100/80 cursor-default hover:bg-gray-100 transition-colors">
              {skill}
            </span>
          ))}
        </div>
        
        {!showAllSkills && skillsList.length > 10 && (
          <div className="mt-6 flex justify-center">
            <button 
              onClick={() => setShowAllSkills(true)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-medium text-[14.5px] transition-colors cursor-pointer"
            >
              + {skillsList.length - 10} more
              <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Awards Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Awards</h3>
          <button 
            onClick={() => { setIsNewAward(true); setAwardTitle(''); setAwardDescription(''); setIsAwardModalOpen(true); }}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="text-[15.5px] font-semibold text-gray-800">Academic Rank</h4>
              <button 
                onClick={() => { setIsNewAward(false); setAwardTitle('Academic Rank'); setAwardDescription('Secured 5th rank in First Year among all departments.'); setIsAwardModalOpen(true); }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <p className="text-[14.5px] text-gray-600">Secured 5th rank in First Year among all departments.</p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="text-[15.5px] font-semibold text-gray-800">HackerRank</h4>
              <button 
                onClick={() => { setIsNewAward(false); setAwardTitle('HackerRank'); setAwardDescription('Certified in Problem Solving (Intermediate), 5-star in C++'); setIsAwardModalOpen(true); }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <p className="text-[14.5px] text-gray-600">Certified in Problem Solving (Intermediate), 5-star in C++</p>
          </div>
        </div>
      </div>

      {/* Social Links Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
          <button 
            onClick={() => { setIsNewLink(true); setCurrentLink(''); setIsSocialLinkModalOpen(true); }}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-gray-600 shrink-0 transform -rotate-45" />
              <a href="#" className="text-[15px] text-gray-600 hover:text-blue-600 truncate transition-colors">https://www.linkedin.com/in/vaibhav-patil13</a>
            </div>
            <button 
              onClick={() => { setIsNewLink(false); setCurrentLink('https://www.linkedin.com/in/vaibhav-patil13'); setIsSocialLinkModalOpen(true); }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
            >
              <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-gray-600 shrink-0 transform -rotate-45" />
              <a href="#" className="text-[15px] text-gray-600 hover:text-blue-600 truncate transition-colors">https://leetcode.com/u/VaibhavPatil01/</a>
            </div>
            <button 
              onClick={() => { setIsNewLink(false); setCurrentLink('https://leetcode.com/u/VaibhavPatil01/'); setIsSocialLinkModalOpen(true); }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
            >
              <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-gray-600 shrink-0 transform -rotate-45" />
              <a href="#" className="text-[15px] text-gray-600 hover:text-blue-600 truncate transition-colors">https://www.geeksforgeeks.org/user/vaibhavpatil01/</a>
            </div>
            <button 
              onClick={() => { setIsNewLink(false); setCurrentLink('https://www.geeksforgeeks.org/user/vaibhavpatil01/'); setIsSocialLinkModalOpen(true); }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
            >
              <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
          
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-gray-600 shrink-0 transform -rotate-45" />
              <a href="#" className="text-[15px] text-gray-600 hover:text-blue-600 truncate transition-colors">https://github.com/VaibhavPatil01</a>
            </div>
            <button 
              onClick={() => { setIsNewLink(false); setCurrentLink('https://github.com/VaibhavPatil01'); setIsSocialLinkModalOpen(true); }}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
            >
              <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Summary Edit Modal */}
      {isSummaryModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsSummaryModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[17px] font-bold text-gray-900">Profile summary</h2>
            </div>
            
            <div className="p-6">
              <div className="relative mb-2">
                <textarea 
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  className="w-full h-56 border border-gray-200 rounded-xl p-4 pr-4 pb-14 text-[15px] text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400 resize-none leading-relaxed [&::-webkit-scrollbar]:hidden"
                />
                <button className="absolute bottom-4 right-4 flex items-center gap-2 border-[1.5px] border-green-200 text-green-700 px-4 py-2 rounded-full font-semibold text-[14px] hover:bg-green-50 transition-colors bg-white shadow-sm cursor-pointer">
                  <Sparkles className="w-4 h-4 text-green-600" /> Generate by AI
                </button>
              </div>
              
              <p className="text-[13px] text-gray-400">Max. {summaryText.length}/4000 character</p>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsSummaryModalOpen(false)}
                className="bg-green-600 text-white font-semibold px-8 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Link Edit Modal */}
      {isSocialLinkModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsSocialLinkModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[17px] font-bold text-gray-900">Social Link</h2>
            </div>
            
            <div className="p-6 pb-20">
              <div className="mb-2 flex items-center gap-1">
                <label className="text-[14.5px] font-medium text-gray-700">Title</label>
                <span className="text-red-500">*</span>
              </div>
              <input 
                type="text" 
                value={currentLink}
                onChange={(e) => setCurrentLink(e.target.value)}
                className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            
            <div className={`px-6 py-4 border-t border-gray-100 flex items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] ${isNewLink ? 'justify-end' : 'justify-between'}`}>
              {!isNewLink && (
                <button className="text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors cursor-pointer">
                  Delete Link
                </button>
              )}
              <button 
                onClick={() => setIsSocialLinkModalOpen(false)}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Edit Modal */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsAwardModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[17px] font-bold text-gray-900">Edit award</h2>
            </div>
            
            <div className="p-6 pb-6 space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Title</label>
                  <span className="text-red-500">*</span>
                </div>
                <input 
                  type="text" 
                  value={awardTitle}
                  onChange={(e) => setAwardTitle(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Description</label>
                </div>
                <textarea 
                  value={awardDescription}
                  onChange={(e) => setAwardDescription(e.target.value)}
                  className="w-full h-32 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                />
                <p className="text-[13px] text-gray-400 mt-1">Max. {awardDescription.length}/1000 character</p>
              </div>
            </div>
            
            <div className={`px-6 py-4 border-t border-gray-100 flex items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] ${isNewAward ? 'justify-end' : 'justify-between'}`}>
              {!isNewAward && (
                <button className="text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors cursor-pointer">
                  Delete Award
                </button>
              )}
              <button 
                onClick={() => setIsAwardModalOpen(false)}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Edit Modal */}
      {isSkillsModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsSkillsModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[17px] font-bold text-gray-900">Skills</h2>
            </div>
            
            <div className="p-6 pb-6">
              <div className="border border-gray-300 rounded-lg p-4 pb-3 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-2 max-h-[280px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {skillsList.map((skill, index) => (
                    <span key={index} className="flex items-center gap-1.5 bg-white text-gray-700 px-3.5 py-1.5 rounded-full text-[14px] font-medium border border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                      {skill}
                      <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                    </span>
                  ))}
                </div>
                <div className="mt-2">
                  <input 
                    type="text" 
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Maximum 50 can be added" 
                    className="w-full text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => { setIsSkillsModalOpen(false); setNewSkillInput(''); }}
                className={`text-white font-semibold px-10 py-2.5 rounded-full transition-colors shadow-sm cursor-pointer ${newSkillInput.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRightSide;
