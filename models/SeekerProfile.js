const mongoose = require('mongoose');

const SeekerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
});

module.exports = mongoose.model('SeekerProfile', SeekerProfileSchema);
