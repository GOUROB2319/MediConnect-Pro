import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { sendNotification } from '../services/notificationService.js';

// Book appointment
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;
    
    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      status: 'scheduled'
    });
    
    await appointment.save();
    
    // Get doctor and patient details
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);
    
    // Send notifications
    sendNotification(
      doctor.email,
      'New Appointment Scheduled',
      `You have a new appointment with ${patient.name} on ${date} at ${time}`
    );
    
    // Send Bangla notification to patient
    const banglaMessage = `আপনার ডাক্তারের অ্যাপয়েন্টমেন্ট ${date} তারিখে ${time} সময়ে নির্ধারিত হয়েছে`;
    sendNotification(patient.phone, 'অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ', banglaMessage, true);
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get appointments for user
export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.params.userId;
    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }]
    })
    .populate('patient', 'name')
    .populate('doctor', 'name specialty');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};