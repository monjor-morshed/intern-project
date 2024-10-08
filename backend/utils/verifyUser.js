import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!user) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    req.user = user;
    next();
  });
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!user || !user.isAdmin) {
      return next(errorHandler(403, "Forbidden"));
    }
    req.user = user;
    next();
  });
};

export const verifyAdminOrOwner = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }
    if (!user || (!user.isAdmin && user.id !== req.params.id)) {
      return next(errorHandler(403, "Forbidden"));
    }
    req.user = user;
    next();
  });
};
