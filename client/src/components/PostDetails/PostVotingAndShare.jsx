import React from 'react';
import { ThumbsUp, ThumbsDown, Forward } from 'lucide-react';

const PostVotingAndShare = ({ post }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-200 mt-8 mb-8">
      <h3 className="font-bold text-gray-900 text-[15px]">Was this experience helpful?</h3>
      
      <div className="flex items-center gap-4">
        {/* Voting Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm">
            <ThumbsUp className="w-4 h-4" />
            {post?.upVotes?.length || 126}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm">
            <ThumbsDown className="w-4 h-4" />
            {post?.downVotes?.length || 18}
          </button>
        </div>
        
        {/* Share Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors font-medium text-sm ml-auto sm:ml-0">
          <Forward className="w-5 h-5" />
          Share
        </button>
      </div>
    </div>
  );
};

export default PostVotingAndShare;
