import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, ThumbsUp, ThumbsDown, MessageSquare, Share2, 
  Bold, Italic, Link2, Code, List, ListOrdered, ChevronDown,
  Pencil, Trash2, Flag
} from 'lucide-react';
import { useAppSelector } from '../redux/store.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfileStats } from '../services/userServices.js';
import { getPostComments, addComment, addReply, toggleCommentUpvote, toggleReplyUpvote, toggleCommentDownvote, toggleReplyDownvote, editComment, deleteComment, editReply, deleteReply } from '../services/postServices.js';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

// Extracted CommentItem component to prevent re-mounting on parent re-render
const CommentItem = ({ 
  comment, 
  isReply = false, 
  isSubReply = false, 
  parentId = null,
  replyingToId,
  setReplyingToId,
  profilePicUrl,
  initial,
  authorName,
  currentUser,
  toggleCommentUpvoteMutation,
  toggleReplyUpvoteMutation,
  toggleCommentDownvoteMutation,
  toggleReplyDownvoteMutation,
  addReplyMutation,
  editCommentMutation,
  deleteCommentMutation,
  editReplyMutation,
  deleteReplyMutation,
}) => {
  const [replyContent, setReplyContent] = useState('');
  const replyEditorRef = useRef(null);
  const editEditorRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const isOwner = currentUser === comment.userId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);
  
  // Clean up content when closing reply box, or prefill if opening reply box on a reply
  useEffect(() => {
    if (replyingToId !== comment.id) {
      setReplyContent('');
      if (replyEditorRef.current) replyEditorRef.current.innerHTML = '';
    } else if (isReply && replyEditorRef.current && replyEditorRef.current.innerHTML === '') {
      // Pre-fill with the user tag
      const tagHtml = `<span class="text-blue-600 font-medium cursor-pointer hover:underline">@${comment.author}</span>&nbsp;`;
      setReplyContent(tagHtml);
      replyEditorRef.current.innerHTML = tagHtml;
      
      // Move cursor to end
      setTimeout(() => {
        if (replyEditorRef.current) {
          replyEditorRef.current.focus();
          if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
            const range = document.createRange();
            range.selectNodeContents(replyEditorRef.current);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }, 0);
    }
  }, [replyingToId, comment.id, isReply, comment.author]);

  const handleFormat = (e, format) => {
    e.preventDefault();
    if (replyEditorRef.current && document.activeElement !== replyEditorRef.current) {
      replyEditorRef.current.focus();
    }
    
    switch (format) {
      case 'bold': document.execCommand('bold', false, null); break;
      case 'italic': document.execCommand('italic', false, null); break;
      case 'link':
        const url = prompt('Enter link URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      case 'code':
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
          const text = selection.toString();
          document.execCommand('insertHTML', false, `<code>${text}</code>`);
        }
        break;
      case 'list': document.execCommand('insertUnorderedList', false, null); break;
      case 'list-ordered': document.execCommand('insertOrderedList', false, null); break;
      default: break;
    }
    if (replyEditorRef.current) setReplyContent(replyEditorRef.current.innerHTML);
  };

  const handlePostReply = () => {
    const textContent = replyEditorRef.current?.textContent || '';
    if (!textContent.trim() && !replyContent.includes('<img')) return;
    
    // Always attach to the parent comment if it's a sub-reply
    const targetCommentId = isReply ? parentId : comment.id;
    // If this is a reply to another reply, pass the current reply's ID as parentReplyId
    const parentReplyId = isReply ? comment.id : null;

    addReplyMutation.mutate(
      { commentId: targetCommentId, content: replyContent, parentReplyId },
      {
        onSuccess: () => {
          setReplyContent('');
          if (replyEditorRef.current) replyEditorRef.current.innerHTML = '';
        }
      }
    );
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    setShowDropdown(false);
    setTimeout(() => {
      if (editEditorRef.current) {
        editEditorRef.current.innerHTML = comment.content;
        editEditorRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(editEditorRef.current);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 0);
  };

  const handleSaveEdit = () => {
    const textContent = editEditorRef.current?.textContent || '';
    if (!textContent.trim()) return;
    if (isReply) {
      editReplyMutation.mutate(
        { commentId: parentId, replyId: comment.id, content: editContent },
        { onSuccess: () => setIsEditing(false) }
      );
    } else {
      editCommentMutation.mutate(
        { commentId: comment.id, content: editContent },
        { onSuccess: () => setIsEditing(false) }
      );
    }
  };

  const handleDelete = () => {
    setShowDropdown(false);
    if (isReply) {
      deleteReplyMutation.mutate({ commentId: parentId, replyId: comment.id });
    } else {
      deleteCommentMutation.mutate({ commentId: comment.id });
    }
  };

  return (
    <div className={`flex gap-3 relative ${isReply ? 'mt-4' : 'mt-6'}`}>
      {comment.avatarUrl ? (
        <img 
          src={comment.avatarUrl} 
          alt={comment.author} 
          className={`rounded-full object-cover shrink-0 z-10 ${isReply ? 'w-8 h-8' : 'w-10 h-10'}`} 
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div className={`rounded-full bg-primary text-white items-center justify-center font-bold shrink-0 z-10 ${comment.avatarUrl ? 'hidden' : 'flex'} ${isReply ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-base'}`}>
        {comment.author.charAt(0)}
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div 
          className={`absolute ${isReply ? 'left-[15px] top-[32px]' : 'left-[19px] top-[40px]'} bottom-0 w-[2px] bg-gray-200 z-0`}
        ></div>
      )}
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-sm">{comment.author}</span>
              {comment.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${comment.badge === 'Top Contributor' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
                  {comment.badge}
                </span>
              )}
              <span className="text-gray-400 text-xs">{comment.time}</span>
              {comment.isEdited && (
                <span className="text-gray-400 text-[10px] italic">• Edited</span>
              )}
            </div>
            <div className="text-gray-500 text-xs mb-1.5">{comment.role}</div>
          </div>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                {isOwner ? (
                  <>
                    <button onClick={handleStartEdit} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button onClick={handleDelete} disabled={deleteCommentMutation?.isLoading || deleteReplyMutation?.isLoading} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </>
                ) : (
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left cursor-pointer">
                    <Flag className="w-3.5 h-3.5" />
                    Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="mt-2">
            <div className="border border-primary rounded-lg overflow-hidden ring-1 ring-primary flex flex-col">
              <div
                ref={editEditorRef}
                contentEditable
                onInput={(e) => setEditContent(e.currentTarget.innerHTML)}
                className="w-full p-2 min-h-[60px] outline-none text-sm bg-white editable-editor flex-1"
              />
              <div className="bg-white px-3 py-2 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="cursor-pointer border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editCommentMutation?.isLoading || editReplyMutation?.isLoading}
                  className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {(editCommentMutation?.isLoading || editReplyMutation?.isLoading) ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="text-gray-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap comment-content-html"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
        )}
        
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <button 
            onClick={() => {
              if (isReply) {
                toggleReplyUpvoteMutation.mutate({ commentId: parentId, replyId: comment.id });
              } else {
                toggleCommentUpvoteMutation.mutate(comment.id);
              }
            }}
            disabled={toggleCommentUpvoteMutation.isLoading || toggleReplyUpvoteMutation.isLoading}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${comment.hasUpvoted ? 'text-primary' : 'hover:text-primary'}`}
          >
            <ThumbsUp className={`w-4 h-4 ${comment.hasUpvoted ? 'fill-current' : ''}`} />
            {comment.upvotes}
          </button>
          
          <button 
            onClick={() => {
              if (isReply) {
                toggleReplyDownvoteMutation.mutate({ commentId: parentId, replyId: comment.id });
              } else {
                toggleCommentDownvoteMutation.mutate(comment.id);
              }
            }}
            disabled={toggleCommentDownvoteMutation.isLoading || toggleReplyDownvoteMutation.isLoading}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${comment.hasDownvoted ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <ThumbsDown className={`w-4 h-4 ${comment.hasDownvoted ? 'fill-current' : ''}`} />
            {comment.downvotes}
          </button>

          <button 
            onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
            className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Reply
          </button>
          
          <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {replyingToId === comment.id && (
          <div className="mt-4 flex gap-3">
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 overflow-hidden text-xs">
              {profilePicUrl ? (
                <img src={profilePicUrl} alt={authorName} className="w-full h-full object-cover" />
              ) : initial}
            </div>
            <div className="flex-1 border border-primary rounded-lg overflow-hidden ring-1 ring-primary transition-all flex flex-col">
              <div 
                ref={replyEditorRef}
                contentEditable
                onInput={(e) => setReplyContent(e.currentTarget.innerHTML)}
                className="w-full p-2 min-h-[60px] outline-none text-sm resize-y bg-white editable-editor flex-1"
                data-placeholder="Write a reply..."
              />
              <div className="bg-white px-3 py-2 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-500">
                  <button onMouseDown={(e) => handleFormat(e, 'bold')} className="p-1 hover:text-gray-800 rounded"><Bold className="w-3.5 h-3.5" /></button>
                  <button onMouseDown={(e) => handleFormat(e, 'italic')} className="p-1 hover:text-gray-800 rounded"><Italic className="w-3.5 h-3.5" /></button>
                  <button onMouseDown={(e) => handleFormat(e, 'link')} className="p-1 hover:text-gray-800 rounded"><Link2 className="w-3.5 h-3.5" /></button>
                  <button onMouseDown={(e) => handleFormat(e, 'code')} className="p-1 hover:text-gray-800 rounded"><Code className="w-3.5 h-3.5" /></button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setReplyingToId(null)}
                    className="cursor-pointer border border-primary text-primary hover:bg-primary/10 px-3 py-1 rounded-md text-xs font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handlePostReply}
                    disabled={addReplyMutation.isLoading}
                    className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-xs font-semibold transition-colors disabled:opacity-50">
                    {addReplyMutation.isLoading ? 'Replying...' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="relative mt-2">
            {comment.replies.map((reply, index) => {
              const isLast = index === comment.replies.length - 1;
              return (
                <div key={reply.id} className="relative">
                  {/* Curved line connecting to the reply */}
                  <div className={`absolute ${isReply ? 'left-[-29px]' : 'left-[-33px]'} top-[-16px] ${isReply ? 'w-[29px]' : 'w-[33px]'} h-[32px] border-b-2 border-l-2 border-gray-200 rounded-bl-xl bg-transparent z-10`}></div>
                  
                  {/* Mask for the last reply to hide the excess vertical line */}
                  {isLast && (
                    <div className={`absolute ${isReply ? 'left-[-31px]' : 'left-[-35px]'} top-[16px] bottom-[-20px] w-[6px] bg-white z-10`}></div>
                  )}
                  
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    isReply={true} 
                    isSubReply={isReply} 
                    parentId={comment.id}
                    replyingToId={replyingToId}
                    setReplyingToId={setReplyingToId}
                    profilePicUrl={profilePicUrl}
                    initial={initial}
                    authorName={authorName}
                    currentUser={currentUser}
                    toggleCommentUpvoteMutation={toggleCommentUpvoteMutation}
                    toggleReplyUpvoteMutation={toggleReplyUpvoteMutation}
                    toggleCommentDownvoteMutation={toggleCommentDownvoteMutation}
                    toggleReplyDownvoteMutation={toggleReplyDownvoteMutation}
                    addReplyMutation={addReplyMutation}
                    editCommentMutation={editCommentMutation}
                    deleteCommentMutation={deleteCommentMutation}
                    editReplyMutation={editReplyMutation}
                    deleteReplyMutation={deleteReplyMutation}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};


const PostComments = ({ postId }) => {
  const [activeTab, setActiveTab] = useState('Newest');
  const [newComment, setNewComment] = useState('');
  const editorRef = useRef(null);
  
  const [replyingToId, setReplyingToId] = useState(null);
  
  const user = useAppSelector((state) => state.userState.user);
  const queryClient = useQueryClient();
  
  const { data: profileData } = useQuery({
    queryKey: ['profile', user?.userId],
    queryFn: () => getUserProfileStats(user?.userId),
    enabled: !!user?.userId,
  });

  const { data: dbComments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });

  const profilePicUrl = profileData?.profilePicture || user?.profilePicture;
  const initial = user?.username ? user.username[0].toUpperCase() : 'A';
  const authorName = user?.username || 'Anonymous';
  
  const tabs = ['Newest', 'Most Helpful'];

  const commentsList = dbComments.map(c => ({
    id: c._id,
    originalCreatedAt: c.createdAt,
    userId: c.userId?._id,
    author: c.userId?.username || 'Anonymous',
    role: c.userId?.role || 'User',
    avatarUrl: c.userId?.profilePicture || '',
    badge: c.userId?.badge || '',
    time: formatTimeAgo(c.createdAt),
    content: c.content,
    isEdited: c.isEdited || false,
    upvotes: c.upVotes?.length || 0,
    hasUpvoted: c.upVotes?.includes(user?.userId),
    downvotes: c.downVotes?.length || 0,
    hasDownvoted: c.downVotes?.includes(user?.userId),
    replies: c.replies?.map(r => ({
      id: r._id,
      originalCreatedAt: r.createdAt,
      userId: r.userId?._id,
      author: r.userId?.username || 'Anonymous',
      role: r.userId?.role || 'User',
      avatarUrl: r.userId?.profilePicture || '',
      badge: r.userId?.badge || '',
      time: formatTimeAgo(r.createdAt),
      content: r.content,
      isEdited: r.isEdited || false,
      upvotes: r.upVotes?.length || 0,
      hasUpvoted: r.upVotes?.includes(user?.userId),
      downvotes: r.downVotes?.length || 0,
      hasDownvoted: r.downVotes?.includes(user?.userId),
    })) || []
  }));

  const sortedCommentsList = [...commentsList].sort((a, b) => {
    if (activeTab === 'Newest') {
      return new Date(b.originalCreatedAt) - new Date(a.originalCreatedAt);
    } else {
      const aScore = a.upvotes - a.downvotes;
      const bScore = b.upvotes - b.downvotes;
      return bScore - aScore;
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: (content) => addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setNewComment('');
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }
  });

  const addReplyMutation = useMutation({
    mutationFn: ({ commentId, content, parentReplyId }) => addReply(postId, commentId, content, parentReplyId),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setReplyingToId(null);
    }
  });

  const toggleCommentUpvoteMutation = useMutation({
    mutationFn: (commentId) => toggleCommentUpvote(postId, commentId),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const toggleReplyUpvoteMutation = useMutation({
    mutationFn: ({ commentId, replyId }) => toggleReplyUpvote(postId, commentId, replyId),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });
  
  const toggleCommentDownvoteMutation = useMutation({
    mutationFn: (commentId) => toggleCommentDownvote(postId, commentId),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const toggleReplyDownvoteMutation = useMutation({
    mutationFn: ({ commentId, replyId }) => toggleReplyDownvote(postId, commentId, replyId),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }) => editComment(postId, commentId, content),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId }) => deleteComment(postId, commentId),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const editReplyMutation = useMutation({
    mutationFn: ({ commentId, replyId, content }) => editReply(postId, commentId, replyId, content),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const deleteReplyMutation = useMutation({
    mutationFn: ({ commentId, replyId }) => deleteReply(postId, commentId, replyId),
    onSuccess: () => queryClient.invalidateQueries(['comments', postId])
  });

  const handleFormat = (e, format) => {
    e.preventDefault();
    if (editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.focus();
    }
    
    switch (format) {
      case 'bold': document.execCommand('bold', false, null); break;
      case 'italic': document.execCommand('italic', false, null); break;
      case 'link':
        const url = prompt('Enter link URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      case 'code':
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
          const text = selection.toString();
          document.execCommand('insertHTML', false, `<code>${text}</code>`);
        }
        break;
      case 'list': document.execCommand('insertUnorderedList', false, null); break;
      case 'list-ordered': document.execCommand('insertOrderedList', false, null); break;
      default: break;
    }
    if (editorRef.current) setNewComment(editorRef.current.innerHTML);
  };

  const handlePostComment = () => {
    const textContent = editorRef.current?.textContent || '';
    if (!textContent.trim() && !newComment.includes('<img')) return;
    addCommentMutation.mutate(newComment);
  };

  return (
    <div className="mt-8">
      <style>
        {`
          .editable-editor:empty:before { content: attr(data-placeholder); color: #9ca3af; pointer-events: none; display: block; }
          .editable-editor code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
          .editable-editor ul { list-style-type: disc; padding-left: 1.5rem; }
          .editable-editor ol { list-style-type: decimal; padding-left: 1.5rem; }
          .editable-editor a { color: #0D8B4F; text-decoration: underline; }
          .comment-content-html code { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; }
          .comment-content-html ul { list-style-type: disc; padding-left: 1.5rem; }
          .comment-content-html ol { list-style-type: decimal; padding-left: 1.5rem; }
          .comment-content-html a { color: #0D8B4F; text-decoration: underline; }
        `}
      </style>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Comments <span className="text-gray-500 font-normal">({commentsList.length})</span></h3>
        <div className="flex items-center gap-2 text-sm font-semibold">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 overflow-hidden text-sm">
          {profilePicUrl ? (
            <img src={profilePicUrl} alt={authorName} className="w-full h-full object-cover" />
          ) : initial}
        </div>
        <div className="flex-1 border border-primary rounded-lg overflow-hidden ring-1 ring-primary transition-all flex flex-col">
          <div 
            ref={editorRef}
            contentEditable
            onInput={(e) => setNewComment(e.currentTarget.innerHTML)}
            className="w-full p-3 min-h-[80px] outline-none text-sm resize-y bg-white editable-editor flex-1"
            data-placeholder="Share your thoughts..."
          />
          <div className="bg-white px-3 py-2 border-t border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-500">
              <button onMouseDown={(e) => handleFormat(e, 'bold')} className="p-1 hover:text-gray-800 rounded"><Bold className="w-4 h-4" /></button>
              <button onMouseDown={(e) => handleFormat(e, 'italic')} className="p-1 hover:text-gray-800 rounded"><Italic className="w-4 h-4" /></button>
              <button onMouseDown={(e) => handleFormat(e, 'link')} className="p-1 hover:text-gray-800 rounded"><Link2 className="w-4 h-4" /></button>
              <button onMouseDown={(e) => handleFormat(e, 'code')} className="p-1 hover:text-gray-800 rounded"><Code className="w-4 h-4" /></button>
              <button onMouseDown={(e) => handleFormat(e, 'list')} className="p-1 hover:text-gray-800 rounded"><List className="w-4 h-4" /></button>
              <button onMouseDown={(e) => handleFormat(e, 'list-ordered')} className="p-1 hover:text-gray-800 rounded"><ListOrdered className="w-4 h-4" /></button>
            </div>
            <button 
              onClick={handlePostComment}
              disabled={addCommentMutation.isLoading}
              className="cursor-pointer bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors disabled:opacity-50">
              {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>

      <div>
        {isLoading ? (
          <p className="text-gray-500 text-sm text-center py-4">Loading comments...</p>
        ) : sortedCommentsList.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          sortedCommentsList.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              replyingToId={replyingToId}
              setReplyingToId={setReplyingToId}
              profilePicUrl={profilePicUrl}
              initial={initial}
              authorName={authorName}
              currentUser={user?.userId}
              toggleCommentUpvoteMutation={toggleCommentUpvoteMutation}
              toggleReplyUpvoteMutation={toggleReplyUpvoteMutation}
              toggleCommentDownvoteMutation={toggleCommentDownvoteMutation}
              toggleReplyDownvoteMutation={toggleReplyDownvoteMutation}
              addReplyMutation={addReplyMutation}
              editCommentMutation={editCommentMutation}
              deleteCommentMutation={deleteCommentMutation}
              editReplyMutation={editReplyMutation}
              deleteReplyMutation={deleteReplyMutation}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PostComments;
