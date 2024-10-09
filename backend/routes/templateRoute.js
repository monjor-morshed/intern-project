import express from "express";
import {} from "../controllers/userController.js";
import {
  verifyUser,
  verifyAdmin,
  verifyAdminOrOwner,
} from "../utils/verifyUser.js";

const router = express.Router();
router.post("/", verifyUser, createTemplate);

router.get("/", verifyAdmin, getAllTemplates);
router.get("/:templateId", verifyUser, getTemplateById);

router.put("/update/:templateId", verifyAdminOrOwner, updateTemplate);
router.delete("/delete/:templateId", verifyAdminOrOwner, deleteTemplate);
router.post("/add-question/:templateId", verifyAdminOrOwner, addQuestion);
router.put(
  "/update-question/:templateId/questions/:questionId",
  verifyAdminOrOwner,
  updateQuestion
);
router.delete(
  "/delete-question/:templateId/questions/:questionId",
  verifyAdminOrOwner,
  deleteQuestion
);
router.get("/filled-forms/:templateId", verifyAdminOrOwner, getFilledForms);
router.get("/results/:templateId", verifyAdminOrOwner, getTemplateResults);

export default router;
