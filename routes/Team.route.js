import express from "express";
import { createTeam, viewTeam, getTeam } from "../controller/Team.controller.js";
//import { reqAcceptance, reqCaptainToPlayer } from "../controller/notification.controller.js";
 import {addtoTeamReq , reqacceptBYCaptin, getNotification } from "../controller/Team.controller.js"

import { body } from "express-validator";

const router = express.Router();

router.post("/createTeam",
    body("Teamname", "Teamname is required").notEmpty(),
    body("captainId", "captainId is required").notEmpty(),
    createTeam);

router.get("/viewteam", viewTeam);
router.get("/:teamId", getTeam);

router.get("/notification/:userId",getNotification )
// router.post("/reqCaptainToPlayer/:captainId", reqCaptainToPlayer);
// router.put("/req-res2", reqAcceptance);


router.post("/req-to-join",addtoTeamReq);
router.put("/req-res",reqacceptBYCaptin);


export default router;
