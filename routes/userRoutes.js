import express from 'express';
import { 
  getUserProfile,
  updateUserProfile,
  getNearbyDoctors
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.use(protect);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', updateUserProfile);

// Get nearby doctors
router.get('/doctors/nearby', getNearbyDoctors);

export default router;