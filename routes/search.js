const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET /api/search
// @desc    Search for work by skills and company name
// @access  Private
router.get('/', auth, async (req, res) => {
  const { skills, companyName } = req.query;

  try {
    let query = {};

    // Search by skills
    if (skills) {
      query.skillRequired = { $in: skills.split(',') };
    }

    // Search by company name
    // if (companyName) {
    //   const users = await User.find({ companyName: new RegExp(companyName, 'i') });
    //   const userIds = users.map(user => user._id);
    //   if (userIds.length > 0) {
    //     query.user = { $in: userIds };
    //   } else {
    //     // If no users are found, no need to search further
    //     return res.json([]);
    //   }
    // }

    const posts = await Post.find(query).populate('user', 'companyName');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
