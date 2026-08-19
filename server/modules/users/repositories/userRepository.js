import mongoose from 'mongoose';
import UserModel from '../models/User.js'


export const findUserByEmail = (email) => {
  return UserModel.findOne({ email });
};

export const deleteUser = (id) => { 
  return UserModel.deleteOne({ _id: id }); 
};

export const updateUser = (id, data) => {
  return UserModel.findByIdAndUpdate(id, data, { new: true });
};

export const createUser = (user) => { 
  return UserModel.create(user);
};

export const verifyUserEmail = (email) => {
  return UserModel.findOneAndUpdate({ email }, { isEmailVerified: true });
};

export async function getUserProfile(userId) {
  return await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId), // make sure to convert userId if passed as string
      },
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'userId',
        as: 'postData',
        pipeline: [
          {
            $addFields: {
              upVoteCount: { $size: '$upVotes' },
              downVoteCount: { $size: '$downVotes' },
            },
          },
          {
            $group: {
              _id: null,
              viewCount: { $sum: '$views' },
              postCount: { $sum: 1 },
              upVoteCount: { $sum: '$upVoteCount' },
              downVoteCount: { $sum: '$downVoteCount' },
            },
          },
        ],
      },
    },
    {
      $project: {
        password: 0,
        isAdmin: 0,
        isEmailVerified: 0,
        'postData._id': 0,
        _id: 0,
      },
    },
  ]);
}

export const editUserProfile = (
  userId,
  updatedProfile,
) => {
  return UserModel.findByIdAndUpdate(userId, updatedProfile);
};

export const updatePassword = (email, newPassword) => {
  return UserModel.findOneAndUpdate({ email }, { password: newPassword });
}; 

export const findUserById = (id) => {
  return UserModel.findOne({ _id: id });
};

export const searchUsers = (
  search,
  limit,
  skip,
) => {
  return UserModel.aggregate([ 
    {
      $match: {
        username: {
          $regex: new RegExp(search, 'i'),
        },
        isEmailVerified: true,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        username: 1,
        designation: 1,
        passingYear: 1,
        branch: 1,
        profilePicture: 1,
        createdAt: 1,
        email: 1,
        workExperiences: 1,
      },
    },
  ]);
};

export const countUsers = () => {
  return UserModel.countDocuments({ isEmailVerified: true });
};