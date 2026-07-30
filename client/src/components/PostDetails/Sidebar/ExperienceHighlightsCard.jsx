import React from 'react';
import { Star } from 'lucide-react';

const ExperienceHighlightsCard = ({ post }) => {
  const HighlightRow = ({ label, value, isPill = false, pillColor = 'red', showNotSpecified = false }) => {
    if (!value && !showNotSpecified) return null; // Don't render if there's no data and not forced
    
    return (
      <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
        <span className="text-gray-600 text-[14px] font-medium">{label}</span>
        {!value ? (
          <span className="text-gray-400 italic text-[13.5px]">Not specified</span>
        ) : isPill ? (
          <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded ${
            pillColor === 'red' ? 'bg-red-50 text-red-500' : 
            pillColor === 'green' ? 'bg-emerald-50 text-emerald-600' :
            pillColor === 'blue' ? 'bg-blue-50 text-blue-600' :
            'bg-orange-50 text-orange-600'
          }`}>
            {value}
          </span>
        ) : (
          <span className="text-gray-700 text-[14px] font-semibold">{value}</span>
        )}
      </div>
    );
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Easy') return 'green';
    if (diff === 'Medium') return 'orange';
    return 'red';
  };

  const getResultColor = (res) => {
    if (res === 'Selected') return 'green';
    if (res === 'Waiting') return 'orange';
    return 'red';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Experience Highlights</h3>
      
      <div className="flex flex-col">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 text-[14px] font-medium">Overall Experience</span>
          {post?.rating ? (
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${post?.rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} 
                  />
                ))}
              </div>
              <span className="text-gray-700 font-semibold text-[14px]">{post?.rating}</span>
            </div>
          ) : (
            <span className="text-gray-400 italic text-[13.5px]">Not specified</span>
          )}
        </div>
        
        <HighlightRow label="Interview Difficulty" value={post?.difficulty} isPill={true} pillColor={getDifficultyColor(post?.difficulty)} showNotSpecified={true} />
        <HighlightRow label="Interview Rounds" value={post?.rounds?.length ? `${post.rounds.length}` : null} />
        <HighlightRow label="Time Taken" value={post?.preparationDuration} />
        <HighlightRow label="Offer Received" value={post?.result} />
        <HighlightRow label="Interview Mode" value={post?.interviewMode} />
        <HighlightRow label="Hiring Type" value={post?.hiringType} />
      </div>
    </div>
  );
};

export default ExperienceHighlightsCard;
