const mongoose = require("mongoose");

const questionnaireSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  quizName: {
    type: String,
    required: [true, "Quiz name is required"],
    trim: true,
  },
  questionType: {
    type: String,
    enum: ["Text Only", "True/False", "Images"],
    required: [true, "Question type is required"],
  },
  questionTitle: {
    type: String,
    required: [true, "Question title is required"],
    trim: true,
  },
  optionType: {
    type: String,
    enum: ["Text Only", "True/False", "Images"],
    required: [true, "Option type is required"],
  },
  options: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each option
      optionText: { type: String, required: false },
      optionImage: { type: String, required: false },
      optionNumber : { type: Number, required: false },
    },
  ],
  correctOption: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the option's ID
    required: [true, "Correct answer is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to validate `correctOption` references an existing option
questionnaireSchema.pre("save", function (next) {
  const validOptionIds = this.options.map((option) => option._id.toString());
  if (!validOptionIds.includes(this.correctOption.toString())) {
    return next(new Error("Invalid correctOption: must match one of the option IDs"));
  }
  next();
});


const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);

module.exports = Questionnaire;
