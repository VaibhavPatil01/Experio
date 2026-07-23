import React from 'react';
import { Star } from 'lucide-react';

const ExperienceHighlightsCard = ({ post }) => {
  const HighlightRow = ({ label, value, isPill = false, pillColor = 'red' }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 text-[14px] font-medium">{label}</span>
      {isPill ? (
        <span className={`text-[12px] font-bold px-2.5 py-0.5 rounded ${
          pillColor === 'red' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
        }`}>
          {value}
        </span>
      ) : (
        <span className="text-gray-700 text-[14px] font-semibold">{value}</span>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Experience Highlights</h3>
      
      <div className="flex flex-col">
        {/* Overall Experience */}
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 text-[14px] font-medium">Overall Experience</span>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current text-gray-200" />
            </div>
            <span className="text-gray-700 font-semibold text-[14px]">4.5</span>
          </div>
        </div>
        
        <HighlightRow label="Interview Difficulty" value="Hard" isPill={true} pillColor="red" />
        <HighlightRow label="Interview Rounds" value={post?.rounds?.length || "4"} />
        <HighlightRow label="Time Taken" value="3 Weeks" />
        <HighlightRow label="Offer Received" value={post?.result === "Selected" ? "Yes" : "Yes"} isPill={true} pillColor="green" />
        <HighlightRow label="Would you recommend?" value="Yes" isPill={true} pillColor="green" />
      </div>
    </div>
  );
};

export default ExperienceHighlightsCard;
