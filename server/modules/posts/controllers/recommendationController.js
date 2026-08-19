import { RetrievalService } from '../../../ai/retrievalService.js';
import mongoose from 'mongoose';

export async function getRecommendedFeed(req, res) {
  const userId = req.body.authTokenData?.id || req.body.userId; // Depending on how auth middleware attaches it

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid or missing User ID' });
  }

  let limit = parseInt(req.query['limit']);
  if (!limit || limit <= 0) limit = 10;
  if (limit > 50) limit = 50;

  try {
    const recommendedPosts = await RetrievalService.getRecommendationsForUser(userId, limit);

    if (recommendedPosts.length === 0) {
      return res.status(200).json({
        message: 'No recommendations found. Try updating your profile.',
        data: []
      });
    }

    // Process posts for frontend consumption (similar to getAllPost)
    const response = recommendedPosts.map((post) => {
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

    return res.status(200).json({
      message: 'Recommended feed fetched successfully',
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong while fetching recommendations' });
  }
}
