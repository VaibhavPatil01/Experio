import mongoose from 'mongoose';
import { getProcessedRecommendationsForUser } from '../services/recommendationService.js';

export async function getRecommendedFeed(req, res) {
  const userId = req.body.authTokenData?.id || req.body.userId; // Depending on how auth middleware attaches it

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid or missing User ID' });
  }

  let limit = parseInt(req.query['limit']);
  if (!limit || limit <= 0) limit = 10;
  if (limit > 50) limit = 50;

  try {
    const response = await getProcessedRecommendationsForUser(userId, limit);

    if (response.length === 0) {
      return res.status(200).json({
        message: 'No recommendations found. Try updating your profile.',
        data: []
      });
    }

    return res.status(200).json({
      message: 'Recommended feed fetched successfully',
      data: response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong while fetching recommendations' });
  }
}
