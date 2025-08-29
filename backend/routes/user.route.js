import express from "express";
import { getloggedUUser, login, logout, signup } from "../controllers/user.controller.js";
import { checkAuth } from "../middleware/checkAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/logged-user", checkAuth,getloggedUUser);

export default router;
