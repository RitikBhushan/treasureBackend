const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/Feedback');
const Post = require('../models/Post');
const WorkApplication = require('../models/WorkApplication');

// @route   POST /api/feedback
// @desc    Give feedback to an uploader
// @access  Private
router.post('/', auth, async (req, res) => {
  const { postId, rating, comment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const workApplication = await WorkApplication.findOne({
      post: postId,
      seeker: req.user.id,
      status: 'selected',
    });

    // if (!workApplication) {
    //   return res.status(401).json({ msg: 'You are not authorized to give feedback for this post' });
    // }

    const newFeedback = new Feedback({
      seeker: req.user.id,
      uploader: post.user,
      post: postId,
      rating,
      comment,
    });

    const feedback = await newFeedback.save();
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/feedback/uploader/:uploader_id
// @desc    Get all feedback for a specific uploader
// @access  Private
router.get('/uploader/:uploader_id', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ uploader: req.params.uploader_id });
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
