const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// @route   GET /api/filter
// @desc    Filter work by various criteria
// @access  Private
router.get('/', auth, async (req, res) => {
  const { skills, slot, workRewardMin, workRewardMax, dateFrom, dateTo } = req.query;

  try {
    let query = {};

    // Filter by skills
    if (skills) {
      query.skillRequired = { $in: skills.split(',') };
    }

    // Filter by slot
    if (slot) {
      query.slots = parseInt(slot);
    }

    // Filter by work reward range
    if (workRewardMin || workRewardMax) {
      query.workReward = {};
      if (workRewardMin) {
        query.workReward.$gte = parseInt(workRewardMin);
      }
      if (workRewardMax) {
        query.workReward.$lte = parseInt(workRewardMax);
      }
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }

    const posts = await Post.find(query);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
