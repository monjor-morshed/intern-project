import Template from "../models/templateModel.js";
import { errorHandler } from "../utils/error.js";

export const createTemplate = async (req, res, next) => {
  if (!req.body.title || !req.body.description || !req.body.topic) {
    return next(errorHandler(400, "All fields are required"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newTemplate = new Template({
    ...req.body,
    slug,
    creator: req.user.userId,
  });
  try {
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    return next(error);
  }
};

import Template from "../models/templateModel.js";
import FilledForm from "../models/filledFormModel.js";
import Tag from "../models/tagModel.js";

export const getAllTemplates = async (req, res, next) => {
  try {
    // Fetch the latest 10 templates
    const latestTemplates = await Template.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("creator", "name")
      .populate("tags", "name");

    // Fetch the top 5 most popular templates based on the number of filled forms
    const topTemplates = await Template.find()
      .sort({ filledForms: -1 })
      .limit(5)
      .populate("creator", "name")
      .populate("tags", "name");

    // Fetch all tags
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
