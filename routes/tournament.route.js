import express from "express";
import { createTournamentReq, tournamentList, tournamentById, deleteTournament, updateTornamentSchedule, addTeam} from "../controller/tournament.controller.js";
import { body } from "express-validator";

const router = express.Router();

router.post("/createTournamentReq", createTournamentReq);
router.get("/tournamentList", tournamentList);
router.get("/tournamentById/:id", tournamentById);
router.delete("/deleteTournament/:id", deleteTournament);
router.patch("/updateTournament/:id", updateTornamentSchedule);
// router.patch("/tournamentStatus", tournamentStatus);
router.patch("/addTeam/:id", addTeam);

export default router;