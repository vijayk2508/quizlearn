
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
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
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Auto-generate ObjectId for each option
        optionText: { type: String, required: false },
        optionIndex: { type: Number, required: true },
        optionImage: { type: String, required: false },
      },
    ],
    correctOption: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Correct answer is required"],
      validate: {
        validator: function (value) {
          // Ensure the correctOption matches one of the options' _id
          return this.options.some(option => option._id.toString() === value.toString());
        },
        message: "Correct option must match one of the options' IDs.",
      },
    },
  },
  {
    timestamps: true,
  }
);


quizSchema.path("options").validate(function (value) {
  return value.length > 0;
}, "At least one option is required");

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;

