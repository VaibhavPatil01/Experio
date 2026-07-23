import React from 'react';
import { Link } from 'react-router-dom';

const SimilarExperiencesCard = ({ postId }) => {
  // Dummy data to match UI
  const similarPosts = [
    {
      id: 1,
      title: 'Google SDE Intern - Summer 2024',
      author: 'Anjali S.',
      match: '91%'
    },
    {
      id: 2,
      title: 'Google Internship Experience',
      author: 'Rohan P.',
      match: '89%'
    },
    {
      id: 3,
      title: 'Google SWE Intern - My Experience',
      author: 'Karan M.',
      match: '87%'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-5 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">Similar Experiences</h3>
        <Link to="/" className="text-primary text-xs font-bold hover:underline">
          View all
        </Link>
      </div>
      
      <div className="flex flex-col gap-4">
        {similarPosts.map(post => (
          <div key={post.id} className="flex justify-between items-center group cursor-pointer">
            <div className="pr-4">
              <h4 className="font-semibold text-gray-700 text-[14px] leading-tight mb-1 group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-gray-500 text-[13px]">by {post.author}</p>
            </div>
            <div className="bg-green-50 text-green-600 px-2.5 py-1 rounded-md text-[12px] font-bold shrink-0">
              {post.match}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarExperiencesCard;
