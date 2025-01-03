const express = require('express');
const { createQuizType, getQuizTypes, getQuizTypeById, updateQuizType, deleteQuizType } = require('../controllers/quizTypeController');
const quizTypeRouter = express.Router();

quizTypeRouter.post('/', createQuizType);
quizTypeRouter.get('/', getQuizTypes);
quizTypeRouter.get('/:id', getQuizTypeById);
quizTypeRouter.put('/:id', updateQuizType);
quizTypeRouter.delete('/:id', deleteQuizType);

module.exports = quizTypeRouter;