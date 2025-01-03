const express = require('express');
const multer = require('multer');
const Joi = require('joi');
const { createCategories, getCategories, updateCategories, deleteCategories, getCategoriesById } = require('../controllers/categoriesController');
const categoriesRouter = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Define validation schemas
const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Category name is required'
  }),
  thumbnailImage: Joi.string().required().messages({
    'string.empty': 'Thumbnail image is required'
  })
});

// Middleware to handle validation
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }
  next();
};

categoriesRouter.post(
  '/',
  upload.single('thumbnailImage'),
  validate(categorySchema),
  createCategories
);

categoriesRouter.get('/', getCategories);

categoriesRouter.get('/:id', getCategoriesById);

categoriesRouter.put(
  '/:id',
  upload.single('thumbnailImage'),
  validate(categorySchema),
  updateCategories
);

categoriesRouter.delete('/:id', deleteCategories);

module.exports = categoriesRouter;