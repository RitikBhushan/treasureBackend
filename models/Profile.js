const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  fullName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  company: {
    name: { type: String },
    website: { type: String },
    size: { type: String },
  },
  picture: {
    type: String,
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  industry: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);
