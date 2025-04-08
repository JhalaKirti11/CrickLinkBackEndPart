import express from "express";

import { signUp, signIn, updateProfile, viewProfile, sendOTPController, updatePasswordWithOTP, allPlayer, userDetails, getUser } from "../controller/user.controller.js";
// import { getNotification } from "../controller/notification.controller.js"
// import { signUp, signIn, updateProfile, viewProfile, allPlayer, sendOTPController, updatePasswordWithOTP } from "../controller/user.controller.js";
import { body } from "express-validator";
import { uploadProfilePhoto } from "../config/multerSetup.js";


const router = express.Router();

router.post("/signup",
    body("name", "username is required").notEmpty(),
    body("email", "Invalid email id").isEmail(),
    body("email", "Email id is required").notEmpty(),
    body("password", "password is required").notEmpty(),
    body("contact", "contact is required").notEmpty(), signUp);

router.post("/signin", signIn);

router.put("/updateProfile/:userId", uploadProfilePhoto, updateProfile);
router.get("/viewProfile/:userId", viewProfile);
router.get("/playerList", allPlayer);
// router.get("/notification/:userId", getNotification);

router.post("/sendOTP", sendOTPController)
router.post("/updatePassword", updatePasswordWithOTP);
router.get("/detail/:userId", userDetails);
router.get("/:id",getUser);


export default router;
