const express = require("express");
const questionnaireRoute = express.Router();
const Joi = require("joi");
const {
  createQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  getAllQuestionnaires,
  getQuestionnaireById,
} = require("../controllers/questionnaireController");

// Joi Schema for Validation
const creatQuestionnaireSchema = Joi.object({
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

const createValidateQuestionnaire = (req, res, next) => {
  const { error } = creatQuestionnaireSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      errors: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const updateQuestionnaireSchema = Joi.object({
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
  optionType: Joi.string()
    .valid("Text Only", "True/False", "Images")
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
  ).min(1).messages({
    "array.min": "At least one option is required",
  }),
  correctOption: Joi.string().trim().messages({
    "string.empty": "Correct option is required",
    "any.required": "Correct option is required",
  }),
  createdAt: Joi.date().default(Date.now),
});

const updateValidateQuestionnaire = (req, res, next) => {
  const { error } = updateQuestionnaireSchema.validate(req.body, {
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
questionnaireRoute.post(
  "/create",
  createValidateQuestionnaire,
  createQuestionnaire
);

questionnaireRoute.put(
  "/update/:id",
  updateValidateQuestionnaire,
  updateQuestionnaire
);

questionnaireRoute.delete("/delete/:id", deleteQuestionnaire);

questionnaireRoute.get("/:id", getQuestionnaireById);

questionnaireRoute.get("/", getAllQuestionnaires);

module.exports = questionnaireRoute;
