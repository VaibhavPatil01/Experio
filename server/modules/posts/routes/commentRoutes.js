import { Router } from 'express';
import isUserAuth from '../../../middlewares/isUserAuth.js';
import { createComment, createCommentReply, deleteComment, deleteCommentReply, getComment, getCommentReplies } from '../controllers/commentController.js';

const commentRouter = Router();

// Comments
commentRouter.get('/:postid', isUserAuth, getComment);
commentRouter.post('/:postid', isUserAuth, createComment);
commentRouter.delete('/:postid/:commentid', isUserAuth, deleteComment);

// Comment Replies
commentRouter.get('/replies/:postid/:commentid', isUserAuth, getCommentReplies);
commentRouter.post('/replies/:postid/:commentid', isUserAuth, createCommentReply);
commentRouter.delete('/replies/:postid/:commentid/:replyid', isUserAuth, deleteCommentReply);

export default commentRouter; 