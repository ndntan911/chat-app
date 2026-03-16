import express from "express";
import { authMe, searchUserByUsername } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authMe);
router.get("/search", searchUserByUsername);

export default router;
