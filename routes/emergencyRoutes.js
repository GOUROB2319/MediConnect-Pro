import express from 'express';
import { 
  triggerEmergency,
  trackAmbulance
} from '../controllers/emergencyController.js';
import { protect, roleBasedAuth } from '../middleware/auth.js';

const router = express.Router();

// Emergency SOS
router.post('/sos', 
  protect, 
  roleBasedAuth(['patient']), 
  triggerEmergency
);

// Ambulance tracking
router.get('/:id/track', 
  protect, 
  roleBasedAuth(['patient', 'admin']), 
  trackAmbulance
);

export default router;