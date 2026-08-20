import React from 'react';
import { Link } from 'react-router-dom';
import { SquarePen, Calendar } from 'lucide-react';
import { assets } from '../../../assets/assets';

const PostAuthorCard = ({ post }) => {
  const authorName = post?.postAuthor || 'Deleted User';
  const isAnonymous = authorName === 'Anonymous User';
  const profilePicture = post?.postAuthorProfilePicture || (isAnonymous ? assets.userProfileIcon : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`);
  const authorId = post?.postAuthorId;

  const primaryExp = post?.authorWorkExperiences?.find(exp => exp.isCurrentlyWorking) || post?.authorWorkExperiences?.[0];
  const secondaryExp = post?.authorWorkExperiences?.find(exp => exp._id !== primaryExp?._id);

  const joinedDate = post?.authorJoinedDate
    ? new Date(post.authorJoinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recently';

  const contributions = post?.authorContributions || 0;

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
          <p className={`text-gray-600 text-[14px] font-medium leading-tight ${secondaryExp ? 'mb-1' : ''}`}>
            {primaryExp?.jobTitle || 'Fresher'}
          </p>
          {secondaryExp && (
            <p className="text-gray-400 text-[13px] leading-tight">
              (Ex- {secondaryExp.jobTitle} at {secondaryExp.company})
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-5 py-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <SquarePen className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          </div>
          <span className="text-[12.5px] text-[#475467] font-medium leading-tight">
            <span className="text-primary font-bold text-[13.5px]">{contributions}</span> contributions
          </span>
        </div>
        <div className="w-px h-6 bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
          </div>
          <span className="text-[12.5px] text-[#475467] font-medium leading-tight whitespace-nowrap">
            Joined <span className="text-primary font-bold text-[13.5px]">{joinedDate}</span>
          </span>
        </div>
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
