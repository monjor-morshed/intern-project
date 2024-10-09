import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";
import Template from "../models/templateModel.js";

export const deleteUser = async (req, res, next) => {
  try {
    if (!req.params.userId) {
      return next(errorHandler(404, "User not found"));
    }
    if (req.params.userId !== req.user.userId && !req.user.isAdmin) {
      return next(errorHandler(403, "Unauthorized"));
    }
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not authorized to view users"));
  }
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can block users"));
    }
    if (!req.params.userId) {
      return next(errorHandler(404, "User not found"));
    }
    if (req.params.userId === req.user.userId) {
      return next(errorHandler(403, "You cannot block yourself"));
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.isBlocked = true;
    await user.save();
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    return next(error);
  }
};

export const unblockUser = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can unblock users"));
    }
    if (!req.params.userId) {
      return next(errorHandler(404, "User not found"));
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.isBlocked = false;
    await user.save();
    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    return next(error);
  }
};

export const addAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can add admins"));
    }
    if (!req.params.userId) {
      return next(errorHandler(404, "User not found"));
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: "Admin added successfully" });
  } catch (error) {
    return next(error);
  }
};

export const removeAdmin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can remove admins"));
    }
    if (!req.params.userId) {
      return next(errorHandler(404, "User not found"));
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.isAdmin = false;
    await user.save();
    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    return next(error);
  }
};
