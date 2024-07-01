const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
