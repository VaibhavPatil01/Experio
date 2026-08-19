import express from 'express';
import tokenDataParser from '../middlewares/tokenDataParser.js';
import isUserAuth from '../middlewares/isUserAuth.js';
import { addUserBookmark, createPost, deletePost, downVotePost, editPost, getAllPost, getCompanyAndRole, getTopCompanies, getPost, getRelatedPosts, getUserBookmarkedPost, getUserPost, removeUserBookmark, upVotePost, getPostComments, addComment, addReply, toggleCommentUpvote, toggleReplyUpvote, toggleCommentDownvote, toggleReplyDownvote, editComment, deleteComment, editReply, deleteReply } from '../controllers/postController.js';

const postRouter = express.Router(); 

// Working Routes
postRouter.get('/:id', isUserAuth, getPost); 
postRouter.post('', isUserAuth, createPost);
postRouter.delete('/:id', isUserAuth, deletePost); 
postRouter.post('/upvote/:id', isUserAuth, upVotePost);
postRouter.post('/downvote/:id', isUserAuth, downVotePost);
postRouter.put('/edit', isUserAuth, editPost);
postRouter.get('/data/company-roles', getCompanyAndRole);
postRouter.get('/data/top-companies', getTopCompanies);
postRouter.post('/bookmark/:id', isUserAuth, addUserBookmark);
postRouter.delete('/bookmark/:id', isUserAuth, removeUserBookmark); 
postRouter.get('', tokenDataParser, getAllPost);
postRouter.get('/user/bookmarked/:userId', tokenDataParser, getUserBookmarkedPost);
postRouter.get('/related/:id', isUserAuth, getRelatedPosts);
postRouter.get('/user/all/:userId', tokenDataParser, getUserPost); 

// Comment and Reply Routes
postRouter.get('/:id/comments', tokenDataParser, getPostComments);
postRouter.post('/:id/comments', isUserAuth, addComment);
postRouter.put('/:id/comments/:commentId', isUserAuth, editComment);
postRouter.delete('/:id/comments/:commentId', isUserAuth, deleteComment);
postRouter.post('/:id/comments/:commentId/replies', isUserAuth, addReply);
postRouter.put('/:id/comments/:commentId/replies/:replyId', isUserAuth, editReply);
postRouter.delete('/:id/comments/:commentId/replies/:replyId', isUserAuth, deleteReply);
postRouter.post('/:id/comments/:commentId/upvote', isUserAuth, toggleCommentUpvote);
postRouter.post('/:id/comments/:commentId/replies/:replyId/upvote', isUserAuth, toggleReplyUpvote);
postRouter.post('/:id/comments/:commentId/downvote', isUserAuth, toggleCommentDownvote);
postRouter.post('/:id/comments/:commentId/replies/:replyId/downvote', isUserAuth, toggleReplyDownvote);

export default postRouter;