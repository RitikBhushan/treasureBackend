const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const Profile = require('../models/Profile');

// @route   POST /api/profile
// @desc    Create or update uploader profile
// @access  Private (authenticated route)
router.post(
  '/',
  [
    auth, // Authentication middleware
    upload.single('picture'), // Multer middleware for picture upload
    [
      check('fullName', 'Full name is required').not().isEmpty(),
      check('username', 'Username is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('skills', 'Skills are required').not().isEmpty(),
      check('industry', 'Industry is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, email, country, company, website, companySize, bio, skills, industry } = req.body;
    const profileFields = {
      fullName,
      username,
      email,
      country,
      company: {
        name: company,
        website: website,
        size: companySize,
      },
      bio,
      skills: skills.split(',').map(skill => skill.trim()), // Assuming skills are comma-separated
      industry,
      user: req.user.id, // Add authenticated user ID
    };

    // Handle picture upload if exists
    if (req.file) {
      profileFields.picture = req.file.path;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      // Update existing profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
