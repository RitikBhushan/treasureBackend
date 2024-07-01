const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const WorkApplication = require('../models/WorkApplication');
const Post = require('../models/Post');

// @route   POST /api/application/:post_id
// @desc    Apply for a work post
// @access  Private
router.post(
  '/:post_id',
  [
    auth,
    [
      check('submission.documentationLink', 'Documentation link is required').isURL(),
      check('submission.videoExplanationLink', 'Video explanation link is required').isURL(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { submission } = req.body;

    try {
      const post = await Post.findById(req.params.post_id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      const newApplication = new WorkApplication({
        post: req.params.post_id,
        seeker: req.user.id,
        submission,
      });

      const application = await newApplication.save();
      res.json(application);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/application/:post_id
// @desc    Get all applications for a work post
// @access  Private (Uploader only)
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const applications = await WorkApplication.find({ post: req.params.post_id }).populate('seeker', ['username', 'email']);
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/select/:application_id', auth, async (req, res) => {
    try {
      // Find the application
      const application = await WorkApplication.findById(req.params.application_id).populate('post');
      
      if (!application) {
        return res.status(404).json({ msg: 'Application not found' });
      }
  
      // Check if the logged in user is the owner of the post
      if (application.post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      // Update the status of the selected application
      application.status = 'accepted';
      await application.save();
  
      // Notify other applicants
      await WorkApplication.updateMany(
        { post: application.post._id, _id: { $ne: req.params.application_id } },
        { $set: { status: 'rejected' } }
      );
  
      res.json({ msg: 'Seeker selected and others rejected' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  

module.exports = router;
