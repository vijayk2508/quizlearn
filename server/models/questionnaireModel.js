const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionType: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quizType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizType",
      required: true,
    },
    questionTitle: {
      type: String,
      required: true,
    },

    optionType: {
      type: String,
      required: true,
      enum: ["textOnly", "trueFalse", "images"],
    },

    options: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each option
        optionText: { type: String, required: false },
        optionImage: { type: String, required: false },
      },
    ],
    correctOption: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the option's ID
      required: [true, "Correct answer is required"],
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.path("options").validate(function (value) {
  return value.length > 0;
}, "At least one option is required");

const Questionnaire = mongoose.model("Questionnaire", questionSchema);

module.exports = Questionnaire;
