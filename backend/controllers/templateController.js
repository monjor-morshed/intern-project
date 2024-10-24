import Template from "../models/templateModel.js";
import User from "../models/userModel.js";
import Tag from "../models/tagModel.js";
import { errorHandler } from "../utils/error.js";

export const createTemplate = async (req, res, next) => {
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.topic ||
    !req.body.questions || // Ensure questions are provided
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
    const tags = await Promise.all(
      req.body.tags.map(async (tag) => {
        const existingTag = await Tag.findOne({ name: tag.name });
        if (existingTag) {
          return existingTag._id;
        } else {
          const newTag = new Tag({ name: tag.name });
          await newTag.save();
          return newTag._id;
        }
      })
    );

    const newTemplate = new Template({
      ...req.body,
      slug,
      tags,
      creator: req.user.id,
    });

    await newTemplate.save();

    await Promise.all(
      tags.map(async (tagId) => {
        await Tag.updateOne(
          { _id: tagId },
          { $push: { templates: newTemplate._id } }
        );
      })
    );

    if (req.user && req.user._id) {
      const userId = mongoose.Types.ObjectId(req.user._id);

      await User.updateOne(
        userId,
        { $push: { createdTemplates: newTemplate.id } },
        { new: true }
      );
    }

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
      .populate("tags", "name");

    const topTemplates = await Template.find()
      .sort({ filledForms: -1 })
      .limit(5)
      .populate("creator", "name")
      .populate("tags", "name");

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
export const getTemplateById = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId)
      .populate("creator", "name")
      .populate("tags", "name");

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    res.status(200).json(template);
  } catch (error) {
    return next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to update this template")
      );
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.templateId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedTemplate);
  } catch (error) {
    return next(error);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to delete this template")
      );
    }
    await Promise.all(
      template.tags.map(async (tagId) => {
        await Tag.updateOne(
          { _id: tagId },
          { $pull: { templates: template._id } }
        );
      })
    );

    await Template.findByIdAndDelete(req.params.templateId);

    res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

export const addQuestion = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to update this template")
      );
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.templateId,
      { $push: { questions: req.body } },
      { new: true }
    );

    res.status(200).json(updatedTemplate);
  } catch (error) {
    return next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to update this template")
      );
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.templateId,
      {
        $set: {
          "questions.$[elem]": req.body,
        },
      },
      {
        arrayFilters: [{ "elem._id": req.params.questionId }],
        new: true,
      }
    );

    res.status(200).json(updatedTemplate);
  } catch (error) {
    return next(error);
  }
};

export const deleteQuestion = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to update this template")
      );
    }

    const updatedTemplate = await Template.findByIdAndUpdate(
      req.params.templateId,
      { $pull: { questions: { _id: req.params.questionId } } },
      { new: true }
    );

    res.status(200).json(updatedTemplate);
  } catch (error) {
    return next(error);
  }
};

export const getFilledForms = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(
          403,
          "You are not authorized to view this template's forms"
        )
      );
    }

    const filledForms = await Template.findById(req.params.templateId)
      .populate("filledForms", "filledBy answers")
      .select("filledForms");

    res.status(200).json(filledForms);
  } catch (error) {
    return next(error);
  }
};

export const getTemplateResults = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    if (template.creator.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(
          403,
          "You are not authorized to view this template's results"
        )
      );
    }

    const filledForms = await Template.findById(req.params.templateId)
      .populate("filledForms", "filledBy answers")
      .select("filledForms");

    const results = filledForms.map((form) => {
      return {
        filledBy: form.filledBy,
        answers: form.answers,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    return next(error);
  }
};
