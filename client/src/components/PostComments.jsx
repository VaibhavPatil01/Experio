import React, { useState } from 'react';
import { 
  MoreHorizontal, ThumbsUp, MessageSquare, Share2, 
  Bold, Italic, Link2, Code, List, ListOrdered, Image as ImageIcon, ChevronDown
} from 'lucide-react';

const PostComments = ({ postId }) => {
  const [activeTab, setActiveTab] = useState('Most Helpful');
  
  const tabs = ['Most Helpful', 'Newest', 'Trending'];

  // Dummy Comments Data
  const comments = [
    {
      id: 1,
      author: 'Rahul Sharma',
      role: 'SDE @ Amazon',
      avatar: 'R',
      avatarUrl: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=random',
      time: '2h ago',
      content: "I gave the interview for the same role. Got similar questions in OA. If you're strong in DP and Graph, you'll do great.",
      upvotes: 42,
      badge: 'Top Contributor',
      replies: [
        {
          id: 11,
          author: 'Priya Singh',
          role: 'SDE @ Microsoft',
          avatarUrl: 'https://ui-avatars.com/api/?name=Priya+Singh&background=random',
          time: '1h ago',
          content: "Yes! I got exactly the same OA. They also asked one LLD question in phone screen.",
          upvotes: 12,
          replies: [
            {
              id: 111,
              author: 'Shreyas K.',
              role: 'SDE Intern @ Google',
              avatarUrl: 'https://ui-avatars.com/api/?name=Shreyas+K&background=random',
              time: '58m ago',
              content: "Thanks for confirming! 🙌",
              upvotes: 6,
              badge: 'Author'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      author: 'Aman Verma',
      role: 'SDE @ Flipkart',
      avatarUrl: 'https://ui-avatars.com/api/?name=Aman+Verma&background=random',
      time: '2h ago',
      content: "How was the difficulty level of the coding rounds on a scale of 1-5?",
      upvotes: 8,
      replies: [
        {
          id: 21,
          author: 'Shreyas K.',
          role: 'SDE Intern @ Google',
          avatarUrl: 'https://ui-avatars.com/api/?name=Shreyas+K&background=random',
          time: '1h ago',
          content: "I'd rate it 3.5/5. Most problems were standard with good follow up questions.",
          upvotes: 10,
          badge: 'Author'
        }
      ]
    }
  ];

  const CommentItem = ({ comment, isReply = false, isSubReply = false }) => (
    <div className={`flex gap-3 relative ${isReply ? 'mt-4' : 'mt-6'}`}>
      {/* Avatar */}
      <img 
        src={comment.avatarUrl} 
        alt={comment.author} 
        className={`rounded-full object-cover shrink-0 z-10 ${isReply ? 'w-8 h-8' : 'w-10 h-10'}`} 
      />
      
      {/* Connecting Line for Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="absolute left-5 top-10 bottom-[-20px] w-[2px] bg-gray-100 z-0"></div>
      )}
      
      <div className="flex-1">
        {/* Comment Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
              {comment.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  comment.badge === 'Top Contributor' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                }`}>
                  {comment.badge}
                </span>
              )}
              <span className="text-gray-400 text-xs">{comment.time}</span>
            </div>
            <div className="text-gray-500 text-xs mb-1.5">{comment.role}</div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        {/* Comment Content */}
        <p className="text-gray-700 text-sm leading-relaxed mb-3">
          {comment.content}
        </p>
        
        {/* Comment Actions */}
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <ThumbsUp className="w-4 h-4" />
            {comment.upvotes}
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
            <MessageSquare className="w-4 h-4" />
            Reply
          </button>
          <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Nested Replies */}
        {comment.replies && (
          <div className="pl-2">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply={true} isSubReply={isReply} />
            ))}
            {!isSubReply && comment.id === 1 && (
              <button className="flex items-center gap-1 text-primary text-xs font-semibold mt-4 hover:underline">
                View 3 more replies <ChevronDown className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Comments <span className="text-gray-500 font-normal">(86)</span></h3>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === tab ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="flex gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
          A
        </div>
        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <textarea 
            placeholder="Share your thoughts..." 
            className="w-full p-3 min-h-[80px] outline-none text-sm resize-y"
          ></textarea>
          <div className="bg-gray-50 px-3 py-2 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-500">
              <button className="p-1 hover:text-gray-800 rounded"><Bold className="w-4 h-4" /></button>
              <button className="p-1 hover:text-gray-800 rounded"><Italic className="w-4 h-4" /></button>
              <button className="p-1 hover:text-gray-800 rounded"><Link2 className="w-4 h-4" /></button>
              <button className="p-1 hover:text-gray-800 rounded"><Code className="w-4 h-4" /></button>
              <button className="p-1 hover:text-gray-800 rounded"><List className="w-4 h-4" /></button>
              <button className="p-1 hover:text-gray-800 rounded"><ListOrdered className="w-4 h-4" /></button>
              <button className="p-1 hover:text-gray-800 rounded"><ImageIcon className="w-4 h-4" /></button>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors">
              Post Comment
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        <button className="flex items-center gap-1 text-primary text-sm font-bold mt-6 hover:underline w-full justify-center">
          View 12 more comments <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PostComments;
