import React, { useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Formik, FieldArray } from 'formik';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { createPost, editPost, getPost, getCompanyAndRoleList } from '../services/postServices.js';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import postFormImage from '../assets/images/pages/post-form.png';
import { ChevronDown, ChevronUp, X, Plus, Trash2, CheckCircle2, MessageSquare, BookOpen, PenTool, ShieldAlert, Eye, Clock, GripVertical } from 'lucide-react';
import { useAppSelector } from '../redux/store.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Options Constants
const hiringTypes = ['On Campus', 'Off Campus', 'Referral'];
const interviewModes = ['Online', 'Offline', 'Hybrid'];
const results = ['Selected', 'Rejected', 'Waiting'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const roundTypes = ['Online Assessment', 'Technical Interview', 'HR Interview', 'Managerial Round', 'System Design Round'];
const roundDurations = ['< 15 min', '15 min', '30 min', '45 min', '1 hr', '1 hr 15 min', '1 hr 30 min', '2 hr', '> 2 hr'];
const techOptions = ['React', 'Node.js', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'SQL', 'MongoDB', 'JavaScript', 'TypeScript', 'Angular', 'Vue.js', 'Spring Boot', 'Django'];
const dsaOptions = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Sorting', 'Searching', 'Hashing'];
const coreOptions = ['DBMS', 'Operating Systems', 'Computer Networks', 'Object Oriented Programming', 'System Design'];
const durations = ['< 1 Month', '1-2 Months', '3-6 Months', '> 6 Months'];

const MultiSelect = ({ options, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter(v => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="relative">
      <div
        className={`w-full min-h-[50px] mt-2 p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg flex flex-wrap gap-2 cursor-pointer bg-white items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 && <span className="text-gray-400">{placeholder}</span>}
        {value.map(v => (
          <span key={v} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm flex items-center gap-1">
            {v}
            <button type="button" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); toggle(v); }}><X size={14} /></button>
          </span>
        ))}
        <ChevronDown className="absolute right-3 text-gray-400" size={20} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded text-green-600 focus:ring-green-500 cursor-pointer" checked={value.includes(opt)} onChange={() => toggle(opt)} />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

const SingleSelect = ({ options, value, onChange, placeholder, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setIsOpen(false);
  };

  const selectedOpt = options.find(o => o.value === value);

  return (
    <div className="relative mt-2" ref={containerRef}>
      <div
        className={`w-full p-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg flex gap-2 cursor-pointer bg-white items-center justify-between ${isOpen ? 'ring-2 ring-green-500 border-transparent' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map(opt => (
            <div 
              key={opt.value} 
              className={`px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${value === opt.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function PostForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const formRef = useRef();
  const [expandedRounds, setExpandedRounds] = useState({});
  const toggleRound = (index) => setExpandedRounds(prev => ({ ...prev, [index]: prev[index] === undefined ? false : !prev[index] }));

  const { data: companyAndRoleQuery } = useQuery({
    queryKey: ['company-role-list'],
    queryFn: () => getCompanyAndRoleList()
  });

  const { data: postToEdit, isLoading: isFetchingPost } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    enabled: isEditMode
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (postData) => isEditMode ? editPost(postData, id, 'published') : createPost(postData, 'published'),
    onError: (error) => {
      toast.error(error.response?.data?.message || 'An error occurred');
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate(`/post/${isEditMode ? id : data.postId}`);
    }
  });

  const parseDuration = (durationStr) => {
    let hr = '', min = '';
    if (!durationStr) return { hr, min };
    const hrMatch = durationStr.match(/(\d+)\s*hr/);
    const minMatch = durationStr.match(/(\d+)\s*min/);
    if (hrMatch) hr = hrMatch[1];
    if (minMatch) min = minMatch[1];
    return { hr, min };
  };

  const initialValues = isEditMode && postToEdit ? {
    company: postToEdit.company || '',
    role: postToEdit.role || '',
    hiringType: postToEdit.hiringType || '',
    interviewMode: postToEdit.interviewMode || '',
    interviewDate: postToEdit.interviewDate || '',
    result: postToEdit.result || '',
    content: postToEdit.content || '',
    rounds: postToEdit.rounds?.length > 0 ? postToEdit.rounds.map(r => ({
      roundType: r.roundType || '',
      durationHr: parseDuration(r.duration).hr,
      durationMin: parseDuration(r.duration).min,
      difficulty: r.difficulty || '',
      topicsCovered: r.topicsCovered || [],
      questionsAsked: r.questionsAsked?.length > 0 ? r.questionsAsked : [''],
      experienceAndTips: r.experienceAndTips || '',
      isMostImportant: r.isMostImportant || false,
    })) : [
      {
        roundType: '',
        durationHr: '',
        durationMin: '',
        difficulty: '',
        topicsCovered: [],
        questionsAsked: [''],
        experienceAndTips: '',
        isMostImportant: false,
      }
    ],
    salary: {
      base: postToEdit.salary?.base || '',
      bonus: postToEdit.salary?.bonus || '',
      stocks: postToEdit.salary?.stocks || '',
      totalCTC: postToEdit.salary?.totalCTC || '',
      currency: postToEdit.salary?.currency || 'INR'
    },
    technologies: postToEdit.technologies || [],
    dsaTopics: postToEdit.dsaTopics || [],
    coreSubjects: postToEdit.coreSubjects || [],
    preparationDuration: postToEdit.preparationDuration || '',
    preparationResources: postToEdit.preparationResources || '',
    overallTips: postToEdit.overallTips || '',
    isAnonymous: postToEdit.isAnonymous || false,
  } : {
    company: '',
    role: '',
    hiringType: '',
    interviewMode: '',
    interviewDate: '',
    result: '',
    content: '',
    rounds: [
      {
        roundType: '',
        durationHr: '',
        durationMin: '',
        difficulty: '',
        topicsCovered: [],
        questionsAsked: [''],
        experienceAndTips: '',
        isMostImportant: false,
      }
    ],
    salary: {
      base: '',
      bonus: '',
      stocks: '',
      totalCTC: '',
      currency: 'INR'
    },
    technologies: [],
    dsaTopics: [],
    coreSubjects: [],
    preparationDuration: '',
    preparationResources: '',
    overallTips: '',
    isAnonymous: false,
  };

  const validationSchema = Yup.object({
    company: Yup.string().required('Required'),
    role: Yup.string().required('Required'),
    hiringType: Yup.string().required('Required'),
    interviewMode: Yup.string().required('Required'),
    interviewDate: Yup.string().required('Required'),
    result: Yup.string().required('Required'),
    content: Yup.string().required('Required'),
    rounds: Yup.array().of(
      Yup.object({
        roundType: Yup.string().required('Required'),
        durationHr: Yup.number().typeError('Invalid').min(0, 'Invalid'),
        durationMin: Yup.number().typeError('Invalid').min(0, 'Invalid').max(59, 'Invalid'),
        difficulty: Yup.string().required('Required'),
        questionsAsked: Yup.array().of(Yup.string().required('Required')).min(1, 'At least one question is required'),
        experienceAndTips: Yup.string().required('Required'),
      }).test('duration-check', 'Duration is required', function (value) {
        const hr = Number(value.durationHr) || 0;
        const min = Number(value.durationMin) || 0;
        if (hr === 0 && min === 0) {
          return this.createError({ path: `${this.path}.durationMin`, message: 'Required' });
        }
        return true;
      })
    ).min(1, 'At least one round is required'),
    overallTips: Yup.string().required('Required'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    // Process rounds to add a duration string
    const processedRounds = values.rounds.map(round => {
      let durationStr = '';
      if (round.durationHr && round.durationHr !== '0') durationStr += `${round.durationHr} hr `;
      if (round.durationMin && round.durationMin !== '0') durationStr += `${round.durationMin} min`;
      
      return {
        ...round,
        duration: durationStr.trim() || undefined
      };
    });

    // Convert status explicitly since it's required by backend
    const submissionData = {
      ...values,
      rounds: processedRounds,
      status: 'published'
    };
    mutate(submissionData, {
      onSettled: () => setSubmitting(false)
    });
  };

  if (isEditMode && isFetchingPost) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading post details...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Create Interview Experience Post | Interview Experience</title>
        <meta name="description" content="Share your interview experience to help other students" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">Home &gt; {isEditMode ? 'Edit Post' : 'Create Post'}</div>
              <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Update Interview Experience Post' : 'Create Interview Experience Post'}</h1>
              <p className="text-gray-500 mt-1">{isEditMode ? 'Update your interview experience details' : 'Share your interview experience to help other students'}</p>
            </div>
            <div className="flex gap-4">
              <button className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2">
                <BookOpen size={18} />
                Save as Draft
              </button>
              <button disabled={isLoading} onClick={() => { if (formRef.current) formRef.current.handleSubmit() }} className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
                <CheckCircle2 size={18} />
                {isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
              </button>
            </div>
          </div>

          <Formik
            innerRef={formRef}
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {(formik) => {
              const handleScrollToError = () => {
                const firstErrorField = Object.keys(formik.errors)[0];
                if (firstErrorField) {
                  const errorElement = document.getElementsByName(firstErrorField)[0];
                  if (errorElement && typeof errorElement.scrollIntoView === 'function') {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    errorElement.focus();
                  }
                }
              };

              return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    if (!formik.isValid) {
                      handleScrollToError();
                      toast.error("Please fill all required fields correctly.");
                    }
                  }}
                  className="flex flex-col lg:flex-row gap-8"
                >
                  {/* Main Form Content */}
                  <div className="flex-1 bg-white p-8 rounded-lg border border-gray-200">

                    {/* Section 1: Basic Details */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">1</div>
                        <h2 className="text-xl font-bold text-gray-900">Basic Details</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company <span className="text-red-500">*</span></label>
                          <input type="text" name="company" list="companies" placeholder="e.g., Amazon"
                            className={`w-full mt-2 p-3 border ${formik.errors.company ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                            value={formik.values.company} onChange={formik.handleChange}
                          />
                          <datalist id="companies">{companyAndRoleQuery?.data?.company.map(c => <option key={c} value={c} />)}</datalist>
                          {formik.errors.company && <span className="text-red-500 text-xs mt-1">{formik.errors.company}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Job Role <span className="text-red-500">*</span></label>
                          <input type="text" name="role" list="roles" placeholder="e.g., SDE Intern"
                            className={`w-full mt-2 p-3 border ${formik.errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                            value={formik.values.role} onChange={formik.handleChange}
                          />
                          <datalist id="roles">{companyAndRoleQuery?.data?.role.map(r => <option key={r} value={r} />)}</datalist>
                          {formik.errors.role && <span className="text-red-500 text-xs mt-1">{formik.errors.role}</span>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Hiring Type <span className="text-red-500">*</span></label>
                          <select name="hiringType" className={`w-full mt-2 p-3 border ${formik.errors.hiringType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white cursor-pointer`}
                            value={formik.values.hiringType} onChange={formik.handleChange}>
                            <option value="">Select</option>
                            {hiringTypes.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                          {formik.errors.hiringType && <span className="text-red-500 text-xs mt-1">{formik.errors.hiringType}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Interview Mode <span className="text-red-500">*</span></label>
                          <select name="interviewMode" className={`w-full mt-2 p-3 border ${formik.errors.interviewMode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white cursor-pointer`}
                            value={formik.values.interviewMode} onChange={formik.handleChange}>
                            <option value="">Select</option>
                            {interviewModes.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          {formik.errors.interviewMode && <span className="text-red-500 text-xs mt-1">{formik.errors.interviewMode}</span>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Interview Date <span className="text-red-500">*</span></label>
                          <DatePicker 
                            selected={formik.values.interviewDate ? new Date(formik.values.interviewDate) : null}
                            onChange={(date) => {
                              if (date) {
                                const offset = date.getTimezoneOffset();
                                const formattedDate = new Date(date.getTime() - (offset*60*1000)).toISOString().split('T')[0];
                                formik.setFieldValue('interviewDate', formattedDate);
                              } else {
                                formik.setFieldValue('interviewDate', '');
                              }
                            }}
                            dateFormat="dd MMM yyyy"
                            placeholderText="Select Interview Date"
                            className={`w-full mt-2 p-3 border ${formik.errors.interviewDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer`}
                          />
                          {formik.errors.interviewDate && <span className="text-red-500 text-xs mt-1">{formik.errors.interviewDate}</span>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Result <span className="text-red-500">*</span></label>
                          <select name="result" className={`w-full mt-2 p-3 border ${formik.errors.result ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white cursor-pointer`}
                            value={formik.values.result} onChange={formik.handleChange}>
                            <option value="">Select</option>
                            {results.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          {formik.errors.result && <span className="text-red-500 text-xs mt-1">{formik.errors.result}</span>}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">About the Role <span className="text-red-500">*</span></label>
                          <textarea
                            name="content"
                            placeholder="Share some details about the role, team, or overall experience..."
                            className={`w-full mt-2 p-3 border ${formik.errors.content && formik.touched.content ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y`}
                            rows="4"
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          ></textarea>
                          {formik.errors.content && formik.touched.content && <span className="text-red-500 text-xs mt-1">{formik.errors.content}</span>}
                        </div>
                      </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* Section 2: Interview Process */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">2</div>
                        <h2 className="text-xl font-bold text-gray-900">Interview Process</h2>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rounds <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, '5+'].map(num => (
                            <button type="button" key={num}
                              className={`cursor-pointer w-12 h-10 rounded-lg border transition-colors ${formik.values.rounds.length >= parseInt(num) ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                              onClick={() => {
                                const target = parseInt(num) || 5;
                                const current = formik.values.rounds.length;
                                if (target > current) {
                                  const diff = target - current;
                                  const newRounds = Array.from({ length: diff }, () => ({ roundType: '', durationHr: '', durationMin: '', difficulty: '', topicsCovered: [], questionsAsked: [''], experienceAndTips: '', isMostImportant: false }));
                                  formik.setFieldValue('rounds', [...formik.values.rounds, ...newRounds]);
                                } else if (target < current) {
                                  formik.setFieldValue('rounds', formik.values.rounds.slice(0, target));
                                }
                              }}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <FieldArray name="rounds">
                        {({ remove, push }) => (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium text-gray-900">Round-wise Details <span className="text-red-500">*</span></h3>
                                <p className="text-sm text-gray-500">Add all the rounds you went through in the interview process.</p>
                              </div>
                              <button type="button" onClick={() => push({ roundType: '', durationHr: '', durationMin: '', difficulty: '', topicsCovered: [], questionsAsked: [''], experienceAndTips: '', isMostImportant: false })} className="cursor-pointer text-green-600 border border-green-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-green-50 transition">
                                <Plus size={16} /> Add Round
                              </button>
                            </div>

                            {formik.values.rounds.map((round, index) => {
                              const roundError = formik.errors.rounds && formik.errors.rounds[index];
                              const isExpanded = expandedRounds[index] !== false;
                              return (
                                <div key={index} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
                                  <div 
                                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition select-none border-b border-transparent"
                                    style={{ borderBottomColor: isExpanded ? '#e5e7eb' : 'transparent' }}
                                    onClick={() => toggleRound(index)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="text-gray-400">
                                        <GripVertical size={20} />
                                      </div>
                                      <h4 className="font-bold text-gray-900 w-20">Round {index + 1}</h4>
                                      {round.roundType && (
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium whitespace-nowrap">
                                          {round.roundType}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                      {(round.durationHr || round.durationMin) && (
                                        <div className="flex items-center gap-1.5 text-gray-600 text-sm font-medium whitespace-nowrap">
                                          <Clock size={16} />
                                          {round.durationHr && round.durationHr !== '0' ? `${round.durationHr} hr ` : ''}{round.durationMin && round.durationMin !== '0' ? `${round.durationMin} min` : ''}
                                        </div>
                                      )}
                                      {round.difficulty && (
                                        <span className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap ${round.difficulty === 'Easy' ? 'bg-green-50 text-green-600' : round.difficulty === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                          {round.difficulty}
                                        </span>
                                      )}
                                      <div className="text-gray-400">
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                      </div>
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className="p-6 bg-gray-50/50">
                                      <div className="flex justify-end mb-6">
                                        {formik.values.rounds.length > 1 && (
                                          <button type="button" onClick={() => remove(index)} className="cursor-pointer text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition">
                                            <Trash2 size={16} /> Delete Round
                                          </button>
                                        )}
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700">Round Type <span className="text-red-500">*</span></label>
                                          <select name={`rounds.${index}.roundType`} className={`w-full mt-2 p-3 border ${roundError?.roundType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white cursor-pointer`}
                                            value={round.roundType} onChange={formik.handleChange}>
                                            <option value="">Select (e.g., Online Assessment...)</option>
                                            {roundTypes.map(r => <option key={r} value={r}>{r}</option>)}
                                          </select>
                                          {roundError?.roundType && <span className="text-red-500 text-xs mt-1">{roundError.roundType}</span>}
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700">Duration <span className="text-red-500">*</span></label>
                                          <div className="flex gap-2 mt-2">
                                            <div className="flex-1 relative">
                                              <input type="number" name={`rounds.${index}.durationHr`} min="0" placeholder="0" className={`w-full p-3 border ${roundError?.durationHr ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10`} value={round.durationHr} onChange={formik.handleChange} />
                                              <span className="absolute right-3 top-3.5 text-gray-500 text-sm">hr</span>
                                            </div>
                                            <div className="flex-1 relative">
                                              <input type="number" name={`rounds.${index}.durationMin`} min="0" max="59" placeholder="0" className={`w-full p-3 border ${roundError?.durationMin ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-12`} value={round.durationMin} onChange={formik.handleChange} />
                                              <span className="absolute right-3 top-3.5 text-gray-500 text-sm">min</span>
                                            </div>
                                          </div>
                                          {(roundError?.durationHr || roundError?.durationMin) && <span className="text-red-500 text-xs mt-1">Invalid duration</span>}
                                        </div>
                                        
                                        <div className="col-span-1 md:col-span-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty <span className="text-red-500">*</span></label>
                                          <div className="flex gap-4">
                                            {difficulties.map(diff => (
                                              <label key={diff} className={`flex-1 text-center py-2 px-4 rounded-lg border cursor-pointer transition-colors ${round.difficulty === diff ? (diff === 'Easy' ? 'bg-green-50 border-green-500 text-green-700' : diff === 'Medium' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-red-50 border-red-500 text-red-700') : 'border-gray-300 text-gray-600 hover:bg-gray-50 bg-white'}`}>
                                                <input type="radio" name={`rounds.${index}.difficulty`} value={diff} className="hidden cursor-pointer" onChange={formik.handleChange} />
                                                {diff}
                                              </label>
                                            ))}
                                          </div>
                                          {roundError?.difficulty && <span className="text-red-500 text-xs mt-1">{roundError.difficulty}</span>}
                                        </div>
                                        <div className="col-span-1 md:col-span-2">
                                          <label className="block text-sm font-medium text-gray-700 mb-2">Topics Covered <span className="text-gray-400 font-normal">(Select all that apply)</span></label>
                                          <MultiSelect
                                            options={[...techOptions, ...dsaOptions, ...coreOptions]}
                                            value={round.topicsCovered}
                                            onChange={(val) => formik.setFieldValue(`rounds.${index}.topicsCovered`, val)}
                                            placeholder="Select topics"
                                          />
                                        </div>
                                  </div>

                                  <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Questions Asked <span className="text-red-500">*</span></label>
                                    <FieldArray name={`rounds.${index}.questionsAsked`}>
                                      {({ remove: removeQuestion, push: pushQuestion }) => (
                                        <div className="space-y-3">
                                          {round.questionsAsked.map((question, qIndex) => {
                                            const questionError = roundError?.questionsAsked && roundError.questionsAsked[qIndex];
                                            return (
                                              <div key={qIndex} className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                  <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shrink-0">
                                                    Q{qIndex + 1}
                                                  </div>
                                                  <input type="text" name={`rounds.${index}.questionsAsked.${qIndex}`} placeholder="Enter the question asked in this round..."
                                                    className={`flex-1 h-12 p-3 border ${questionError && typeof questionError === 'string' ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none`}
                                                    value={question} onChange={formik.handleChange} />
                                                  <button type="button" onClick={() => removeQuestion(qIndex)} className="w-12 h-12 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition cursor-pointer shrink-0" disabled={round.questionsAsked.length === 1}>
                                                    <Trash2 size={18} />
                                                  </button>
                                                </div>
                                                {questionError && typeof questionError === 'string' && <span className="text-red-500 text-xs mt-1 ml-15">{questionError}</span>}
                                              </div>
                                            );
                                          })}
                                          {typeof roundError?.questionsAsked === 'string' && <span className="text-red-500 text-xs mt-1">{roundError.questionsAsked}</span>}
                                          <button type="button" onClick={() => pushQuestion('')} className="text-green-600 font-medium text-sm flex items-center gap-1 mt-4 cursor-pointer hover:text-green-700 transition">
                                            <Plus size={16} /> Add Another Question
                                          </button>
                                        </div>
                                      )}
                                    </FieldArray>
                                  </div>

                                  <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700">Experience & Tips <span className="text-red-500">*</span></label>
                                    <textarea name={`rounds.${index}.experienceAndTips`} rows={4} placeholder="Share your experience, what was discussed, important tips for others..."
                                      className={`w-full mt-2 p-3 border ${roundError?.experienceAndTips ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y`}
                                      value={round.experienceAndTips} onChange={formik.handleChange}></textarea>
                                    {roundError?.experienceAndTips && <span className="text-red-500 text-xs mt-1">{roundError.experienceAndTips}</span>}
                                  </div>

                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name={`rounds.${index}.isMostImportant`} className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                                          checked={round.isMostImportant} onChange={formik.handleChange} />
                                        <span className="text-sm text-gray-700">Mark as most important round</span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </FieldArray>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* Section 3: Technical Information */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">3</div>
                        <h2 className="text-xl font-bold text-gray-900">Technical Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Technologies / Skills</label>
                          <MultiSelect options={techOptions} value={formik.values.technologies} onChange={(val) => formik.setFieldValue('technologies', val)} placeholder="Select technologies" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">DSA Topics</label>
                          <MultiSelect options={dsaOptions} value={formik.values.dsaTopics} onChange={(val) => formik.setFieldValue('dsaTopics', val)} placeholder="Select DSA topics" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Core Subjects</label>
                          <MultiSelect options={coreOptions} value={formik.values.coreSubjects} onChange={(val) => formik.setFieldValue('coreSubjects', val)} placeholder="Select subjects" />
                        </div>
                      </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* Section 4: Salary Information */}
                    <div className="mb-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">4</div>
                        <h2 className="text-xl font-bold text-gray-900">Salary Details <span className="text-gray-400 font-normal text-base">(Optional)</span></h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700">Currency</label>
                          <SingleSelect 
                            options={[
                              { value: "INR", label: "INR (₹)" },
                              { value: "USD", label: "USD ($)" },
                              { value: "EUR", label: "EUR (€)" },
                              { value: "GBP", label: "GBP (£)" }
                            ]}
                            value={formik.values.salary.currency}
                            onChange={(val) => formik.setFieldValue('salary.currency', val)}
                            placeholder="Select Currency"
                          />
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700">Base Salary</label>
                          <div className="relative mt-2">
                            <input type="number" step="any" min="0" name="salary.base" placeholder="e.g. 15" className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formik.values.salary.base} onChange={formik.handleChange} />
                            <span className="absolute right-3 top-3.5 text-gray-400 text-sm font-medium pointer-events-none">{formik.values.salary.currency === 'INR' ? 'LPA' : 'K'}</span>
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700">Bonus / Sign-on</label>
                          <div className="relative mt-2">
                            <input type="number" step="any" min="0" name="salary.bonus" placeholder="e.g. 2" className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formik.values.salary.bonus} onChange={formik.handleChange} />
                            <span className="absolute right-3 top-3.5 text-gray-400 text-sm font-medium pointer-events-none">{formik.values.salary.currency === 'INR' ? 'LPA' : 'K'}</span>
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700">Stocks / RSUs</label>
                          <div className="relative mt-2">
                            <input type="number" step="any" min="0" name="salary.stocks" placeholder="e.g. 10" className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formik.values.salary.stocks} onChange={formik.handleChange} />
                            <span className="absolute right-3 top-3.5 text-gray-400 text-sm font-medium pointer-events-none">{formik.values.salary.currency === 'INR' ? 'LPA' : 'K'}</span>
                          </div>
                        </div>
                        <div className="lg:col-span-1">
                          <label className="block text-sm font-medium text-gray-700">Total CTC</label>
                          <div className="relative mt-2">
                            <input type="number" step="any" min="0" name="salary.totalCTC" placeholder="e.g. 27" className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formik.values.salary.totalCTC} onChange={formik.handleChange} />
                            <span className="absolute right-3 top-3.5 text-gray-400 text-sm font-medium pointer-events-none">{formik.values.salary.currency === 'INR' ? 'LPA' : 'K'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="my-8 border-gray-200" />

                    {/* Section 5: Additional Information */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">5</div>
                        <h2 className="text-xl font-bold text-gray-900">Additional Information</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Preparation Duration</label>
                          <select name="preparationDuration" className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none appearance-none bg-white cursor-pointer"
                            value={formik.values.preparationDuration} onChange={formik.handleChange}>
                            <option value="">Select duration</option>
                            {durations.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Preparation Resources <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <input type="text" name="preparationResources" placeholder="e.g., LeetCode, GeeksforGeeks, Striver Sheet"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            value={formik.values.preparationResources} onChange={formik.handleChange}
                          />
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700">Overall Tips for Future Aspirants <span className="text-red-500">*</span></label>
                        <textarea name="overallTips" rows={4} placeholder="Share your overall tips and advice..."
                          className={`w-full mt-2 p-3 border ${formik.errors.overallTips ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-y`}
                          value={formik.values.overallTips} onChange={formik.handleChange}></textarea>
                        {formik.errors.overallTips && <span className="text-red-500 text-xs mt-1">{formik.errors.overallTips}</span>}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-4 mb-4 sm:mb-0">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isAnonymous" className="sr-only peer cursor-pointer" checked={formik.values.isAnonymous} onChange={formik.handleChange} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                          <div>
                            <div className="font-bold text-sm text-gray-900">Post Anonymously</div>
                            <div className="text-xs text-gray-500">Your name will not be shown with this post</div>
                          </div>
                        </div>

                        <div className="flex gap-4 w-full sm:w-auto">
                          <button type="button" onClick={() => navigate(-1)} className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 font-medium w-full sm:w-auto transition">
                            Cancel
                          </button>
                          <button type="submit" disabled={isLoading} className="cursor-pointer px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-70 transition">
                            <PenTool size={18} /> {isLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="w-full lg:w-80 flex flex-col gap-6">

                    {/* Tips for a Helpful Post */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-6">Tips for a Helpful Post</h3>

                      <div className="space-y-5">
                        <div className="flex gap-3">
                          <div className="mt-0.5 text-green-600"><CheckCircle2 size={18} /></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Be honest and authentic</div>
                            <div className="text-xs text-gray-500 mt-1">Share your genuine experience</div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="mt-0.5 text-green-600"><MessageSquare size={18} /></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Add specific questions</div>
                            <div className="text-xs text-gray-500 mt-1">Mention questions to help others</div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="mt-0.5 text-green-600"><BookOpen size={18} /></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Include your preparation</div>
                            <div className="text-xs text-gray-500 mt-1">Share resources that helped you</div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="mt-0.5 text-green-600"><PenTool size={18} /></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Write helpful tips</div>
                            <div className="text-xs text-gray-500 mt-1">Help the next person succeed</div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="mt-0.5 text-green-600"><ShieldAlert size={18} /></div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">Keep it respectful</div>
                            <div className="text-xs text-gray-500 mt-1">Avoid sharing confidential info</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default PostForm;
