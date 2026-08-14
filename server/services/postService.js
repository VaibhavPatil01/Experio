import {Post as postModel} from '../models/Post.js';  

// Tested working fine
export const createPostService = (post) => {
  return postModel.create(post);
};

export const deletePostService = (postId) => { 
  return postModel.deleteOne({ _id: postId }); 
};

export const upVotePostService = (postId, userId) => {
  const conditions = {
      _id: postId,
      upVotes: { $ne: userId },
    };

    // We are adding the upvote and also removing the user id from downvote if present
    const update = {
      $addToSet: { upVotes: userId },
      $pull: { downVotes: userId },
    };

    return postModel.updateOne(conditions, update);
};

export const downVotePostService = (postId, userId) => {
    const conditions = {
      _id: postId,
      downVotes: { $ne: userId },
    };

    // We are adding the upvote and also removing the user id from downvote if present
    const update = {
      $addToSet: { downVotes: userId },
      $pull: { upVotes: userId },
    };

    return postModel.updateOne(conditions, update);
};

export const nullifyUserVote = (postId, userId) => {
    const condition = { _id: postId };

    // We are adding the upvote and also removing the user id from downvote if present
    const update = { $pull: { upVotes: userId, downVotes: userId } };

    return postModel.updateOne(condition, update);
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
    
    // New Fields
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

  return postModel.findOneAndUpdate(filter, update);
};

export const getCompanyAndRoleService = () => {
  return postModel.aggregate([
    {
      $group: {
        _id: null,
        company: { $addToSet: '$company' },
        role: { $addToSet: '$role' },
      },
    },
  ]);
};

export const getTopCompaniesService = () => {
  return postModel.aggregate([
    {
      $group: {
        _id: '$company',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
};

export const addUserToBookmark = (postId, userId) => {
  const conditions = {
    _id: postId,
    bookmarks: { $ne: userId },
  };

  const update = { $addToSet: { bookmarks: userId } };

  return postModel.updateOne(conditions, update);
};

export const removeUserFromBookmark = (postId, userId) => {
  const conditions = {
    _id: postId,
    bookmarks: userId,
  };

  const update = { $pull: { bookmarks: userId } };

  return postModel.updateOne(conditions, update);
};

export const getAllPostsService = async (filter, sort, limit, skip) => {
  if (sort === 'top') {
    return postModel.aggregate([
      { $match: filter },
      { $addFields: { 
          voteCount: { 
            $subtract: [
              { $size: { $ifNull: ["$upVotes", []] } }, 
              { $size: { $ifNull: ["$downVotes", []] } }
            ] 
          } 
      }},
      { $sort: { voteCount: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { comments: 0, status: 0, tags: 0, voteCount: 0 } },
      { $lookup: { 
          from: 'users', 
          localField: 'userId', 
          foreignField: '_id', 
          as: 'userId' 
      }},
      { $unwind: "$userId" },
      { $project: {
          "userId.password": 0,
          "userId.email": 0,
          "userId.isAdmin": 0,
          "userId.isEmailVerified": 0
      }}
    ]);
  }

  return postModel
    .find(filter)
    .sort(sort)
    .select({
      comments: 0,
      status: 0,
      tags: 0,
    })
    .populate('userId', 'username profilePicture')
    .limit(limit)
    .skip(skip)
    .lean();
};

export const getUserBookmarkedPostService = (userId, limit, skip) => {
  return postModel
    .find({ bookmarks: { $in: [userId] } })
    .select({
      comments: 0,
      tags: 0,
      views: 0,
      status: 0,
    })
    .populate('userId', 'username profilePicture')
    .limit(limit)
    .skip(skip)
    .lean();
};

export const getRelatedPostsService = async (postId, limit) => {
  const post = await getPostService(postId);
  if (!post) {
    throw 'No Post Found with the Given ID';
  }

  const postList = await postModel
    .find({
      $and: [{ company: post.company }, { _id: { $ne: post._id } }],
    })
    .limit(limit)
    .select({
      _id: 1,
      title: 1,
    });

  if (postList.length === limit) return postList;

  const excludePostIds = [post._id];
  for (let i = 0; i < postList.length; i++) {
    excludePostIds.push(postList[i]._id);
  }

  limit -= postList.length;

  const relatedPostList = await postModel.aggregate([
    {
      $search: {
        index: 'RecommendPost',
        compound: {
          must: [
            {
              moreLikeThis: {
                like: {
                  title: post.title,
                  content: post.content,
                  postType: post.postType,
                },
              },
            },
          ],
          mustNot: [
            {
              in: {
                path: '_id',
                value: excludePostIds,
              },
            },
          ],
        },
      },
    },
    { $limit: limit },
    {
      $project: {
        _id: 1,
        title: 1,
      },
    },
  ]);

  return postList.concat(relatedPostList);
};

export const getUserPostsService = (userId, limit, skip) => {
  return postModel
    .find({ userId })
    .select({ comments: 0, tags: 0 })
    .populate('userId', 'username profilePicture')
    .limit(limit)
    .skip(skip)
    .lean();
};

export const deletePostUsingAuthorId = (postId, userId) => {
  return postModel.deleteOne({ _id: postId, userId: userId }); 
};

export const getPostService = (postId) => {
  return postModel
    .findByIdAndUpdate({ _id: postId }, { $inc: { views: 1 } }, { new: true })
    .populate('userId', 'username profilePicture workExperiences createdAt');
};

export const getPostCountByUserIdService = (userId) => {
  return postModel.countDocuments({ userId });
};











export const getPostCommentsService = (postId) => {
  return postModel.findById(postId)
    .select('comments isAnonymous userId')
    .populate({
      path: 'comments.userId',
      select: 'username profilePicture role badge'
    })
    .populate({
      path: 'comments.replies.userId',
      select: 'username profilePicture role badge'
    });
};

export const addCommentService = (postId, userId, content) => {
  return postModel.findByIdAndUpdate(
    postId,
    { $push: { comments: { userId, content, upVotes: [], downVotes: [], replies: [] } } },
    { new: true }
  );
};

export const addReplyService = (postId, commentId, userId, content) => {
  return postModel.findOneAndUpdate(
    { _id: postId, "comments._id": commentId },
    { $push: { "comments.$.replies": { userId, content, upVotes: [], downVotes: [] } } },
    { new: true }
  );
};

export const editCommentService = async (postId, commentId, userId, content) => {
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
  if (!post) throw new Error("Post or comment not found");
  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");
  if (comment.userId.toString() !== userId && !isAdmin) throw new Error("Unauthorized");
  comment.deleteOne();
  return post.save();
};

export const editReplyService = async (postId, commentId, replyId, userId, content) => {
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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

  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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
  const post = await postModel.findOne({ _id: postId, "comments._id": commentId });
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

