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

router.delete("/delete/:id", verifyAdminOrOwner, deleteUser);
router.get("/", verifyAdmin, getUsers);
router.get("/:id", verifyUser, getUser);
router.post("/block/:id", verifyAdmin, blockUser);
router.post("/unblock/:id", verifyAdmin, unblockUser);
router.post("/add-admin/:id", verifyAdmin, addAdmin);
router.post("/remove-admin/:id", verifyAdmin, removeAdmin);

export default router;
