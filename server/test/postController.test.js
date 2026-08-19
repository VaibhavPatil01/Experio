import { jest } from '@jest/globals';
import { addReply } from '../modules/posts/controllers/postController.js';
import * as postService from '../modules/posts/services/postService.js';
import { eventBus, EVENTS } from '../modules/posts/events/index.js';

jest.mock('../modules/posts/services/postService.js', () => ({
  addReplyService: jest.fn()
}));

jest.mock('../modules/posts/events/index.js', () => ({
  eventBus: { emit: jest.fn() },
  EVENTS: {
    REPLY_REPLIED: 'reply.replied',
    COMMENT_REPLIED: 'comment.replied'
  }
}));

describe('Post Controller - Notification Events', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: { id: '000000000000000000000000', commentId: '111111111111111111111111' },
      body: { 
        authTokenData: { id: 'actor_1' },
        content: 'Hello'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should resolve recipient correctly for a direct comment reply', async () => {
    // Mock the DB returning the updated post with the comment author
    const mockPost = {
      comments: {
        id: () => ({
          userId: 'author_of_comment',
          replies: [{ _id: 'new_reply_id' }]
        })
      }
    };
    postService.addReplyService.mockResolvedValueOnce(mockPost);

    await addReply(req, res);

    expect(eventBus.emit).toHaveBeenCalledWith(EVENTS.COMMENT_REPLIED, expect.objectContaining({
      actorUserId: 'actor_1',
      recipientId: 'author_of_comment', // Should resolve to comment author
      targetEntityId: '111111111111111111111111',
      replyId: 'new_reply_id'
    }));
  });

  it('should resolve recipient securely from DB for a reply-to-reply', async () => {
    req.body.parentReplyId = 'parent_reply_id';
    
    const mockPost = {
      comments: {
        id: () => ({
          userId: 'author_of_comment',
          replies: Object.assign([{ _id: 'new_reply_id' }], {
            id: (id) => id === 'parent_reply_id' ? { userId: 'author_of_parent_reply' } : null
          })
        })
      }
    };
    postService.addReplyService.mockResolvedValueOnce(mockPost);

    await addReply(req, res);

    // It should NEVER use a client-supplied recipientId directly. It uses parentReplyId to find the user.
    expect(eventBus.emit).toHaveBeenCalledWith(EVENTS.REPLY_REPLIED, expect.objectContaining({
      actorUserId: 'actor_1',
      recipientId: 'author_of_parent_reply', // Resolved from DB
      targetEntityId: 'parent_reply_id'
    }));
  });

  it('should fallback if parentReplyId is spoofed/invalid', async () => {
    req.body.parentReplyId = 'invalid_id';
    
    const mockPost = {
      comments: {
        id: () => ({
          userId: 'author_of_comment',
          replies: Object.assign([{ _id: 'new_reply_id' }], {
            id: () => null // Not found
          })
        })
      }
    };
    postService.addReplyService.mockResolvedValueOnce(mockPost);

    await addReply(req, res);

    // Fallbacks to standard comment reply
    expect(eventBus.emit).toHaveBeenCalledWith(EVENTS.COMMENT_REPLIED, expect.objectContaining({
      recipientId: 'author_of_comment'
    }));
  });
});
