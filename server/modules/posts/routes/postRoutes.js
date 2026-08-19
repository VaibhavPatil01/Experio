import express from 'express';
import tokenDataParser from '../../../middlewares/tokenDataParser.js';
import isUserAuth from '../../../middlewares/isUserAuth.js';
import { addUserBookmark, createPost, deletePost, downVotePost, editPost, getAllPost, getCompanyAndRole, getTopCompanies, getPost, getRelatedPosts, getUserBookmarkedPost, getUserPost, removeUserBookmark, upVotePost, getPostComments, addComment, addReply, toggleCommentUpvote, toggleReplyUpvote, toggleCommentDownvote, toggleReplyDownvote, editComment, deleteComment, editReply, deleteReply } from '../controllers/postController.js';

const postRouter = express.Router(); 

// Static data routes
postRouter.get('/data/company-roles', getCompanyAndRole);
postRouter.get('/data/top-companies', getTopCompanies);

// Collection level routes
postRouter.get('', tokenDataParser, getAllPost);
postRouter.post('', isUserAuth, createPost);
postRouter.get('/user/all/:userId', tokenDataParser, getUserPost);
postRouter.get('/user/bookmarked/:userId', tokenDataParser, getUserBookmarkedPost);

// Individual post routes
postRouter.get('/:id', isUserAuth, getPost);
postRouter.put('/edit', isUserAuth, editPost);
postRouter.delete('/:id', isUserAuth, deletePost);
postRouter.get('/related/:id', isUserAuth, getRelatedPosts);

// Interactions
postRouter.post('/upvote/:id', isUserAuth, upVotePost);
postRouter.post('/downvote/:id', isUserAuth, downVotePost);
postRouter.post('/bookmark/:id', isUserAuth, addUserBookmark);
postRouter.delete('/bookmark/:id', isUserAuth, removeUserBookmark);

// Comments
postRouter.get('/:id/comments', tokenDataParser, getPostComments);
postRouter.post('/:id/comments', isUserAuth, addComment);
postRouter.put('/:id/comments/:commentId', isUserAuth, editComment);
postRouter.delete('/:id/comments/:commentId', isUserAuth, deleteComment);
postRouter.post('/:id/comments/:commentId/upvote', isUserAuth, toggleCommentUpvote);
postRouter.post('/:id/comments/:commentId/downvote', isUserAuth, toggleCommentDownvote);

// Comment replies
postRouter.post('/:id/comments/:commentId/replies', isUserAuth, addReply);
postRouter.put('/:id/comments/:commentId/replies/:replyId', isUserAuth, editReply);
postRouter.delete('/:id/comments/:commentId/replies/:replyId', isUserAuth, deleteReply);
postRouter.post('/:id/comments/:commentId/replies/:replyId/upvote', isUserAuth, toggleReplyUpvote);
postRouter.post('/:id/comments/:commentId/replies/:replyId/downvote', isUserAuth, toggleReplyDownvote);

export default postRouter;