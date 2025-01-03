const Category = require("../models/categoriesModel");

// Create a new category
exports.createCategories = async (req, res) => {
  try {
    const { name } = req.body;
    let thumbnailImage;

    if (req.file) {
      thumbnailImage = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else {
      thumbnailImage = req.body.thumbnailImage;
    }

    const category = new Category({ name, thumbnailImage });
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find().skip(skip).limit(limit);
    const total = await Category.countDocuments();

    res.status(200).send({
      total,
      page,
      limit,
      categories,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a category by ID
exports.getCategoriesById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({ message: 'Category not found' });
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a category
exports.updateCategories = async (req, res) => {
  try {
    const { name } = req.body;
    let thumbnailImage;

    if (req.file) {
      thumbnailImage = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    } else {
      thumbnailImage = req.body.thumbnailImage;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, thumbnailImage },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a category
exports.deleteCategories = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
};
