import React from 'react';
import { Bookmark, MoreVertical, MapPin, Calendar, Briefcase, BadgeCheck } from 'lucide-react';

const PostHeader = ({ post, postId }) => {
  if (!post) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left Side: Avatar & Company Info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-700 border border-gray-200">
            {post.company?.charAt(0)?.toUpperCase() || 'G'}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{post.company || 'Google'}</h2>
              <BadgeCheck className="w-6 h-6 text-emerald-500" fill="currentColor" stroke="white" />
            </div>
            <p className="text-gray-800 font-semibold">{post.role || post.title || 'Software Engineer Intern'}</p>
          </div>
        </div>

        {/* Right Side: Match % & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            92% Match
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sub-details Row */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{post.hiringType || post.postType || 'Internship'}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{post.interviewMode || 'Bangalore'}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{post.interviewDate || 'May 2024'}</span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
