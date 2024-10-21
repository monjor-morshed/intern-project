import express from "express";
import {
  verifyUser,
  verifyAdmin,
  verifyAdminOrOwner,
} from "../utils/verifyUser.js";

import {
  createFilledForm,
  getFilledForms,
  getFilledForm,
  updateFilledForm,
  deleteFilledForm,
} from "../controllers/fillFormsController.js";

const router = express.Router();
// Route for a user to fill up a form
router.post("/", verifyUser, createFilledForm);

// Route for a user to see all their filled up forms
router.get("/:userId/forms", verifyUser, getFilledForms);

// Route for a user to see a specific filled up form for a template
router.get(
  "/:userId/:templateId/forms/:filledFormId",
  verifyUser,
  getFilledForm
);

// Route for an admin to see all filled up forms
router.get("/", verifyAdmin, getFilledForms);

// Route for an admin to see a specific filled up form for a template
router.put(
  "/:templateId/update/:filledFormId",
  verifyAdminOrOwner,
  updateFilledForm
);

// Route for an admin to delete a specific filled up form for a template
router.delete(
  "/:templateId/delete/:filledFormId",
  verifyAdminOrOwner,
  deleteFilledForm
);

export default router;
