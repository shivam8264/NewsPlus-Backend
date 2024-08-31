const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const Bookmark = require('../models/Bookmark');

// Route to add or remove a bookmark
router.post('/toggleBookmark', fetchUser, async (req, res) => {
  try {
    const { title, description, author, date, newsUrl, imageUrl, source,category } = req.body;
    const userId = req.user.id;

    let bookmark = await Bookmark.findOne({ userId, newsUrl });

    let message = '';

    if (bookmark) {
      bookmark.isBookmarked = !bookmark.isBookmarked;
      if (!bookmark.isBookmarked) {
        await Bookmark.deleteOne({ _id: bookmark._id });
        message = 'Bookmark Removed Successfully';
      } else {
        await bookmark.save();
        message = 'Bookmark Added Successfully';
      }
    } else {
      bookmark = new Bookmark({
        userId,
        title,
        description,
        author,
        date,
        newsUrl,
        imageUrl,
        source,
        category,
        isBookmarked: true
      });
      await bookmark.save();
      message = 'Bookmark Added Successfully.  Check Bookmark Section';
    }

    res.json({ bookmark, message });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route to get all bookmarks for a user
router.get('/getBookmarks', fetchUser, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.user.id, isBookmarked: true });
    res.json(bookmarks);
    // console.log(bookmarks)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
