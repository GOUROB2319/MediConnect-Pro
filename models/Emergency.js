import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'completed'],
    default: 'pending'
  },
  ambulance: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now }
});

emergencySchema.index({ location: '2dsphere' });

export default mongoose.model('Emergency', emergencySchema);