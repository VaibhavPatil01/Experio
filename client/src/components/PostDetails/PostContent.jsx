import React from 'react';
import DisplayQuill from '../../components/DisplayQuill';
import { Clock, Tag, MessageSquare, AlertCircle, BookOpen } from 'lucide-react';
import greenTickSvg from '../../assets/images/icons/greentick.svg';

const PostContent = ({ activeTab, post }) => {
  if (!post) return null;

  switch (activeTab) {
    case 'experience':
      return (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About the Role & Experience</h3>
            <div className="text-gray-700 leading-relaxed text-base">
              {post.content ? (
                <DisplayQuill content={post.content} />
              ) : (
                <p className="text-gray-500 italic">No overall experience description provided.</p>
              )}
            </div>
          </section>
        </div>
      );

    case 'questions':
      const allQuestions = post.rounds?.flatMap((round, idx) => 
        round.questionsAsked?.length > 0 
          ? { roundType: round.roundType || `Round ${idx + 1}`, questions: round.questionsAsked, roundNum: idx + 1 } 
          : null
      ).filter(Boolean) || [];

      return (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Questions Asked</h3>
            {allQuestions.length > 0 ? (
              <div className="flex flex-col gap-6">
                {allQuestions.map((qGroup, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      <span className="text-gray-500 font-medium">Round {qGroup.roundNum}:</span> {qGroup.roundType}
                    </h4>
                    <ul className="flex flex-col gap-3">
                      {qGroup.questions.map((q, qIdx) => (
                        <li key={qIdx} className="flex gap-3 items-start bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                          <div className="w-6 h-6 rounded bg-green-50 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            Q{qIdx + 1}
                          </div>
                          <span className="text-gray-700 text-[14px] leading-relaxed">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No specific questions were recorded for this interview.</p>
            )}
          </section>
        </div>
      );

    case 'process':
      return (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Interview Process</h3>
            <div className="flex flex-col gap-6 relative">
              {post.rounds && post.rounds.length > 0 ? (
                <>
                  <div className="absolute left-3 top-2 bottom-6 w-[2px] bg-gray-200 z-0"></div>
                  {post.rounds.map((round, index) => (
                    <div key={index} className="flex gap-4 relative z-10">
                      <div className="mt-1 bg-white relative z-10">
                        <img src={greenTickSvg} alt="" className="w-6 h-6" />
                      </div>
                      <div className="flex-1 bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                              Round {index + 1} {round.isMostImportant && <span className="text-red-500 ml-2 normal-case tracking-normal">★ Most Important</span>}
                            </span>
                            <h4 className="font-bold text-gray-800 text-[16px]">{round.roundType}</h4>
                            
                            {/* Duration and difficulty */}
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {round.duration && (
                                <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  <Clock className="w-3 h-3" /> {round.duration}
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${
                                (round.difficulty || "Medium").toLowerCase() === 'easy' ? 'bg-green-50 text-green-600' :
                                (round.difficulty || "Medium").toLowerCase() === 'hard' ? 'bg-red-50 text-red-600' :
                                'bg-orange-50 text-orange-600'
                              }`}>
                                {round.difficulty || "Medium"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Topics Covered */}
                        {round.topicsCovered && round.topicsCovered.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {round.topicsCovered.map((topic, tIdx) => (
                              <span key={tIdx} className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                                <Tag className="w-3 h-3" /> {topic}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="text-gray-700 text-[14px] mt-2 leading-relaxed bg-gray-50 p-3 rounded-md border border-gray-100">
                          <strong>Experience & Tips: </strong>
                          <br />
                          {round.experienceAndTips || <span className="italic text-gray-400">No experience details provided.</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-gray-500 italic">Interview rounds details are not available.</p>
              )}
            </div>
          </section>
        </div>
      );

    case 'tips':
      return (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Tips & Advice</h3>
            {post.overallTips ? (
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-lg text-emerald-900 text-[15px] leading-relaxed">
                <AlertCircle className="w-5 h-5 text-emerald-600 mb-2 inline-block mr-2" />
                {post.overallTips}
              </div>
            ) : (
              <p className="text-gray-500 italic">No overall tips provided.</p>
            )}
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" /> Preparation Duration
              </h4>
              <p className="text-gray-700">{post.preparationDuration || "Not specified"}</p>
            </section>
            
            <section className="bg-white border border-gray-200 rounded-lg p-5">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" /> Resources Used
              </h4>
              <p className="text-gray-700">{post.preparationResources || "Not specified"}</p>
            </section>
          </div>
        </div>
      );

    case 'salary':
      return (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Compensation Details</h3>
            
            {post.salary && (post.salary.base || post.salary.totalCTC) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Base Salary</span>
                  <span className="text-2xl font-bold text-gray-900">{post.salary.base || "N/A"} <span className="text-sm font-normal text-gray-500">{post.salary.currency}</span></span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Bonus</span>
                  <span className="text-2xl font-bold text-gray-900">{post.salary.bonus || "N/A"} <span className="text-sm font-normal text-gray-500">{post.salary.currency}</span></span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">Stocks</span>
                  <span className="text-2xl font-bold text-gray-900">{post.salary.stocks || "N/A"} <span className="text-sm font-normal text-gray-500">{post.salary.currency}</span></span>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 border border-green-600 rounded-lg p-5 shadow-md flex flex-col justify-center items-center text-center text-white">
                  <span className="text-green-100 text-sm font-medium mb-1 uppercase tracking-wider">Total CTC</span>
                  <span className="text-3xl font-bold">{post.salary.totalCTC || "N/A"} <span className="text-sm font-normal text-green-100">{post.salary.currency}</span></span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <p className="text-gray-600">The author did not provide any salary details for this experience.</p>
              </div>
            )}
          </section>
        </div>
      );

    case 'insights':
      return (
        <div className="flex flex-col gap-8">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Tech Stack & Subjects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Technologies</h4>
                {post.technologies && post.technologies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.technologies.map(tech => (
                      <span key={tech} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">{tech}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">None specified</span>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">DSA Topics</h4>
                {post.dsaTopics && post.dsaTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.dsaTopics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">{topic}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">None specified</span>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Core Subjects</h4>
                {post.coreSubjects && post.coreSubjects.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {post.coreSubjects.map(sub => (
                      <span key={sub} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded">{sub}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400 italic">None specified</span>
                )}
              </div>

            </div>
          </section>
        </div>
      );

    default:
      return (
        <div className="py-8 text-center text-gray-500">
          <p>Select a tab to view details.</p>
        </div>
      );
  }
};

export default PostContent;
