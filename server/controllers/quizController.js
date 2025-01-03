const mongoose = require('mongoose');
const Quiz = require('../models/quizModel');

exports.createQuiz = async (req, res) => {
  try {
    const { questionType, category, quizType, optionType, questionTitle, correctOption, ...options } = req.body;

    // Create options array with unique IDs
    const optionsArray = Object.keys(options).map((key, index) => ({
      _id: new mongoose.Types.ObjectId(),
      optionText: options[key],
      optionNumber: `option${index + 1}`,
      optionIndex : index + 1
    }));

    // Find the correct option ID
    const correctOptionObj = optionsArray.find(option => option.optionNumber === correctOption);
    if (!correctOptionObj) {
      return res.status(400).json({ error: 'Correct option not found in provided options' });
    }

    // Create the questionnaire object
    const questionnaire = new Quiz({
      questionType,
      category,
      quizType,
      optionType,
      questionTitle,
      options: optionsArray,
      correctOption: correctOptionObj._id,
    });

    // Save the questionnaire to the database
    await questionnaire.save();
    res.status(201).json({ message: 'Questionnaire created successfully', data: questionnaire });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing questionnaire by ID
exports.updateQuiz = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find the questionnaire
    const questionnaire = await Quiz.findById(id);
    if (!questionnaire) {
      return res.status(404).json({ message: "Questionnaire not found" });
    }

    const updatedOptions = updates.options || questionnaire.options; 
    const validOptionIds = updatedOptions.map((option) => option._id?.toString() || null);

    if (updates.correctOption && !validOptionIds.includes(updates.correctOption.toString())) {
      return res.status(400).json({
        message: "Correct option must reference a valid option ID in the provided options",
      });
    }

    if (updates.options) {
      questionnaire.options = updates.options.map((option) => ({
        _id: option._id || mongoose.Types.ObjectId(), 
        optionText: option.optionText || "",
        optionImage: option.optionImage || "",
      }));
    }

    Object.keys(updates).forEach((key) => {
      if (key !== "options") {
        questionnaire[key] = updates[key];
      }
    });

    await questionnaire.save();
    res.status(200).json({ message: "Questionnaire updated successfully", data: questionnaire });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }

};

// Delete a questionnaire by ID
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestionnaire = await Quiz.findByIdAndDelete(id);
    if (!deletedQuestionnaire) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.status(200).json({ message: "Questionnaire deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a questionnaire by ID
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const questionnaire = await Quiz.findById(id);
    if (!questionnaire) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.status(200).json({ data: questionnaire });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all quizes
// Get all quizzes with pagination
exports.getAllQuizzes = async (req, res) => {
  try {
    // Extract page and limit from query parameters, with default values
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Retrieve quizzes with pagination
    const quizzes = await Quiz.find()
      .skip(skip)
      .limit(limit)
      .populate("category", "name") // Populate category field (adjust as needed)
      .populate("quizType", "name") // Populate quizType field (adjust as needed)
      .exec();

    // Count total documents in the collection
    const total = await Quiz.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Send response
    res.status(200).json({
      success: true,
      page,
      totalPages,
      total,
      limit,
      quizzes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving quizzes",
      error: error.message,
    });
  }
};
