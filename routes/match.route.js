import express from "express";
import { createMatches, viewMatches, tournamentMatch, updateResult, MatchByUniqueMatchId, MatchByTeamId } from "../controller/match.controller.js";

const router = express.Router();

router.post("/createMatches", createMatches);

router.get("/matches", viewMatches);
router.post("/findMatches", MatchByUniqueMatchId);
router.post("/getMatchesByTeam", MatchByTeamId);

router.get("/tournament/:tournamentId", tournamentMatch);

router.patch("/result/:matchId", updateResult);

export default router;