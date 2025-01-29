import express from "express";
import {withoutTeam } from "../controller/Team.controller.js";
const router = express.Router();

router.get("/withoutTeam",withoutTeam);


export default router;