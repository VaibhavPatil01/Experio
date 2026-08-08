import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MoreVertical, MapPin, Calendar, Briefcase, BadgeCheck, Share2, Flag, Link2, Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark } from '../../services/postServices.js';
import { useAppSelector } from '../../redux/store.js';
import { toast } from 'react-hot-toast';
import generateSlug from '../../utils/generateSlug.js';

const PostHeader = ({ post, postId, isEditable, openDeleteModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const user = useAppSelector((state) => state.userState.user);
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmark(postId, post.isBookmarked),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['post', postId]);
      queryClient.invalidateQueries(['posts']);
      toast.success(data.message || (post.isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks'));
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to toggle bookmark');
    }
  });

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to bookmark posts');
      return;
    }
    bookmarkMutation.mutate();
  };

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
              <BadgeCheck className="w-6 h-6 text-primary" fill="currentColor" stroke="white" />
            </div>
            <p className="text-gray-800 font-semibold">{post.role || post.title || 'Software Engineer Intern'}</p>
          </div>
        </div>

        {/* Right Side: Match % & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
            92% Match
          </span>
          <button 
            className={`flex items-center transition-colors cursor-pointer ${post.isBookmarked ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={handleBookmarkClick}
            disabled={bookmarkMutation.isLoading}
          >
            <Bookmark className="w-5 h-5" fill={post.isBookmarked ? 'currentColor' : 'none'} />
          </button>
          
          <div className="relative flex items-center" ref={menuRef}>
            <button 
              className="flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(!isMenuOpen);
              }}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-10">
                <div className="absolute -top-1.5 right-1.5 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
                <div className="relative bg-white flex flex-col">
                  {isEditable && (
                    <>
                      <Link 
                        to={`/post/edit/${postId}`}
                        className="flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left w-full cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Pencil className="w-4 h-4 text-gray-500" strokeWidth={2} /> Edit Post
                      </Link>
                      <button 
                        className="flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left w-full cursor-pointer border-b border-gray-50" 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          setIsMenuOpen(false); 
                          openDeleteModal({ id: postId, title: post.title });
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} /> Delete Post
                      </button>
                    </>
                  )}
                  <button 
                    className="flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left w-full cursor-pointer" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      toast.success("Sharing functionality coming soon");
                      setIsMenuOpen(false); 
                    }}
                  >
                    <Share2 className="w-4 h-4 text-gray-500" strokeWidth={2} /> Share Post
                  </button>
                  <button 
                    className="flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left w-full cursor-pointer" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      toast.success("Post reported");
                      setIsMenuOpen(false); 
                    }}
                  >
                    <Flag className="w-4 h-4 text-red-500" strokeWidth={2} /> Report Post
                  </button>
                  <button 
                    className="flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left w-full cursor-pointer" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      navigator.clipboard.writeText(`${window.location.origin}/post/${generateSlug(post.title, post._id)}`);
                      toast.success("Link copied to clipboard!");
                      setIsMenuOpen(false); 
                    }}
                  >
                    <Link2 className="w-4 h-4 text-gray-500" strokeWidth={2} /> Copy Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-details Row */}
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{post.interviewMode || 'Online'}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{post.hiringType || 'On Campus'}</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-medium text-primary">{post.interviewDate || 'May 2024'}</span>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
