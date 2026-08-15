import React from 'react';
import { ThumbsUp, ThumbsDown, Forward } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upVotePost, downVotePost } from '../../services/postServices.js';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '../../redux/store.js';

const PostVotingAndShare = ({ post }) => {
  const queryClient = useQueryClient();
  const user = useAppSelector((state) => state.userState.user);

  const upvoteMutation = useMutation({
    mutationFn: () => upVotePost(post._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['post', post._id]);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to like post');
    }
  });

  const downvoteMutation = useMutation({
    mutationFn: () => downVotePost(post._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['post', post._id]);
      queryClient.invalidateQueries(['posts']);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to dislike post');
    }
  });

  const handleUpvote = () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }
    upvoteMutation.mutate();
  };

  const handleDownvote = () => {
    if (!user) {
      toast.error('Please login to dislike posts');
      return;
    }
    downvoteMutation.mutate();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-gray-200 mt-4 mb-8">
      <h3 className="font-bold text-gray-900 text-[15px]">Was this experience helpful?</h3>
      
      <div className="flex items-center gap-4">
        {/* Voting Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleUpvote}
            disabled={upvoteMutation.isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-medium text-sm cursor-pointer ${
              post?.isUpVoted 
                ? 'bg-primary/10 border-primary/20 text-primary' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ThumbsUp className="w-4 h-4" fill={post?.isUpVoted ? 'currentColor' : 'none'} />
            {post?.upVoteCount || 0}
          </button>
          
          <button 
            onClick={handleDownvote}
            disabled={downvoteMutation.isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-medium text-sm cursor-pointer ${
              post?.isDownVoted 
                ? 'bg-rose-50 border-rose-200 text-rose-600' 
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ThumbsDown className="w-4 h-4" fill={post?.isDownVoted ? 'currentColor' : 'none'} />
            {post?.downVoteCount || 0}
          </button>
        </div>
        
        {/* Share Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors font-medium text-sm ml-auto sm:ml-0 cursor-pointer">
          <Forward className="w-5 h-5" />
          Share
        </button>
      </div>
    </div>
  );
};

export default PostVotingAndShare;
