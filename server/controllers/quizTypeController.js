const QuizType = require('../models/quizTypeModel');

// Create a new quiz type
exports.createQuizType = async (req, res) => {
  try {
    const { name } = req.body;
    const quizType = new QuizType({ name });
    await quizType.save();
    res.status(201).send(quizType);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all quiz types
exports.getQuizTypes = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const quizTypes = await QuizType.find().skip(skip).limit(limit);
      const total = await QuizType.countDocuments();
  
      res.status(200).send({
        total,
        page,
        limit,
        quizTypes
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };

// Get a quiz type by ID
exports.getQuizTypeById = async (req, res) => {
  try {
    const quizType = await QuizType.findById(req.params.id);
    if (!quizType) {
      return res.status(404).send({ message: 'Quiz type not found' });
    }
    res.status(200).send(quizType);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a quiz type
exports.updateQuizType = async (req, res) => {
  try {
    const { name } = req.body;
    const quizType = await QuizType.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!quizType) {
      return res.status(404).send({ message: 'Quiz type not found' });
    }
    res.send(quizType);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a quiz type
exports.deleteQuizType = async (req, res) => {
  try {
    const quizType = await QuizType.findByIdAndDelete(req.params.id);
    if (!quizType) {
      return res.status(404).send({ message: 'Quiz type not found' });
    }
    res.send(quizType);
  } catch (error) {
    res.status(500).send(error);
  }
};