const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookmarkSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
    default: "Unknown",
  },
  date: {
    type: Date,
    required: true,
  },
  newsUrl: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
  },
  source: {
    type: String,
  },
  isBookmarked: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

bookmarkSchema.index({ userId: 1, newsUrl: 1 }, { unique: true });

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
