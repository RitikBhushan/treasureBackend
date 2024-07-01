const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Bookmark = require('../models/Bookmark');
const Post = require('../models/Post');

// @route   POST /api/bookmark/:post_id
// @desc    Bookmark a work post
// @access  Private
router.post('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newBookmark = new Bookmark({
      seeker: req.user.id,
      post: req.params.post_id,
    });

    const bookmark = await newBookmark.save();
    res.json(bookmark);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/bookmark
// @desc    Get all bookmarked work for the seeker
// @access  Private
// router.get('/', auth, async (req, res) => {
//   try {
//     const bookmarks = await Bookmark.find({ seeker: req.user.id }).populate('post');
//     res.json(bookmarks);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });
router.get('/', auth, async (req, res) => {
    try {
      const bookmarks = await Bookmark.find({ seeker: req.user.id });
      const postIds = bookmarks.map(bookmark => bookmark.post);
  
      const posts = await Post.find({ _id: { $in: postIds } });
      
      const results = bookmarks.map(bookmark => ({
        ...bookmark.toObject(),
        post: posts.find(post => post._id.toString() === bookmark.post.toString())
      }));
  
      res.json(results);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  router.delete('/:bookmark_id', auth, async (req, res) => {
    try {
      const bookmark = await Bookmark.findById(req.params.bookmark_id);
  
      if (!bookmark) {
        return res.status(404).json({ msg: 'Bookmark not found' });
      }
  
      // Check if the user is the owner of the bookmark
      if (bookmark.seeker.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      await bookmark.remove();
  
      res.json({ msg: 'Bookmark removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
module.exports = router;
