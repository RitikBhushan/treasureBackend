const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../models/Post');

// @route   POST /api/post
// @desc    Create a new work post
// @access  Private (authenticated route)
router.post(
  '/',
  [
    auth, // Authentication middleware
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('slots', 'Slots is required').isIn([10, 25, 50, 75, 100]),
      check('workReward', 'Work reward is required').isInt({ min: 1 }),
      check('skillRequired', 'Skill required is required').not().isEmpty(),
      check('experienceLevel', 'Experience level is required').not().isEmpty(),
      check('deadline', 'Deadline is required').isISO8601(),
      check('confidentiality', 'Confidentiality is required').isBoolean(),
    ],
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, slots, workReward, skillRequired, experienceLevel, deadline, submissionRequirements, additionalRequirements, confidentiality } = req.body;

    try {
      const newPost = new Post({
        user: req.user.id,
        title,
        description,
        slots,
        workReward,
        skillRequired,
        experienceLevel,
        deadline,
        submissionRequirements: {
          documentationLink: submissionRequirements.documentationLink,
          videoExplanationLink: submissionRequirements.videoExplanationLink,
        },
        additionalRequirements,
        confidentiality,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/post
// @desc    Get all work posts for the authenticated user
// @access  Private (authenticated route)
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
