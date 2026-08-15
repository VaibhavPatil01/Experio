import express from "express";
import passport from 'passport';
import { deleteUser, updateUserProfile, updateProfilePicture, uploadUserResume, forgotPassword, getLoginStatus, getUserProfile, googleLogin, githubLogin, loginUser, logoutUser, registerUser, resetPassword, searchUser, verifyEmail } from '../controllers/userController.js';
import isUserAuth from '../middleware/isUserAuth.js';
import upload, { uploadResume } from '../middleware/upload.js';

const userRouter = express.Router(); 

userRouter.post('/login', loginUser);
userRouter.get('/verify-email/:token', verifyEmail);
userRouter.post('/register', registerUser);
userRouter.get('/status', getLoginStatus);
userRouter.get('/profile/:id', getUserProfile);
userRouter.delete('/', isUserAuth, deleteUser);
userRouter.put('/profile', isUserAuth, updateUserProfile); 
userRouter.put('/profile-picture', isUserAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(500).json({ 
        message: 'Image upload to Cloudinary failed', 
        error: err.message || err.toString() 
      });
    }
    next();
  });
}, updateProfilePicture);

userRouter.put('/resume', isUserAuth, (req, res, next) => {
  uploadResume.single('resumeFile')(req, res, (err) => {
    if (err) {
      console.error("Multer upload error:", err);
      return res.status(500).json({ 
        message: 'Resume upload to Cloudinary failed', 
        error: err.message || err.toString() 
      });
    }
    next();
  });
}, uploadUserResume);

userRouter.post('/logout', logoutUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword); 
userRouter.get('/search', searchUser);

// User Routes for Google Auth 
userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/user/auth/google/failed', session: false, }), googleLogin);
userRouter.get('/auth/google/failed', (req, res) => { return res.status(401).json({ message: 'Login Failure' }); });

// User Routes for GitHub Auth
userRouter.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
userRouter.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/user/auth/github/failed', session: false, }), githubLogin);
userRouter.get('/auth/github/failed', (req, res) => { return res.status(401).json({ message: 'GitHub Login Failure' }); });

export default userRouter;  