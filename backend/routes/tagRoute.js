import express from "express";
import { verifyUser, verifyAdminOrOwner } from "../utils/verifyUser.js";
import { createTag, getAllTags } from "../controllers/tagController.js";
const router = express.Router();
router.post("/", verifyUser, createTag);
router.get("/get-tags", getAllTags);
export default router;
