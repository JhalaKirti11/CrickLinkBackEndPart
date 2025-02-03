import express from "express";
import { googleSignIn } from "../controller/authController.js"; // .js zaroor add karo

const router = express.Router();

router.post("/googleSignIn", googleSignIn); // Google Login Route

export default router;
