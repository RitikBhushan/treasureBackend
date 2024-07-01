const mongoose = require('mongoose');

const WorkApplicationSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  submission: {
    documentationLink: {
      type: String,
      required: true,
    },
    videoExplanationLink: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('WorkApplication', WorkApplicationSchema);
