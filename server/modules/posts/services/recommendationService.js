import { RetrievalService } from '../../../ai/retrievalService.js';

export const getProcessedRecommendationsForUser = async (userId, limit) => {
  const recommendedPosts = await RetrievalService.getRecommendationsForUser(userId, limit);

  if (!recommendedPosts || recommendedPosts.length === 0) {
    return [];
  }

  // Process posts for frontend consumption
  const processedPosts = recommendedPosts.map((post) => {
    const { upVotes, downVotes, bookmarks } = post;
    
    const isUpVoted = Array.isArray(upVotes) && upVotes.some((id) => id.toString() === userId.toString());
    const isDownVoted = !isUpVoted && Array.isArray(downVotes) && downVotes.some((id) => id.toString() === userId.toString());
    const isBookmarked = Array.isArray(bookmarks) && bookmarks.some((id) => id.toString() === userId.toString());

    return {
      ...post,
      userId: post.isAnonymous ? { ...(post.userId || {}), username: "Anonymous User", profilePicture: "", _id: null } : post.userId,
      isUpVoted,
      isDownVoted,
      isBookmarked,
      votes: (Array.isArray(upVotes) ? upVotes.length : 0) - (Array.isArray(downVotes) ? downVotes.length : 0),
      upVotes: undefined,
      downVotes: undefined,
      bookmarks: undefined,
    };
  });

  return processedPosts;
};
