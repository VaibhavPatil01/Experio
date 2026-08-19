import { Post as postModel } from '../models/Post.js';

export const createPost = (post) => {
  return postModel.create(post);
};

export const deletePostById = (postId) => { 
  return postModel.deleteOne({ _id: postId }); 
};

export const addUpVote = (postId, userId) => {
  const conditions = {
    _id: postId,
    upVotes: { $ne: userId },
  };
  const update = {
    $addToSet: { upVotes: userId },
    $pull: { downVotes: userId },
  };
  return postModel.updateOne(conditions, update);
};

export const addDownVote = (postId, userId) => {
  const conditions = {
    _id: postId,
    downVotes: { $ne: userId },
  };
  const update = {
    $addToSet: { downVotes: userId },
    $pull: { upVotes: userId },
  };
  return postModel.updateOne(conditions, update);
};

export const removeUserVotes = (postId, userId) => {
  const condition = { _id: postId };
  const update = { $pull: { upVotes: userId, downVotes: userId } };
  return postModel.updateOne(condition, update);
};

export const updatePost = (filter, update) => {
  return postModel.findOneAndUpdate(filter, update);
};

export const getCompanyAndRoleAggregation = () => {
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

export const getTopCompaniesAggregation = () => {
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

export const addBookmark = (postId, userId) => {
  const conditions = {
    _id: postId,
    bookmarks: { $ne: userId },
  };
  const update = { $addToSet: { bookmarks: userId } };
  return postModel.updateOne(conditions, update);
};

export const removeBookmark = (postId, userId) => {
  const conditions = {
    _id: postId,
    bookmarks: userId,
  };
  const update = { $pull: { bookmarks: userId } };
  return postModel.updateOne(conditions, update);
};

export const getTopPostsAggregation = (filter, limit, skip) => {
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
};

export const findPosts = (filter, sort, limit, skip) => {
  return postModel
    .find(filter)
    .sort(sort)
    .select({ comments: 0, status: 0, tags: 0 })
    .populate('userId', 'username profilePicture')
    .limit(limit)
    .skip(skip)
    .lean();
};

export const findPostsByIds = (matchIds) => {
  return postModel.find({ _id: { $in: matchIds } })
    .select('_id title company userId isAnonymous')
    .populate('userId', 'username profilePicture')
    .lean();
};

export const findPostsByCompanyExcluding = (company, excludePostIds, limit) => {
  return postModel.find({
    company: company,
    _id: { $nin: excludePostIds }
  })
  .select('_id title company userId isAnonymous')
  .populate('userId', 'username profilePicture')
  .limit(limit)
  .lean();
};

export const findPostsByRoleExcluding = (role, excludePostIds, limit) => {
  return postModel.find({
    role: role,
    _id: { $nin: excludePostIds }
  })
  .select('_id title company userId isAnonymous')
  .populate('userId', 'username profilePicture')
  .limit(limit)
  .lean();
};

export const getUserBookmarkedPosts = (userId, limit, skip) => {
  return postModel
    .find({ bookmarks: { $in: [userId] } })
    .select({ comments: 0, tags: 0, views: 0, status: 0 })
    .populate('userId', 'username profilePicture')
    .limit(limit)
    .skip(skip)
    .lean();
};

export const getUserPosts = (userId, limit, skip) => {
  return postModel
    .find({ userId })
    .select({ comments: 0, tags: 0 })
    .populate('userId', 'username profilePicture')
    .limit(limit)
    .skip(skip)
    .lean();
};

export const deletePostByAuthorId = (postId, userId) => {
  return postModel.deleteOne({ _id: postId, userId: userId }); 
};

export const incrementViewsAndGetPost = (postId) => {
  return postModel
    .findByIdAndUpdate({ _id: postId }, { $inc: { views: 1 } }, { new: true })
    .populate('userId', 'username profilePicture workExperiences createdAt');
};

export const getPostById = (postId) => {
  return postModel.findById(postId);
};

export const countPostsByUserId = (userId) => {
  return postModel.countDocuments({ userId });
};

export const getPostWithComments = (postId) => {
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

export const addComment = (postId, userId, content) => {
  return postModel.findByIdAndUpdate(
    postId,
    { $push: { comments: { userId, content, upVotes: [], downVotes: [], replies: [] } } },
    { new: true }
  );
};

export const addReply = (postId, commentId, userId, content) => {
  return postModel.findOneAndUpdate(
    { _id: postId, "comments._id": commentId },
    { $push: { "comments.$.replies": { userId, content, upVotes: [], downVotes: [] } } },
    { new: true }
  );
};

export const findPostWithSpecificComment = (postId, commentId) => {
  return postModel.findOne({ _id: postId, "comments._id": commentId });
};
