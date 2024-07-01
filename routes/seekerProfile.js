const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const SeekerProfile = require('../models/SeekerProfile');

// @route   POST /api/seeker/profile
// @desc    Create or update seeker profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('fullName', 'Full name is required').not().isEmpty(),
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Email is required').isEmail(),
      check('skills', 'Skills are required').not().isEmpty(),
      check('experienceLevel', 'Experience level is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, email, country, bio, skills, experienceLevel, picture } = req.body;

    const profileFields = {
      user: req.user.id,
      fullName,
      username,
      email,
      country,
      bio,
      skills: skills.split(',').map(skill => skill.trim()),
      experienceLevel,
      picture,
    };

    try {
      let profile = await SeekerProfile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        profile = await SeekerProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // Create
      profile = new SeekerProfile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
