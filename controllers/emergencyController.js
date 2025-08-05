import Emergency from '../models/Emergency.js';
import User from '../models/User.js';
import { sendNotification } from '../services/notificationService.js';

// Trigger emergency
export const triggerEmergency = async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: 'Invalid location coordinates' });
    }

    const emergency = new Emergency({
      user: req.user.id,
      location: {
        type: 'Point',
        coordinates
      }
    });

    await emergency.save();
    
    // Find nearest ambulance
    const ambulance = await User.findOne({
      role: 'ambulance',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates
          },
          $maxDistance: 10000 // 10km radius
        }
      },
      available: true
    });

    if (ambulance) {
      emergency.ambulance = ambulance._id;
      emergency.status = 'responded';
      await emergency.save();
      
      // Send notification to ambulance
      sendNotification(
        ambulance.phone,
        'Emergency Alert',
        `Emergency reported at ${coordinates}. Please respond immediately.`
      );
      
      // Send notification to patient
      sendNotification(
        req.user.phone,
        'Ambulance Dispatched',
        `Ambulance ${ambulance.vehicleNumber} is on its way to your location.`,
        true
      );
    }

    res.status(201).json(emergency);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track ambulance
export const trackAmbulance = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('ambulance', 'name phone vehicleNumber location');
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    
    res.json({
      status: emergency.status,
      ambulance: emergency.ambulance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};