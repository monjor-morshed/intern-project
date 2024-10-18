import Template from "../models/templateModel.js";
import Question from "../models/questionModel.js"; // Import the Question model
import Tag from "../models/tagModel.js";
import { errorHandler } from "../utils/error.js";

export const createTemplate = async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.topic ||
    !req.body.questions || // Ensure questions are provided
    // !Array.isArray(req.body.questions) || // Ensure questions is an array
    req.body.questions.length === 0 // Ensure questions array is not empty
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    // Create questions and store their ObjectIds
    const questionIds = await Question.insertMany(req.body.questions);

    const newTemplate = new Template({
      ...req.body,
      slug,
      creator: req.user.userId,
      questions: questionIds.map((question) => question._id), // Store the ObjectIds of the created questions
    });

    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    return next(error);
  }
};

export const getAllTemplates = async (req, res, next) => {
  try {
    const latestTemplates = await Template.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("creator", "name")
      .populate("tags", "name")
      .populate("questions"); // Populate questions to get their details

    const topTemplates = await Template.find()
      .sort({ filledForms: -1 })
      .limit(5)
      .populate("creator", "name")
      .populate("tags", "name")
      .populate("questions"); // Populate questions to get their details

    const tags = await Tag.find();

    res.status(200).json({
      latestTemplates,
      topTemplates,
      tags,
    });
  } catch (error) {
    return next(error);
  }
};
