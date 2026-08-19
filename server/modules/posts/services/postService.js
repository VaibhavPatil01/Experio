import * as postRepository from '../repositories/postRepository.js';
import { QdrantRepository } from '../../../core/qdrant/qdrantRepository.js';
import qdrantClient from '../../../configs/qdrant.js';

export const createPostService = (post) => {
  return postRepository.createPost(post);
};

export const deletePostService = (postId) => { 
  return postRepository.deletePostById(postId); 
};

export const upVotePostService = (postId, userId) => {
  return postRepository.addUpVote(postId, userId);
};

export const downVotePostService = (postId, userId) => {
  return postRepository.addDownVote(postId, userId);
};

export const nullifyUserVote = (postId, userId) => {
  return postRepository.removeUserVotes(postId, userId);
};

export const editPostService = (postId, userId, editedPostData, isEditorAdmin = false) => {
  let filter = { _id: postId };
  if (!isEditorAdmin) {
    filter = { _id: postId, userId };
  }
  const update = {
    title: editedPostData.title,
    content: editedPostData.content,
    summary: editedPostData.summary,
    company: editedPostData.company,
    role: editedPostData.role,
    postType: editedPostData.postType,
    domain: editedPostData.domain,
    rating: editedPostData.rating,
    status: editedPostData.status,
    tags: editedPostData.tags,
    hiringType: editedPostData.hiringType,
    interviewMode: editedPostData.interviewMode,
    interviewDate: editedPostData.interviewDate,
    result: editedPostData.result,
    difficulty: editedPostData.difficulty,
    rounds: editedPostData.rounds,
    technologies: editedPostData.technologies,
    dsaTopics: editedPostData.dsaTopics,
    coreSubjects: editedPostData.coreSubjects,
    preparationDuration: editedPostData.preparationDuration,
    preparationResources: editedPostData.preparationResources,
    overallTips: editedPostData.overallTips,
    salary: editedPostData.salary,
    isAnonymous: editedPostData.isAnonymous,
  };
  return postRepository.updatePost(filter, update);
};

export const getCompanyAndRoleService = () => {
  return postRepository.getCompanyAndRoleAggregation();
};

export const getTopCompaniesService = () => {
  return postRepository.getTopCompaniesAggregation();
};

export const addUserToBookmark = (postId, userId) => {
  return postRepository.addBookmark(postId, userId);
};

export const removeUserFromBookmark = (postId, userId) => {
  return postRepository.removeBookmark(postId, userId);
};

export const getAllPostsService = async (filter, sort, limit, skip) => {
  if (sort === 'top') {
    return postRepository.getTopPostsAggregation(filter, limit, skip);
  }
  return postRepository.findPosts(filter, sort, limit, skip);
};

export const getUserBookmarkedPostService = (userId, limit, skip) => {
  return postRepository.getUserBookmarkedPosts(userId, limit, skip);
};

export const getRelatedPostsService = async (postId, limit) => {
  const post = await postRepository.getPostById(postId);
  if (!post) {
    throw 'No Post Found with the Given ID';
  }

  const excludePostIds = [post._id.toString()];
  let relatedPosts = [];

  try {
    const uuid = QdrantRepository.mongoIdToUuid(postId.toString());
    const pointInfo = await qdrantClient.retrieve('interviews', { ids: [uuid] });

    if (pointInfo && pointInfo.length > 0) {
      const qdrantResponse = await qdrantClient.recommend('interviews', {
        positive: [uuid],
        limit: limit + 1,
        with_payload: true,
      });

      const qdrantMatches = qdrantResponse
        .filter(match => match.payload && match.payload.mongoId !== post._id.toString())
        .slice(0, limit);

      if (qdrantMatches.length > 0) {
        const matchIds = qdrantMatches.map(match => match.payload.mongoId);
        const dbPosts = await postRepository.findPostsByIds(matchIds);

        relatedPosts = qdrantMatches.map(match => {
          const dbPost = dbPosts.find(p => p._id.toString() === match.payload.mongoId);
          if (dbPost) {
            return {
              _id: dbPost._id,
              title: dbPost.title,
              company: dbPost.company,
              userId: dbPost.isAnonymous ? { ...dbPost.userId, username: 'Anonymous User', profilePicture: '' } : dbPost.userId,
              matchPercentage: Math.round(match.score * 100)
            };
          }
          return null;
        }).filter(Boolean);
        
        excludePostIds.push(...relatedPosts.map(p => p._id.toString()));
      }
    }
  } catch (error) {
    console.error('[Qdrant Search] Failed to get similar experiences:', error);
  }

  if (relatedPosts.length < limit) {
    const remainingLimit = limit - relatedPosts.length;
    const fallbackByCompany = await postRepository.findPostsByCompanyExcluding(post.company, excludePostIds, remainingLimit);

    fallbackByCompany.forEach(p => {
      relatedPosts.push({
        _id: p._id,
        title: p.title,
        company: p.company,
        userId: p.isAnonymous ? { ...p.userId, username: 'Anonymous User', profilePicture: '' } : p.userId,
        matchPercentage: 75
      });
      excludePostIds.push(p._id.toString());
    });

    if (relatedPosts.length < limit) {
      const stillRemainingLimit = limit - relatedPosts.length;
      const fallbackByRole = await postRepository.findPostsByRoleExcluding(post.role, excludePostIds, stillRemainingLimit);

      fallbackByRole.forEach(p => {
        relatedPosts.push({
          _id: p._id,
          title: p.title,
          company: p.company,
          userId: p.isAnonymous ? { ...p.userId, username: 'Anonymous User', profilePicture: '' } : p.userId,
          matchPercentage: 65
        });
        excludePostIds.push(p._id.toString());
      });
    }
  }

  return relatedPosts;
};

export const getUserPostsService = (userId, limit, skip) => {
  return postRepository.getUserPosts(userId, limit, skip);
};

export const deletePostUsingAuthorId = (postId, userId) => {
  return postRepository.deletePostByAuthorId(postId, userId);
};

export const getPostService = (postId) => {
  return postRepository.incrementViewsAndGetPost(postId);
};

export const getPostCountByUserIdService = (userId) => {
  return postRepository.countPostsByUserId(userId);
};

export const getPostCommentsService = (postId) => {
  return postRepository.getPostWithComments(postId);
};

export const addCommentService = (postId, userId, content) => {
  return postRepository.addComment(postId, userId, content);
};

export const addReplyService = (postId, commentId, userId, content) => {
  return postRepository.addReply(postId, commentId, userId, content);
};

export const editCommentService = async (postId, commentId, userId, content) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");
  if (comment.userId.toString() !== userId) throw new Error("Unauthorized");
  comment.content = content;
  comment.isEdited = true;
  comment.editedAt = new Date();
  return post.save();
};

export const deleteCommentService = async (postId, commentId, userId, isAdmin = false) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");
  if (comment.userId.toString() !== userId && !isAdmin) throw new Error("Unauthorized");
  comment.deleteOne();
  return post.save();
};

export const editReplyService = async (postId, commentId, replyId, userId, content) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");
  const reply = comment.replies.id(replyId);
  if (!reply) throw new Error("Reply not found");
  if (reply.userId.toString() !== userId) throw new Error("Unauthorized");
  reply.content = content;
  reply.isEdited = true;
  reply.editedAt = new Date();
  return post.save();
};

export const deleteReplyService = async (postId, commentId, replyId, userId, isAdmin = false) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");
  const reply = comment.replies.id(replyId);
  if (!reply) throw new Error("Reply not found");
  if (reply.userId.toString() !== userId && !isAdmin) throw new Error("Unauthorized");
  reply.deleteOne();
  return post.save();
};

export const toggleCommentUpvoteService = async (postId, commentId, userId) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  const upvoteIndex = comment.upVotes.indexOf(userId);
  const downvoteIndex = comment.downVotes.indexOf(userId);
  if (upvoteIndex === -1) {
    comment.upVotes.push(userId);
    if (downvoteIndex !== -1) comment.downVotes.splice(downvoteIndex, 1);
  } else {
    comment.upVotes.splice(upvoteIndex, 1);
  }
  return post.save();
};

export const toggleReplyUpvoteService = async (postId, commentId, replyId, userId) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  const reply = comment.replies.id(replyId);
  if (!reply) throw new Error("Reply not found");
  const upvoteIndex = reply.upVotes.indexOf(userId);
  const downvoteIndex = reply.downVotes.indexOf(userId);
  if (upvoteIndex === -1) {
    reply.upVotes.push(userId);
    if (downvoteIndex !== -1) reply.downVotes.splice(downvoteIndex, 1);
  } else {
    reply.upVotes.splice(upvoteIndex, 1);
  }
  return post.save();
};

export const toggleCommentDownvoteService = async (postId, commentId, userId) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  const downvoteIndex = comment.downVotes.indexOf(userId);
  const upvoteIndex = comment.upVotes.indexOf(userId);
  if (downvoteIndex === -1) {
    comment.downVotes.push(userId);
    if (upvoteIndex !== -1) comment.upVotes.splice(upvoteIndex, 1);
  } else {
    comment.downVotes.splice(downvoteIndex, 1);
  }
  return post.save();
};

export const toggleReplyDownvoteService = async (postId, commentId, replyId, userId) => {
  const post = await postRepository.findPostWithSpecificComment(postId, commentId);
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  const reply = comment.replies.id(replyId);
  if (!reply) throw new Error("Reply not found");
  const downvoteIndex = reply.downVotes.indexOf(userId);
  const upvoteIndex = reply.upVotes.indexOf(userId);
  if (downvoteIndex === -1) {
    reply.downVotes.push(userId);
    if (upvoteIndex !== -1) reply.upVotes.splice(upvoteIndex, 1);
  } else {
    reply.downVotes.splice(downvoteIndex, 1);
  }
  return post.save();
};
