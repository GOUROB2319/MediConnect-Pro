import express from 'express';
import {
  triggerEmergency,
  trackAmbulance,
  handleBloodRequest
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
router.get('/ambulance/:id/track', 
  protect, 
  roleBasedAuth(['patient', 'admin']), 
  trackAmbulance
);

// Blood request
router.post('/blood-request', 
  protect, 
  roleBasedAuth(['patient', 'admin']), 
  handleBloodRequest
);

export default router;