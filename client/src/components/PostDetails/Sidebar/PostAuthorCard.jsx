import React from 'react';
import { Link } from 'react-router-dom';

const PostAuthorCard = ({ post }) => {
  const authorName = post?.postAuthor || 'Deleted User';
  const profilePicture = post?.postAuthorProfilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;
  const authorId = post?.postAuthorId;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Posted by</h3>
      
      <div className="flex gap-3 mb-4">
        <img 
          src={profilePicture} 
          alt={authorName} 
          className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-100 shadow-sm" 
        />
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1">
            {authorName}
          </h4>
          <p className="text-gray-600 text-[14px] leading-tight mb-1">
            SDE at Microsoft
          </p>
          <p className="text-gray-400 text-[13px] leading-tight">
            (Ex- Google Intern)
          </p>
        </div>
      </div>
      
      <div className="text-center text-xs font-medium text-gray-500 mb-4">
        20 contributions • Joined Jan 2023
      </div>
      
      {authorId ? (
        <Link to={`/profile/${authorId}`} className="block w-full text-center py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 font-semibold transition-colors">
          View Profile
        </Link>
      ) : (
        <button disabled className="w-full py-2 rounded-lg border border-gray-300 text-gray-400 font-semibold cursor-not-allowed">
          View Profile
        </button>
      )}
    </div>
  );
};

export default PostAuthorCard;
