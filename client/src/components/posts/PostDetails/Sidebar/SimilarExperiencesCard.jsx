import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRelatedPosts } from '../../../../services/postServices';
import generateSlug from '../../../../utils/generateSlug';

const SimilarExperiencesCard = ({ postId }) => {
  const { data: similarPosts, isLoading, isError } = useQuery({
    queryKey: ['relatedPosts', postId],
    queryFn: () => getRelatedPosts(postId, 3),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isError || (!isLoading && (!similarPosts || similarPosts.length === 0))) {
    return null; // Don't show the card if there's an error or no related posts
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Similar Experiences</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center animate-pulse">
              <div className="w-full pr-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded-md shrink-0"></div>
            </div>
          ))
        ) : (
          // Actual Data
          similarPosts.map(post => (
            <Link 
              key={post._id} 
              to={`/post/${post._id}/${generateSlug(post.title || post.company || '')}`}
              className="flex justify-between items-center group cursor-pointer"
            >
              <div className="pr-4">
                <h4 className="font-semibold text-gray-700 text-[14px] leading-tight mb-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-500 text-[13px]">
                  by {post.userId?.username || 'Unknown'}
                </p>
              </div>
              <div className="bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-[12px] font-bold shrink-0">
                {post.matchPercentage || 75}%
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SimilarExperiencesCard;
