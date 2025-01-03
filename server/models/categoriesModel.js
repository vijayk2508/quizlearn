const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailImage: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;