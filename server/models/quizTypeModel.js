const mongoose = require('mongoose');

const quizTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

const QuizType = mongoose.model('QuizType', quizTypeSchema);

module.exports = QuizType;