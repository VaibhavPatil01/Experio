import React from 'react';

const PopularTagsCard = ({ post }) => {
  const defaultTags = [
    'Data Structures', 'Algorithms', 'System Design', 
    'Behavioral', 'Coding', 'Problem Solving',
    'OOPs', 'Arrays', 'Strings', 'Trees'
  ];

  const tags = post?.tags?.length > 0 ? post.tags : defaultTags;

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
      
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 10).map((tag, idx) => (
          <span 
            key={idx} 
            className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[12px] font-semibold hover:bg-green-100 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
        {tags.length > 10 && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer hover:bg-gray-200 transition-colors">
            +5 more
          </span>
        )}
      </div>
    </div>
  );
};

export default PopularTagsCard;
