import express from "express";
import {
  deleteUser,
  getUsers,
  getUser,
  blockUser,
  unblockUser,
  addAdmin,
  removeAdmin,
} from "../controllers/userController.js";
import {
  verifyUser,
  verifyAdmin,
  verifyAdminOrOwner,
} from "../utils/verifyUser.js";

const router = express.Router();

router.delete("/delete/:userId", verifyAdminOrOwner, deleteUser);
router.get("/", verifyAdmin, getUsers);
router.get("/:userId", verifyUser, getUser);
router.post("/block/:userId", verifyAdmin, blockUser);
router.post("/unblock/:userId", verifyAdmin, unblockUser);
router.post("/add-admin/:userId", verifyAdmin, addAdmin);
router.post("/remove-admin/:userId", verifyAdmin, removeAdmin);

export default router;
