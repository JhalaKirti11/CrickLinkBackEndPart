import express from "express";
import { createGroup, viewGroup, addToGroup, getGroupByUserId , updateGroup, sendMessages, ViewAllMessages} from "../controller/groupChat.controller.js";

const router = express.Router();

router.post("/createGroup/:userId", createGroup);
router.get("/viewGroup/:groupId", viewGroup);
router.post("/joinGroup/:groupId", addToGroup);
router.get("/getGroupByUserId/:userId", getGroupByUserId);
router.patch("/updateGroup/:groupId", updateGroup);

//=============== Message Service==========================

router.post("/sendMessages/:userId", sendMessages);
router.get("/viewMessages/:groupId", ViewAllMessages);

export default router; 