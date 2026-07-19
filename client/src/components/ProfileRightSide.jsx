import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Sparkles, FileText, Trash2, Plus, X, Link2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser, uploadResumeFile } from '../services/userServices.js';
import penIcon from '../assets/images/icons/pen-svgrepo-com.svg';

const ProfileRightSide = ({ profileData }) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', id]);
      setIsSummaryModalOpen(false);
      setIsSocialLinkModalOpen(false);
      setIsAwardModalOpen(false);
      setIsSkillsModalOpen(false);
      setIsWorkExperienceModalOpen(false);
      setIsEducationModalOpen(false);
      setIsJobPrefModalOpen(false);
      setIsPersonalDetailsModalOpen(false);
    }
  });

  const uploadResumeMutation = useMutation({
    mutationFn: uploadResumeFile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', id]);
    }
  });

  const resumeFileInputRef = useRef(null);

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resumeFile', file);
    uploadResumeMutation.mutate(formData);
  };

  const skillsList = profileData?.skills || [];
  const awardsList = profileData?.awards || [];
  const workExperiencesList = profileData?.workExperiences || [];
  const socialLinksList = profileData?.socialLinks || [];
  const educationList = profileData?.education || [];
  const jobPreferencesData = profileData?.jobPreferences || { preferredJobTitles: [], preferredLocations: [] };
  const personalDetailsData = profileData?.personalDetails || { 
    dob: { day: '', month: '', year: '' }, 
    equalOpportunity: '', 
    countriesOfResidency: [], 
    workPermitCountries: [], 
    speciallyAbled: false 
  };
  const userNationality = profileData?.nationality || '';

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [showAllSkills, setShowAllSkills] = useState(false);
  
  const [isSocialLinkModalOpen, setIsSocialLinkModalOpen] = useState(false);
  const [isNewLink, setIsNewLink] = useState(false);
  const [currentLink, setCurrentLink] = useState('');
  const [editingLinkIndex, setEditingLinkIndex] = useState(null);
  
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
  const [isNewAward, setIsNewAward] = useState(false);
  const [awardTitle, setAwardTitle] = useState('');
  const [awardDescription, setAwardDescription] = useState('');
  const [editingAwardIndex, setEditingAwardIndex] = useState(null);

  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [localSkills, setLocalSkills] = useState([]);
  
  const [isWorkExperienceModalOpen, setIsWorkExperienceModalOpen] = useState(false);
  const [editingWorkExpIndex, setEditingWorkExpIndex] = useState(null);
  const [workExpForm, setWorkExpForm] = useState({
    jobTitle: '',
    company: '',
    startYear: '',
    startMonth: '',
    isCurrentlyWorking: true,
    currency: 'INR',
    currentSalary: '',
    noticePeriod: '',
    industry: '',
    employmentType: '',
    description: ''
  });
  
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingEducationIndex, setEditingEducationIndex] = useState(null);
  const [isNewEducation, setIsNewEducation] = useState(false);
  const [educationForm, setEducationForm] = useState({
    qualification: '',
    university: '',
    passingYear: '',
    educationType: ''
  });
  
  const [isJobPrefModalOpen, setIsJobPrefModalOpen] = useState(false);
  const [jobPrefForm, setJobPrefForm] = useState({ preferredJobTitles: [], preferredLocations: [] });
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  const [isPersonalDetailsModalOpen, setIsPersonalDetailsModalOpen] = useState(false);
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    dob: { day: '', month: '', year: '' },
    equalOpportunity: '',
    countriesOfResidency: [],
    workPermitCountries: [],
    speciallyAbled: false,
    nationality: ''
  });
  const [residencyInput, setResidencyInput] = useState('');
  const [workPermitInput, setWorkPermitInput] = useState('');
  const [isEqOppOpen, setIsEqOppOpen] = useState(false);
  const eqOppOptions = ['Single Parent', 'Working Mother', 'Served in Military', 'Retired(60+)', 'LGBTQ+'];
  
  const [summaryText, setSummaryText] = useState(profileData?.about || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (profileData?.about) setSummaryText(profileData.about);
  }, [profileData]);

  const handleSaveSummary = () => updateProfileMutation.mutate({ about: summaryText });
  
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setLocalSkills([...localSkills, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleSaveSkills = () => {
    updateProfileMutation.mutate({ skills: localSkills });
  };

  const handleSaveEducation = () => {
    if (!educationForm.qualification || !educationForm.university || !educationForm.passingYear || !educationForm.educationType) return;
    
    let updatedEducation = [...educationList];
    if (isNewEducation) {
      updatedEducation.push(educationForm);
    } else {
      updatedEducation[editingEducationIndex] = educationForm;
    }
    
    updateProfileMutation.mutate({ education: updatedEducation });
  };

  const handleSaveJobPreferences = () => {
    updateProfileMutation.mutate({ jobPreferences: jobPrefForm });
  };

  const handleAddJobTitle = () => {
    if (jobTitleInput.trim() && !jobPrefForm.preferredJobTitles.includes(jobTitleInput.trim())) {
      setJobPrefForm({...jobPrefForm, preferredJobTitles: [...jobPrefForm.preferredJobTitles, jobTitleInput.trim()]});
    }
    setJobTitleInput('');
  };

  const handleAddLocation = () => {
    if (locationInput.trim() && !jobPrefForm.preferredLocations.includes(locationInput.trim())) {
      setJobPrefForm({...jobPrefForm, preferredLocations: [...jobPrefForm.preferredLocations, locationInput.trim()]});
    }
    setLocationInput('');
  };

  const handleAddResidency = () => {
    if (residencyInput.trim() && !personalDetailsForm.countriesOfResidency.includes(residencyInput.trim())) {
      setPersonalDetailsForm({...personalDetailsForm, countriesOfResidency: [...personalDetailsForm.countriesOfResidency, residencyInput.trim()]});
    }
    setResidencyInput('');
  };

  const handleAddWorkPermit = () => {
    if (workPermitInput.trim() && !personalDetailsForm.workPermitCountries.includes(workPermitInput.trim())) {
      setPersonalDetailsForm({...personalDetailsForm, workPermitCountries: [...personalDetailsForm.workPermitCountries, workPermitInput.trim()]});
    }
    setWorkPermitInput('');
  };

  const handleSavePersonalDetails = () => {
    const { nationality, ...restPersonalDetails } = personalDetailsForm;
    updateProfileMutation.mutate({ 
      personalDetails: restPersonalDetails,
      nationality: nationality 
    });
    setIsEqOppOpen(false);
  };

  const handleSaveAward = () => {
     let newAwards = [...awardsList];
     if (isNewAward) {
       newAwards.push({ title: awardTitle, description: awardDescription });
     } else if (editingAwardIndex !== null) {
       newAwards[editingAwardIndex] = { title: awardTitle, description: awardDescription };
     }
     updateProfileMutation.mutate({ awards: newAwards });
  };
  
  const handleSaveWorkExperience = () => {
    let newWorkExp = [...workExperiencesList];
    if (editingWorkExpIndex !== null) {
      newWorkExp[editingWorkExpIndex] = workExpForm;
    } else {
      newWorkExp.push(workExpForm);
    }
    updateProfileMutation.mutate({ workExperiences: newWorkExp });
  };

  const handleSaveSocialLink = () => {
    let newLinks = [...socialLinksList];
    if (isNewLink) {
      newLinks.push(currentLink);
    } else if (editingLinkIndex !== null) {
      newLinks[editingLinkIndex] = currentLink;
    }
    updateProfileMutation.mutate({ socialLinks: newLinks });
  };

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

  useEffect(() => {
    if (isSummaryModalOpen || isSocialLinkModalOpen || isAwardModalOpen || isSkillsModalOpen || isWorkExperienceModalOpen || isEducationModalOpen || isJobPrefModalOpen || isPersonalDetailsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSummaryModalOpen, isSocialLinkModalOpen, isAwardModalOpen, isSkillsModalOpen, isWorkExperienceModalOpen, isEducationModalOpen, isJobPrefModalOpen, isPersonalDetailsModalOpen]);

  const navItems = [
    'Profile summary',
    'Work experience',
    'Skills',
    'Education',
    'Job preferences',
  ];

  const dropdownItems = [
    'Personal details',
    'Courses & certifications',
    'Projects',
    'Awards',
    'Social links',
    'Language',
  ];


  const getIsSectionEmpty = (itemName) => {
    switch (itemName) {
      case 'Profile summary': return !profileData?.about;
      case 'Work experience': return workExperiencesList.length === 0;
      case 'Skills': return skillsList.length === 0;
      case 'Education': return educationList.length === 0;
      case 'Job preferences': return jobPreferencesData.preferredJobTitles.length === 0 && jobPreferencesData.preferredLocations.length === 0;
      case 'Personal details': return !personalDetailsData.dob.day && !personalDetailsData.dob.month && !personalDetailsData.dob.year && !personalDetailsData.equalOpportunity && personalDetailsData.countriesOfResidency.length === 0 && personalDetailsData.workPermitCountries.length === 0 && !userNationality;
      case 'Awards': return awardsList.length === 0;
      case 'Social links': return socialLinksList.length === 0;
      default: return false;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Navbar Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-2">
        <div className="flex items-center justify-between gap-2 relative">
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {navItems.map((item) => (
              <button
                key={item}
                className="whitespace-nowrap px-4 py-2 text-[15px] font-medium text-gray-500 hover:bg-green-50 hover:text-green-700 rounded-full transition-colors cursor-pointer relative"
              >
                {item}
                {getIsSectionEmpty(item) && (
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full ml-1.5 align-text-top mt-1"></span>
                )}
              </button>
            ))}
          </div>

          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`p-1 text-gray-700 hover:bg-green-100 hover:text-green-800 rounded-full transition-colors ml-2 cursor-pointer ${dropdownOpen ? 'bg-green-100 text-green-800' : ''}`}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 z-[100] py-2 overflow-hidden">
                {dropdownItems.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2.5 text-[15px] text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors cursor-pointer relative"
                  >
                    {item}
                    {getIsSectionEmpty(item) && (
                      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full ml-1.5 align-text-top mt-1"></span>
                    )}
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
        <p className="text-gray-600 text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">
          {profileData?.about || "No summary provided."}
        </p>
        <button className="flex items-center gap-2 border-[1.5px] border-green-200 text-green-700 px-5 py-2 rounded-full font-semibold text-[15px] hover:bg-green-50 transition-colors shadow-sm">
          <Sparkles className="w-4 h-4 text-green-600" /> Generate by AI
        </button>
      </div>

      {/* Resume Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resume</h3>
        
        {profileData?.resume?.url ? (
          <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between mb-4 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <a href={profileData.resume.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-800 text-[15px] hover:text-blue-600 transition-colors">
                {profileData.resume.filename || 'Resume.pdf'}
              </a>
            </div>
            <button 
              onClick={() => updateProfileMutation.mutate({ resume: null })}
              disabled={updateProfileMutation.isLoading}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-gray-500 text-sm">No resume uploaded.</p>
          </div>
        )}

        <input 
          type="file" 
          accept=".pdf,.doc,.docx"
          className="hidden" 
          ref={resumeFileInputRef} 
          onChange={handleResumeUpload}
        />
        
        <button 
          onClick={() => resumeFileInputRef.current.click()}
          disabled={uploadResumeMutation.isLoading}
          className="text-green-700 font-semibold text-[15px] hover:text-green-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          {uploadResumeMutation.isLoading ? 'Uploading...' : (profileData?.resume?.url ? 'Replace resume' : 'Upload resume')}
        </button>
      </div>

      {/* Work Experience Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Work experience</h3>
          <button 
            onClick={() => {
               setWorkExpForm({
                  jobTitle: '',
                  company: '',
                  startYear: '',
                  startMonth: '',
                  isCurrentlyWorking: true,
                  currency: 'INR',
                  currentSalary: '',
                  noticePeriod: '',
                  industry: '',
                  employmentType: '',
                  description: ''
               });
               setEditingWorkExpIndex(null);
               setIsWorkExperienceModalOpen(true);
            }}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col gap-5">
          {workExperiencesList.length === 0 && <p className="text-gray-500 text-sm">No work experiences added.</p>}
          {workExperiencesList.map((exp, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-[15.5px] font-semibold text-gray-800">{exp.jobTitle}</h4>
                <button 
                  onClick={() => { 
                    setWorkExpForm(exp);
                    setEditingWorkExpIndex(index);
                    setIsWorkExperienceModalOpen(true); 
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <p className="text-[14.5px] text-gray-700 font-medium">{exp.company}</p>
              <p className="text-[13px] text-gray-500">{exp.startMonth} {exp.startYear} - {exp.isCurrentlyWorking ? 'Present' : ''} • {exp.employmentType}</p>
              {exp.description && <p className="text-[14.5px] text-gray-600 mt-2 whitespace-pre-wrap">{exp.description}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Skills Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Skills</h3>
            <button 
              onClick={() => {
                setLocalSkills(skillsList);
                setIsSkillsModalOpen(true);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
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

      {/* Education Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Education</h3>
          <button 
            onClick={() => { 
              setIsNewEducation(true); 
              setEducationForm({ qualification: '', university: '', passingYear: '', educationType: '' }); 
              setIsEducationModalOpen(true); 
            }}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 pointer-events-none" />
          </button>
        </div>
        
        <div className="flex flex-col gap-6">
          {educationList.length === 0 && <p className="text-gray-500 text-sm">No education added.</p>}
          {educationList.map((edu, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h4 className="text-[15.5px] font-semibold text-gray-800">{edu.qualification}</h4>
                <button 
                  onClick={() => { 
                    setIsNewEducation(false); 
                    setEducationForm(edu); 
                    setEditingEducationIndex(index);
                    setIsEducationModalOpen(true); 
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer mt-0.5"
                >
                  <img src={penIcon} alt="edit" className="w-[16px] h-[16px] opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <p className="text-[14.5px] text-gray-600">{edu.university}</p>
              <p className="text-[13.5px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                <span>{edu.passingYear}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span>
                <span>{edu.educationType}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Job Preferences Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Job preferences</h3>
          <button 
            onClick={() => {
              setJobPrefForm(jobPreferencesData);
              setIsJobPrefModalOpen(true);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
          >
            <img src={penIcon} alt="edit" className="w-[22px] h-[22px] opacity-60 hover:opacity-100 transition-opacity" />
          </button>
        </div>
        
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Preferred Job Title</p>
            <p className="text-[15px] font-medium text-gray-800">
              {jobPreferencesData.preferredJobTitles.length > 0 ? jobPreferencesData.preferredJobTitles.join(', ') : '-'}
            </p>
          </div>
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Preferred Location</p>
            <p className="text-[15px] font-medium text-gray-800">
              {jobPreferencesData.preferredLocations.length > 0 ? jobPreferencesData.preferredLocations.join(', ') : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Details Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Personal details</h3>
          <button 
            onClick={() => {
              setPersonalDetailsForm({
                ...personalDetailsData,
                nationality: userNationality
              });
              setIsEqOppOpen(false);
              setIsPersonalDetailsModalOpen(true);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
          >
            <img src={penIcon} alt="edit" className="w-[22px] h-[22px] opacity-60 hover:opacity-100 transition-opacity" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Date of Birth</p>
            <p className="text-[15px] font-medium text-gray-800">
              {personalDetailsData.dob.day || personalDetailsData.dob.month || personalDetailsData.dob.year 
                ? `${personalDetailsData.dob.day} ${personalDetailsData.dob.month} ${personalDetailsData.dob.year}`.trim() 
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Equal Opportunity</p>
            <p className="text-[15px] font-medium text-gray-800">{personalDetailsData.equalOpportunity || '-'}</p>
          </div>
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Countries of Residency</p>
            <p className="text-[15px] font-medium text-gray-800">
              {personalDetailsData.countriesOfResidency.length > 0 ? personalDetailsData.countriesOfResidency.join(', ') : '-'}
            </p>
          </div>
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Work Permit Countries</p>
            <p className="text-[15px] font-medium text-gray-800">
              {personalDetailsData.workPermitCountries.length > 0 ? personalDetailsData.workPermitCountries.join(', ') : '-'}
            </p>
          </div>
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Nationality</p>
            <p className="text-[15px] font-medium text-gray-800">{userNationality || '-'}</p>
          </div>
          <div>
            <p className="text-[14.5px] text-gray-500 mb-1">Specially Abled</p>
            <p className="text-[15px] font-medium text-gray-800">{personalDetailsData.speciallyAbled ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>

      {/* Awards Card */}
      <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.02)] border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Awards</h3>
          <button 
            onClick={() => { setIsNewAward(true); setAwardTitle(''); setAwardDescription(''); setIsAwardModalOpen(true); }}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5 pointer-events-none" />
          </button>
        </div>
        
        <div className="flex flex-col gap-5">
          {awardsList.length === 0 && <p className="text-gray-500 text-sm">No awards added.</p>}
          {awardsList.map((award, index) => (
            <div key={index}>
              <div className="flex items-center gap-2 mb-1.5">
                <h4 className="text-[15.5px] font-semibold text-gray-800">{award.title}</h4>
                <button 
                  onClick={() => { 
                    setIsNewAward(false); 
                    setAwardTitle(award.title); 
                    setAwardDescription(award.description); 
                    setEditingAwardIndex(index);
                    setIsAwardModalOpen(true); 
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              </div>
              <p className="text-[14.5px] text-gray-600">{award.description}</p>
            </div>
          ))}
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
          {socialLinksList.length === 0 && <p className="text-gray-500 text-sm">No social links added.</p>}
          {socialLinksList.map((link, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-gray-600 shrink-0 transform -rotate-45" />
                <a href={link} target="_blank" rel="noreferrer" className="text-[15px] text-gray-600 hover:text-blue-600 truncate transition-colors">{link}</a>
              </div>
              <button 
                onClick={() => { 
                  setIsNewLink(false); 
                  setCurrentLink(link); 
                  setEditingLinkIndex(index);
                  setIsSocialLinkModalOpen(true); 
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer shrink-0"
              >
                <img src={penIcon} alt="edit" className="w-[18px] h-[18px] opacity-60 hover:opacity-100 transition-opacity" />
              </button>
            </div>
          ))}
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
                onClick={handleSaveSummary}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-8 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
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
                <button 
                  onClick={() => {
                    const newLinks = socialLinksList.filter((_, i) => i !== editingLinkIndex);
                    updateProfileMutation.mutate({ socialLinks: newLinks });
                  }}
                  className="text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors cursor-pointer"
                >
                  Delete Link
                </button>
              )}
              <button 
                onClick={handleSaveSocialLink}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
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
                <button 
                  onClick={() => {
                    const newAwards = awardsList.filter((_, i) => i !== editingAwardIndex);
                    updateProfileMutation.mutate({ awards: newAwards });
                  }}
                  className="text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors cursor-pointer"
                >
                  Delete Award
                </button>
              )}
              <button 
                onClick={handleSaveAward}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
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
                  {localSkills.map((skill, index) => (
                    <span key={index} className="flex items-center gap-1.5 bg-white text-gray-700 px-3.5 py-1.5 rounded-full text-[14px] font-medium border border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                      {skill}
                      <X onClick={() => {
                         const newSkills = localSkills.filter(s => s !== skill);
                         setLocalSkills(newSkills);
                      }} className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <input 
                    type="text" 
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Maximum 50 can be added" 
                    className="flex-1 text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                  />
                  <button 
                    onClick={handleAddSkill} 
                    disabled={!newSkillInput.trim()} 
                    className="text-blue-600 font-semibold text-[14.5px] hover:text-blue-800 cursor-pointer disabled:opacity-50 px-2"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
              <button 
                onClick={handleSaveSkills}
                disabled={updateProfileMutation.isLoading}
                className={`text-white font-semibold px-10 py-2.5 rounded-full transition-colors shadow-sm cursor-pointer disabled:opacity-50 bg-green-600 hover:bg-green-700`}
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Experience Modal */}
      {isWorkExperienceModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsWorkExperienceModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[17px] font-bold text-gray-900">Add work experience</h2>
            </div>
            
            <div className="p-6 pb-6 space-y-5 overflow-y-auto max-h-[60vh]" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Job Title</label>
                  <span className="text-red-500">*</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Search job title"
                  value={workExpForm.jobTitle}
                  onChange={(e) => setWorkExpForm({...workExpForm, jobTitle: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Company</label>
                  <span className="text-red-500">*</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter your company name"
                  value={workExpForm.company}
                  onChange={(e) => setWorkExpForm({...workExpForm, company: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Start Date</label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-4">
                  <select 
                    value={workExpForm.startYear}
                    onChange={(e) => setWorkExpForm({...workExpForm, startYear: e.target.value})}
                    className="w-1/2 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                  >
                    <option value="" disabled>Years</option>
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select 
                    value={workExpForm.startMonth}
                    onChange={(e) => setWorkExpForm({...workExpForm, startMonth: e.target.value})}
                    className="w-1/2 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                  >
                    <option value="" disabled>Months</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="currentlyWorking"
                  checked={workExpForm.isCurrentlyWorking}
                  onChange={(e) => setWorkExpForm({...workExpForm, isCurrentlyWorking: e.target.checked})}
                  className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 accent-gray-900 cursor-pointer"
                />
                <label htmlFor="currentlyWorking" className="text-[15px] font-medium text-gray-800 cursor-pointer">
                  Currently working here
                </label>
              </div>

              {workExpForm.isCurrentlyWorking && (
                <div>
                  <div className="mb-2 flex items-center gap-1">
                    <label className="text-[14.5px] font-medium text-gray-700">Current Salary (Annually)</label>
                    <span className="text-red-500">*</span>
                  </div>
                  <div className="flex border border-gray-200 rounded-md overflow-hidden focus-within:border-gray-400 transition-colors">
                    <select 
                      value={workExpForm.currency}
                      onChange={(e) => setWorkExpForm({...workExpForm, currency: e.target.value})}
                      className="bg-gray-50 border-r border-gray-200 px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="INR">🇮🇳 INR</option>
                      <option value="USD">🇺🇸 USD</option>
                      <option value="EUR">🇪🇺 EUR</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Enter Salary"
                      value={workExpForm.currentSalary}
                      onChange={(e) => setWorkExpForm({...workExpForm, currentSalary: e.target.value})}
                      className="w-full px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Notice Period</label>
                  <span className="text-red-500">*</span>
                </div>
                <select 
                  value={workExpForm.noticePeriod}
                  onChange={(e) => setWorkExpForm({...workExpForm, noticePeriod: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                >
                  <option value="" disabled>Select Notice Period</option>
                  <option value="15 Days">15 Days or less</option>
                  <option value="1 Month">1 Month</option>
                  <option value="2 Months">2 Months</option>
                  <option value="3 Months">3 Months</option>
                  <option value="More than 3 Months">More than 3 Months</option>
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Industry</label>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter or select your Industry"
                  value={workExpForm.industry}
                  onChange={(e) => setWorkExpForm({...workExpForm, industry: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Employment Type</label>
                </div>
                <select 
                  value={workExpForm.employmentType}
                  onChange={(e) => setWorkExpForm({...workExpForm, employmentType: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                >
                  <option value="" disabled>Select Employment Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Description</label>
                </div>
                <textarea 
                  placeholder="Enter Your Description"
                  value={workExpForm.description}
                  onChange={(e) => {
                    if(e.target.value.length <= 4000) {
                      setWorkExpForm({...workExpForm, description: e.target.value})
                    }
                  }}
                  className="w-full h-32 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                />
                <p className="text-[13px] text-gray-400 mt-1">Max. {workExpForm.description.length}/4000 character</p>
              </div>
            </div>
            
            <div className={`px-6 py-4 border-t border-gray-100 flex items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] ${editingWorkExpIndex !== null ? 'justify-between' : 'justify-end'}`}>
              {editingWorkExpIndex !== null && (
                <button 
                  onClick={() => {
                    const newWorkExp = workExperiencesList.filter((_, i) => i !== editingWorkExpIndex);
                    updateProfileMutation.mutate({ workExperiences: newWorkExp });
                  }}
                  className="text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors cursor-pointer"
                >
                  Delete Experience
                </button>
              )}
              <button 
                onClick={handleSaveWorkExperience}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {isEducationModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsEducationModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-xl font-bold text-gray-900">{isNewEducation ? 'Add education' : 'Edit education'}</h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Qualification</label>
                  <span className="text-red-500">*</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Select your degree"
                  value={educationForm.qualification}
                  onChange={(e) => setEducationForm({...educationForm, qualification: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>
              
              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">University/Institute</label>
                  <span className="text-red-500">*</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Select your University"
                  value={educationForm.university}
                  onChange={(e) => setEducationForm({...educationForm, university: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Passing Year</label>
                  <span className="text-red-500">*</span>
                </div>
                <select 
                  value={educationForm.passingYear}
                  onChange={(e) => setEducationForm({...educationForm, passingYear: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 transition-colors appearance-none bg-white"
                >
                  <option value="" disabled>Select year</option>
                  {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() + 5 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Education Type</label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="flex gap-4 mt-2">
                  {['Full time', 'Part time', 'Correspondence'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors">
                      <input 
                        type="radio" 
                        name="educationType" 
                        value={type}
                        checked={educationForm.educationType === type}
                        onChange={(e) => setEducationForm({...educationForm, educationType: e.target.value})}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-[14px] text-gray-700 font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`px-6 py-4 border-t border-gray-100 flex items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] ${editingEducationIndex !== null ? 'justify-between' : 'justify-end'}`}>
              {editingEducationIndex !== null && (
                <button 
                  onClick={() => {
                    const newEdu = educationList.filter((_, i) => i !== editingEducationIndex);
                    updateProfileMutation.mutate({ education: newEdu });
                  }}
                  className="text-gray-500 hover:text-gray-700 font-medium text-[15px] transition-colors cursor-pointer"
                >
                  Delete Education
                </button>
              )}
              <button 
                onClick={handleSaveEducation}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Preferences Modal */}
      {isJobPrefModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => setIsJobPrefModalOpen(false)}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-[17px] font-bold text-gray-900">Job preferences</h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar max-h-[70vh]">
              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Preferred Job Title(s)</label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 pb-3 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2 max-h-[150px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                    {jobPrefForm.preferredJobTitles.map((title, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-white text-gray-700 px-3.5 py-1.5 rounded-full text-[14px] font-medium border border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                        {title}
                        <X onClick={() => setJobPrefForm({...jobPrefForm, preferredJobTitles: jobPrefForm.preferredJobTitles.filter((_, idx) => idx !== i)})} className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Enter or select your preferred job title"
                      value={jobTitleInput}
                      onChange={(e) => setJobTitleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddJobTitle();
                        }
                      }}
                      className="flex-1 text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                    <button 
                      onClick={handleAddJobTitle} 
                      disabled={!jobTitleInput.trim()} 
                      className="text-blue-600 font-semibold text-[14.5px] hover:text-blue-800 cursor-pointer disabled:opacity-50 px-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-1">
                  <label className="text-[14.5px] font-medium text-gray-700">Preferred Location(s)</label>
                  <span className="text-red-500">*</span>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 pb-3 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2 max-h-[150px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                    {jobPrefForm.preferredLocations.map((loc, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-white text-gray-700 px-3.5 py-1.5 rounded-full text-[14px] font-medium border border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                        {loc}
                        <X onClick={() => setJobPrefForm({...jobPrefForm, preferredLocations: jobPrefForm.preferredLocations.filter((_, idx) => idx !== i)})} className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Enter or select your preferred location"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddLocation();
                        }
                      }}
                      className="flex-1 text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                    <button 
                      onClick={handleAddLocation} 
                      disabled={!locationInput.trim()} 
                      className="text-blue-600 font-semibold text-[14.5px] hover:text-blue-800 cursor-pointer disabled:opacity-50 px-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] justify-end">
              <button 
                onClick={handleSaveJobPreferences}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Personal Details Modal */}
      {isPersonalDetailsModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/60 p-4">
          <button 
            onClick={() => {
              setIsEqOppOpen(false);
              setIsPersonalDetailsModalOpen(false);
            }}
            className="mb-4 bg-gray-800/80 text-white rounded-full p-2.5 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.05)]">
              <h2 className="text-[17px] font-bold text-gray-900">Personal details</h2>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar max-h-[70vh]">
              <div>
                <label className="block text-[14.5px] font-medium text-gray-700 mb-2">Date of Birth</label>
                <div className="flex gap-4">
                  <select 
                    value={personalDetailsForm.dob.day}
                    onChange={(e) => setPersonalDetailsForm({...personalDetailsForm, dob: {...personalDetailsForm.dob, day: e.target.value}})}
                    className="flex-1 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select 
                    value={personalDetailsForm.dob.month}
                    onChange={(e) => setPersonalDetailsForm({...personalDetailsForm, dob: {...personalDetailsForm.dob, month: e.target.value}})}
                    className="flex-1 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">Month</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select 
                    value={personalDetailsForm.dob.year}
                    onChange={(e) => setPersonalDetailsForm({...personalDetailsForm, dob: {...personalDetailsForm.dob, year: e.target.value}})}
                    className="flex-1 border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400 bg-white"
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[14.5px] font-medium text-gray-700 mb-2">Equal Opportunity</label>
                <div className="relative">
                  <div 
                    onClick={() => setIsEqOppOpen(!isEqOppOpen)}
                    className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] bg-white cursor-pointer flex justify-between items-center"
                  >
                    <span className={personalDetailsForm.equalOpportunity ? 'text-gray-800' : 'text-gray-400'}>
                      {personalDetailsForm.equalOpportunity || 'Select your equal opportunity'}
                    </span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isEqOppOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  
                  {isEqOppOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                      {eqOppOptions.map((option, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setPersonalDetailsForm({...personalDetailsForm, equalOpportunity: option});
                            setIsEqOppOpen(false);
                          }}
                          className="px-3.5 py-2.5 text-[15px] text-gray-800 cursor-pointer hover:bg-green-50 transition-colors"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[14.5px] font-medium text-gray-700 mb-2">Countries of Residency</label>
                <div className="border border-gray-300 rounded-lg p-4 pb-3 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2 max-h-[150px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                    {personalDetailsForm.countriesOfResidency.map((country, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-white text-gray-700 px-3.5 py-1.5 rounded-full text-[14px] font-medium border border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                        {country}
                        <X onClick={() => setPersonalDetailsForm({...personalDetailsForm, countriesOfResidency: personalDetailsForm.countriesOfResidency.filter((_, idx) => idx !== i)})} className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Choose the countries where you hold residency"
                      value={residencyInput}
                      onChange={(e) => setResidencyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddResidency();
                        }
                      }}
                      className="flex-1 text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                    <button 
                      onClick={handleAddResidency} 
                      disabled={!residencyInput.trim()} 
                      className="text-blue-600 font-semibold text-[14.5px] hover:text-blue-800 cursor-pointer disabled:opacity-50 px-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[14.5px] font-medium text-gray-700 mb-2">Work Permit Countries</label>
                <div className="border border-gray-300 rounded-lg p-4 pb-3 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2 max-h-[150px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                    {personalDetailsForm.workPermitCountries.map((country, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-white text-gray-700 px-3.5 py-1.5 rounded-full text-[14px] font-medium border border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
                        {country}
                        <X onClick={() => setPersonalDetailsForm({...personalDetailsForm, workPermitCountries: personalDetailsForm.workPermitCountries.filter((_, idx) => idx !== i)})} className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <input
                      type="text"
                      placeholder="Select the countries you have a work permit for"
                      value={workPermitInput}
                      onChange={(e) => setWorkPermitInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddWorkPermit();
                        }
                      }}
                      className="flex-1 text-[14.5px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                    />
                    <button 
                      onClick={handleAddWorkPermit} 
                      disabled={!workPermitInput.trim()} 
                      className="text-blue-600 font-semibold text-[14.5px] hover:text-blue-800 cursor-pointer disabled:opacity-50 px-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[14.5px] font-medium text-gray-700 mb-2">Nationality</label>
                <input 
                  type="text"
                  value={personalDetailsForm.nationality}
                  onChange={(e) => setPersonalDetailsForm({...personalDetailsForm, nationality: e.target.value})}
                  className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-[15px] text-gray-800 focus:outline-none focus:border-gray-400"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPersonalDetailsForm({...personalDetailsForm, speciallyAbled: !personalDetailsForm.speciallyAbled})}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${personalDetailsForm.speciallyAbled ? 'bg-green-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${personalDetailsForm.speciallyAbled ? 'translate-x-4' : 'translate-x-1'}`}
                  />
                </button>
                <span className="text-[14.5px] font-medium text-gray-700">I am specially abled</span>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex items-center bg-white shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)] justify-end">
              <button 
                onClick={handleSavePersonalDetails}
                disabled={updateProfileMutation.isLoading}
                className="bg-green-600 text-white font-semibold px-10 py-2.5 rounded-full hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileRightSide;
