import express from 'express';
import { 
  bookAppointment,
  getUserAppointments
} from '../controllers/appointmentController.js';
import { protect, roleBasedAuth } from '../middleware/auth.js';

const router = express.Router();

// Book appointment
router.post('/', 
  protect, 
  roleBasedAuth(['patient']), 
  bookAppointment
);

// Get user appointments
router.get('/:userId', 
  protect, 
  getUserAppointments
);

export default router;