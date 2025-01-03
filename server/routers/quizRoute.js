const express = require("express");
const multer = require("multer");
const Joi = require("joi");
const {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizById,
  getAllQuizzes,
} = require("../controllers/quizController");

const quizRoute = express.Router();

// Configure multer for form data
const upload = multer();

// Joi Schema for Validation
const createQuizSchema = Joi.object({
  category: Joi.string().trim().required().messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),
  quizName: Joi.string().trim().required().messages({
    "string.empty": "Quiz name is required",
    "any.required": "Quiz name is required",
  }),
  questionType: Joi.string()
    .valid("Text Only", "True/False", "Images")
    .required()
    .messages({
      "any.only":
        "Question type must be one of 'Text Only', 'True/False', or 'Images'",
      "any.required": "Question type is required",
    }),
  questionTitle: Joi.string().trim().required().messages({
    "string.empty": "Question title is required",
    "any.required": "Question title is required",
  }),
  optionType: Joi.string()
    .valid("Text Only", "True/False", "Images")
    .required()
    .messages({
      "any.only":
        "Option type must be one of 'Text Only', 'True/False', or 'Images'",
      "any.required": "Option type is required",
    }),
  options: Joi.array().items(
    Joi.object({
      optionText: Joi.string().allow(null, "").optional(),
      optionImage: Joi.string().allow(null, "").optional(),
    })
  ),
  correctAnswer: Joi.string().required().messages({
    "string.empty": "Correct answer is required",
    "any.required": "Correct answer is required",
  }),
  createdAt: Joi.date().default(Date.now),
});

const createValidateQuiz = (req, res, next) => {
  const { error } = createQuizSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const updateQuizSchema = Joi.object({
  category: Joi.string().trim().messages({
    "string.empty": "Category is required",
    "any.required": "Category is required",
  }),
  quizName: Joi.string().trim().messages({
    "string.empty": "Quiz name is required",
    "any.required": "Quiz name is required",
  }),
  questionType: Joi.string()
    .valid("Text Only", "True/False", "Images")
    .messages({
      "any.only":
        "Question type must be one of 'Text Only', 'True/False', or 'Images'",
      "any.required": "Question type is required",
    }),
  questionTitle: Joi.string().trim().messages({
    "string.empty": "Question title is required",
    "any.required": "Question title is required",
  }),
  optionType: Joi.string().valid("Text Only", "True/False", "Images").messages({
    "any.only":
      "Option type must be one of 'Text Only', 'True/False', or 'Images'",
    "any.required": "Option type is required",
  }),
  options: Joi.array()
    .items(
      Joi.object({
        optionText: Joi.string().allow(null, "").optional(),
        optionImage: Joi.string().allow(null, "").optional(),
      })
    )
    .min(1)
    .messages({
      "array.min": "At least one option is required",
    }),
  correctOption: Joi.string().trim().messages({
    "string.empty": "Correct option is required",
    "any.required": "Correct option is required",
  }),
  createdAt: Joi.date().default(Date.now),
});

const updateValidateQuiz = (req, res, next) => {
  const { error } = updateQuizSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

// Routes
quizRoute.post("/", upload.none(), createQuiz);

quizRoute.put("/:id", upload.any(), updateQuiz);

quizRoute.delete("/:id", deleteQuiz);

quizRoute.get("/:id", getQuizById);

quizRoute.get("/", getAllQuizzes);

module.exports = quizRoute;