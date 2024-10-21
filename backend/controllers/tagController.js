import Tag from "../models/tagModel.js";
import { errorHandler } from "../utils/error.js";

export const createTag = async (req, res, next) => {
  if (!req.body.name) {
    return next(errorHandler(400, "Name is required"));
  }

  const existingTag = await Tag.findOne({ name: req.body.name });
  if (existingTag) {
    return next(errorHandler(400, "Tag already exists"));
  }
  try {
    const newTag = new Tag({ name: req.body.name });
    await newTag.save();
    res.json(newTag);
  } catch (error) {
    return next(error);
  }
};

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    return next(error);
  }
};
