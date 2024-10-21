import Template from "../models/templateModel.js";

import FilledForm from "../models/filledFormModel.js";
import { errorHandler } from "../utils/error.js";

export const createFilledForm = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.templateId);

    if (!template) {
      return next(errorHandler(404, "Template not found"));
    }

    const filledForm = new FilledForm({
      template: req.params.templateId,
      filledBy: req.user.id,
      answers: req.body.answers,
      slug: req.body.slug,
    });

    await filledForm.save();
    res.status(201).json(filledForm);
  } catch (error) {
    return next(error);
  }
};

export const getFilledForms = async (req, res, next) => {
  try {
    const filledForms = await FilledForm.find({ filledBy: req.params.userId });
    res.status(200).json(filledForms);
  } catch (error) {
    return next(error);
  }
};
export const getFilledForm = async (req, res, next) => {
  try {
    const filledForm = await FilledForm.findById(req.params.filledFormId);

    if (!filledForm) {
      return next(errorHandler(404, "Filled form not found"));
    }

    res.status(200).json(filledForm);
  } catch (error) {
    return next(error);
  }
};

export const updateFilledForm = async (req, res, next) => {
  try {
    const filledForm = await FilledForm.findById(req.params.filledFormId);

    if (!filledForm) {
      return next(errorHandler(404, "Filled form not found"));
    }

    if (filledForm.filledBy.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to update this form")
      );
    }

    filledForm.answers = req.body.answers;
    await filledForm.save();
    res.status(200).json(filledForm);
  } catch (error) {
    return next(error);
  }
};

export const deleteFilledForm = async (req, res, next) => {
  try {
    const filledForm = await FilledForm.findById(req.params.filledFormId);

    if (!filledForm) {
      return next(errorHandler(404, "Filled form not found"));
    }

    if (filledForm.filledBy.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not authorized to delete this form")
      );
    }

    await filledForm.remove();
    res.status(204).json();
  } catch (error) {
    return next(error);
  }
};
