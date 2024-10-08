import express from "express";
import { signup, login, signout, test } from "../controllers/authController.js";
const router = express.Router();

router.get("/test", test);
router.post("/signup", signup);
router.post("/login", login);
router.post("/signout", signout);
export default router;
