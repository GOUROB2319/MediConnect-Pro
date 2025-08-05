import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { sendNotification } from '../services/emailService.js';

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
    
    // Notify doctor
    const doctor = await User.findById(doctorId);
    sendNotification(
      doctor.email,
      'New Appointment Scheduled',
      `You have a new appointment on ${date} at ${time}`
    );
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get doctor queue
export const getDoctorQueue = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const appointments = await Appointment.find({
      doctor: doctorId,
      status: 'scheduled'
    }).sort('time').populate('patient');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};