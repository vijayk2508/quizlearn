const Questionnaire = require('../models/questionnaireModel'); // Import Mongoose model

// Create a new questionnaire
exports.createQuestionnaire = async (req, res) => {
  try {
    const questionnaire = new Questionnaire(req.body);
    await questionnaire.save();
    res.status(201).json({ message: "Questionnaire created successfully", data: questionnaire });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing questionnaire by ID
exports.updateQuestionnaire = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Find the questionnaire
    const questionnaire = await Questionnaire.findById(id);
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
exports.deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestionnaire = await Questionnaire.findByIdAndDelete(id);
    if (!deletedQuestionnaire) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.status(200).json({ message: "Questionnaire deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a questionnaire by ID
exports.getQuestionnaireById = async (req, res) => {
  try {
    const { id } = req.params;
    const questionnaire = await Questionnaire.findById(id);
    if (!questionnaire) {
      return res.status(404).json({ error: "Questionnaire not found" });
    }
    res.status(200).json({ data: questionnaire });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all questionnaires
exports.getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.status(200).json({ data: questionnaires });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
