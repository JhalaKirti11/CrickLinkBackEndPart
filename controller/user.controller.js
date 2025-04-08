import { validationResult } from "express-validator"
import { User } from "../model/user.model.js";
import { sendOTP } from '../config/mailer.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadProfilePhoto } from "../config/multerSetup.js";

//---------------------user signUP----------------------------
export const signUp = async (request, response, next) => {
  try {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      console.log(errors);
      return response.status(401).json({ error: "Bad request" });
    }
    let saltKey = bcrypt.genSaltSync(10);
    let encryptedPassword = bcrypt.hashSync(request.body.password, saltKey);
    request.body.password = encryptedPassword;
    console.log("===============================");
    console.log("body : " + request.body);
    let user = await User.create(request.body);
    return response.status(201).json({ message: "Sign up success", user });
  }
  catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

//--------------------------user signIn----------------------------------
export const signIn = async (request, response, next) => {

  try {
    let { email, password } = request.body;
    let user = await User.findOne({ email });
    if (user) {
      console.log("Passwords : "+ password +" "+ user.password)
      let status = bcrypt.compareSync(password, user.password);
      return status ? response.status(200).json({ message: "Sign in success..", user, token: generateToken(user._id) }) : response.status(401).json({ error: "Bad request | invalid password" })
    }
    else
      return response.status(401).json({ error: "Bad request | invalid email id" });
  }
  catch (err) {
    console.log(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
const generateToken = (userId) => {
  let token = jwt.sign({ payload: userId }, "fsdfsdrereioruxvxncnv");
  return token;
};

//---------------------------------OTP-----------------------------------------------

let otpStore = {};
export const sendOTPController = async (request, response) => {
  try {
    const { email } = request.body;
    console.log("email--------------", email);
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("===================", otp);
    // Store OTP in memory (you can use Redis or DB for production)
    otpStore[email] = otp;

    // Send OTP using separate mailer function
    const message = await sendOTP(email, otp);
    console.log(message); // OTP sent successfully

    return response.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// ------------------ Verify OTP & Update Password API ------------------
export const updatePasswordWithOTP = async (request, response) => {
  try {
    const { email, otp, newPassword } = request.body;

    // Step 1: Verify OTP
    if (otpStore[email] !== otp) {
      return response.status(401).json({ error: "Invalid or expired OTP" });
    }

    // Step 2: Find user
    let user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Step 3: Hash new password
    let saltKey = bcrypt.genSaltSync(10);
    let encryptedNewPassword = bcrypt.hashSync(newPassword, saltKey);

    // Step 4: Update password in DB
    user.password = encryptedNewPassword;
    await user.save();

    // Clear OTP after successful update
    delete otpStore[email];

    return response.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("ram", err);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

// --------------------------profileUpdate---------------------------------------

export const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { skills, experience, location, height } = req.body;
  const profilePhotoUrl = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : null;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        "profile.skills": skills,
        "profile.experience": experience,
        "profile.location": location,
        "profile.height":height,
        "profile_photo": profilePhotoUrl,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//--------------------------- show profile -----------------------------

export const viewProfile = async (req, res) => {
  const { userId } = req.params;
  console.log('userId', userId);
  try {
    const user = await User.findById(userId, "name role profile profile_photo");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      name: user.name,
      role: user.role,
      profile: {
        skills: user.profile.skills,
        experience: user.profile.experience,
        location: user.profile.location,
      },
      profile_photo: user.profile_photo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//=============================All Player============================
export const allPlayer = async (req, res) => {
  try {
    const players = await User.find(
      { role: "player" },
      "name role profile profile_photo email contact"
    );
    if (!players || players.length === 0) {
      return res.status(404).json({ error: "No players found" });
    }
    const playerProfiles = players.map((player) => ({
      _id: player._id,
      name: player.name,
      role: player.role,
      email: player.email,
      contact: player.contact,
      profile: {
        skills: player.profile.skills,
        experience: player.profile.experience,
        location: player.profile.location,
      },
      profile_photo: player.profile_photo,
    }));

    return res.status(200).json({
      message: "Player profiles retrieved successfully",
      players: playerProfiles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//===========================Complete User detail======================

export const userDetails = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      name: user.name,
      role: user.role,
      email : user.email,
      contact : user.contact,
      profile: {
        skills: user.profile.skills,
        experience: user.profile.experience,
        location: user.profile.location,
        height: user.profile.height
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//==========================================================================

export const getUser = async (request, response, next) => {
  try {
    const user = await User.findById(request.params.id);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }
    console.log(user)
    response.json({ user });
  }
  catch (error) {
    console.error('Error fetching user:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};
