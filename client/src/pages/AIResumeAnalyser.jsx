import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, Briefcase, Building, AlignLeft, 
  Sparkles, CheckCircle2, AlertCircle, ChevronRight, FileUp, 
  BarChart, ArrowRight, Loader2, BookOpen
} from 'lucide-react';

const AIResumeAnalyser = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      alert('Please upload a resume first.');
      return;
    }
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        overallScore: 82,
        strengths: [
          "Strong technical skills highlighted for frontend development.",
          "Good use of action verbs in the recent experience section.",
          "Education details are crisp and well-placed."
        ],
        improvements: [
          {
            title: "Add more measurable metrics",
            description: "Instead of 'Improved performance', use 'Improved performance by 20%'. Quantifying your achievements makes them more impactful.",
            reason: "Based on our platform's data, 85% of successful candidates at product-based companies included specific metrics in their resumes.",
            citation: "Google Interview Experience by John Doe (2025)"
          },
          {
            title: "Include architectural keywords",
            description: "Add keywords like 'Scalability', 'Microservices', and 'Caching' if you have experience with them, especially for senior roles.",
            reason: "The target company (Amazon) frequently asks System Design questions for this role, and recruiters filter for these keywords.",
            citation: "Amazon SDE II Interview Trends (2025)"
          }
        ],
        suggestedKeywords: ["System Design", "AWS", "Performance Optimization", "GraphQL", "TypeScript", "CI/CD"]
      });
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>AI Resume Analyser | Interview Experience</title>
        <meta
          name="description"
          content="Analyse your resume and discover personalized, practical improvements with AI backed by real interview data."
        />
      </Helmet>

      <main className="min-h-screen bg-gray-50 dark:bg-[#121212] text-slate-800 dark:text-gray-100 font-sans pb-20">
        {/* Header Section */}
        <div className="pt-10 pb-6 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
              Smart Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-600">Analyser</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get personalized resume feedback based on real interview experiences and company-specific data from our platform.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 space-y-6"
            >
                <div className="space-y-5">
                  {/* Upload Area */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Upload Resume (PDF)</label>
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                        isDragActive 
                          ? 'border-primary bg-primary/5' 
                          : file 
                            ? 'border-green-500 bg-green-50 dark:bg-green-500/10' 
                            : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 bg-gray-50 dark:bg-[#252525]'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input 
                        type="file" 
                        accept=".pdf" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center justify-center gap-3 pointer-events-none">
                        {file ? (
                          <>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-600 rounded-full flex items-center justify-center">
                              <FileUp className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-medium text-green-700 dark:text-green-400">{file.name}</p>
                              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Ready for analysis</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-200">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500 mt-1">PDF files only (Max 5MB)</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Target Role */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Target Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Frontend Developer"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Target Company */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Target Company (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="w-5 h-5 text-gray-400" />
                      </div>
                      <input 
                        type="text" 
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="e.g. Google, Amazon"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Job Description (Optional)</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <AlignLeft className="w-5 h-5 text-gray-400" />
                      </div>
                      <textarea 
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here for highly targeted feedback..."
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !file}
                    className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>
                </div>

            </motion.div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                
                {/* Empty State */}
                {!isAnalyzing && !result && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-800"
                  >
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <BarChart className="w-12 h-12 text-primary opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready for Analysis</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      Upload your resume and provide details to receive AI-generated insights backed by real interview experiences from our platform.
                    </p>
                    <div className="mt-8 grid grid-cols-2 gap-4 text-left w-full max-w-md">
                      <div className="bg-white dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">ATS Keyword Matching</span>
                      </div>
                      <div className="bg-white dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Content Improvements</span>
                      </div>
                      <div className="bg-white dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                        <Building className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Company Targeting</span>
                      </div>
                      <div className="bg-white dark:bg-[#252525] p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Data-backed advice</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Loading State */}
                {isAnalyzing && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-100 dark:border-gray-800 p-8"
                  >
                    <div className="relative mb-8">
                      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing your resume...</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-8">
                      Cross-referencing with our database of successful interview experiences and company profiles.
                    </p>

                    <div className="w-full max-w-md space-y-4">
                      <div className="h-16 bg-gray-100 dark:bg-[#252525] rounded-xl animate-pulse"></div>
                      <div className="h-24 bg-gray-100 dark:bg-[#252525] rounded-xl animate-pulse"></div>
                      <div className="h-24 bg-gray-100 dark:bg-[#252525] rounded-xl animate-pulse"></div>
                    </div>
                  </motion.div>
                )}

                {/* Results State */}
                {!isAnalyzing && result && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    {/* Score Card */}
                    <div className="bg-gradient-to-br from-primary to-green-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                          <h3 className="text-xl font-medium text-white/90 mb-1">Overall Match Score</h3>
                          <p className="text-white/80 text-sm max-w-md">
                            Based on your target role {targetCompany && `at ${targetCompany}`} and industry standards.
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                            <span className="text-4xl font-bold">{result.overallScore}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Strengths */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                        What looks good
                      </h3>
                      <ul className="space-y-3">
                        {result.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"></div>
                            <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actionable Improvements */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                        <AlertCircle className="w-6 h-6 text-amber-500" />
                        Targeted Improvements
                      </h3>
                      
                      <div className="space-y-6">
                        {result.improvements.map((imp, index) => (
                          <div key={index} className="bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{imp.title}</h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">{imp.description}</p>
                            
                            {/* AI Reasoning & Citation */}
                            <div className="bg-white dark:bg-[#252525] rounded-lg p-4 border border-amber-100 dark:border-gray-700">
                              <div className="flex items-start gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span className="font-medium text-sm text-gray-900 dark:text-white">Why this matters:</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 ml-6 mb-3 italic">
                                "{imp.reason}"
                              </p>
                              <div className="ml-6 inline-flex items-center gap-1.5 text-xs font-medium bg-gray-100 dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-md">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Source: {imp.citation}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Keywords */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Suggested Keywords to Add</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Based on successful profiles for similar roles, consider incorporating these terms if you have the experience:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.suggestedKeywords.map((keyword, index) => (
                          <span key={index} className="px-3 py-1.5 bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-700 font-medium hover:border-primary/50 hover:text-primary dark:hover:text-primary transition-colors cursor-default">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

export default AIResumeAnalyser;
