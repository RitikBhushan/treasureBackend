const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slots: {
    type: Number,
    enum: [10, 25, 50, 75, 100],
    required: true,
  },
  workReward: {
    type: Number,
    required: true,
  },
  skillRequired: {
    type: [String],
    required: true,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  submissionRequirements: {
    documentationLink: { type: String },
    videoExplanationLink: { type: String },
  },
  additionalRequirements: {
    type: String,
  },
  confidentiality: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);
