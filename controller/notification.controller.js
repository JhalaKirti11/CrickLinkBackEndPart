// import { validationResult } from "express-validator"
// import mongoose from "mongoose";
// import { Team } from "../model/Team.model.js";
// import { User } from "../model/user.model.js";
// import { request, response } from "express";


// //==========================Request Accepted/Rejected============================

// export const reqAcceptance = async (req, res, next) => {
//     try {
//         const { statusR, playerId, teamId } = req.body;
//         // console.log("ids : "+ playerId +" "+ teamId);

//         const player = await User.findById(playerId);
//         const team = await Team.findById(teamId);
//         console.log("========================================");
//         console.log("team : " + team);
//         const captain = await User.findById({ _id: team.captainId });
//         // const pendingNotification = player.notifications.find((notif) => notif.status === "pending");
//         const reqStatusP = {
//             type: `Request ${statusR}`,
//             receiverId: team.captainId,
//             message: `Request to join team ${team.teamName} is ${statusR}.`,
//             status: statusR
//         }
//         const reqStatusC = {
//             type: `Request ${statusR}`,
//             senderId: playerId,
//             message: `${player.name} ${statusR} to join your team ${team.teamName}`
//         }

//         player.notifications.push(reqStatusP);
//         await player.save();
//         captain.notifications.push(reqStatusC);
//         await captain.save();

//         if (statusR == "accepted") {
//             team.players.push(playerId);
//             await team.save();
//             return res.status(201).json({ message: `${player.name} Added Successfully In Team ${team.teamName}` })
//         }

//         return res.status(201).json({ message: `${player.name} ${statusR} to join team ${team.teamName}` })
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Server error", error });
//     }
// };

// //=========================Request Send=========================================

// export const reqCaptainToPlayer = async (req, res, next) => {
//     try {
//         const { captainId } = req.params;
//         const { playerId } = req.body;
      
//         const player = await User.findById(playerId);
//         const captain = await User.findById(captainId);
//         console.log("captain : "+ captain);
//         console.log("player : "+ player);

//         let team = await Team.findOne({ captainId : captainId });
//         console.log("team found or not "+team)
//         if (!team)
//             return res.status(401).json({ message: "Only Team Captain Can Send Join Request to Player!" });

//         let teamId = team._id;
//         console.log("team Id : "+ teamId);
       

//         const notificationP = {
//             type: "recieved",
//             senderId: captainId,
//             message: `Request to join team ${team.teamName} is received.`,
//              status : "pending"
//         };
//         const notificationC = {
//             type: "send",
//             receiverId: playerId,
//             message: `Request to join my team ${team.teamName} is send.`,
//             status : "pending"
//         };

//         player.notifications.push(notificationP);
//         await player.save();
//         captain.notifications.push(notificationC);
//         await captain.save();

//         console.log("check : " + teamId + " " + playerId)
//         return res.status(200).json({
//             message: `Request to join my team ${team.teamName} is send.`,
//             teamId, notificationC
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ Error: "Server error", error });
//     }
// };


// //=============================== View Notification =====================================

// export const getNotification = async (req, res, next) => {
//     let { userId } = req.params;
//     try {
//         const user = await User.findById({ _id: userId })
//             .populate({ path: "notifications.receiverId", select: "name" })
//             .populate({ path: "notifications.senderId", select: "name" });
//         if (!user)
//             console.log("no user exist");
//         if (!user.notifications) {
//             return res.status(200).json({ message: "Not Notification Yet" })
//         }
//         // console.log("notices : "+ user.notifications)
//         return res.status(200).json({ message: user.notifications })
//     } catch (error) {
//         return res.status(500).json({ error: "Internal Server Error", error })
//     }
// }