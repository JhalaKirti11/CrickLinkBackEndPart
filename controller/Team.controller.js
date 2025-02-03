import { validationResult } from "express-validator"
import mongoose from "mongoose";
import { Team } from "../model/Team.model.js";
import { User } from "../model/user.model.js";
import { request, response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// --------------create team--------------------

export const createTeam = async (request, response, next) => {
    try {
        const { teamName, username } = request.body;
        console.log(request.body)
        // Find the captain by username
        const captain = await User.findOne({ name: username });
        console.log("captain : " + captain);
        if (!captain) {
            return response.status(404).json({ error: "Captain not found" });
        }

        // Create the team with captainId
        const result = await Team.create({
            teamName: teamName,
            captainId: captain._id,
        });

        if (result) {
            return response.status(201).json({ message: "Team created successfully", team: result });
        }

        return response.status(400).json({ error: "Bad request" });
    } catch (err) {
        console.error(err);
        return response.status(500).json({ error: "Internal server error" });
    }
};


// --------------------view all team---------------------------

export const viewTeam = async (request, response, next) => {
    try {
        const result = await Team.find()
            .populate("captainId", "name")
            .populate("players");;
        console.log(result);
        if (result) {
            return response.status(200).json({ Team: result });
        }
        return response.status(401).json({ error: "bad error" });
    }
    catch (err) {
        return response.status(500).json({ error: "internal server error" });
    }
};


// -----------------------------view team with id--------------------------

// export const getTeam = async (request, response, next) => {
//     try {
//         let {teamId} = request.params;
//         // let { captainId, teamId } = request.body;
//         console.log("TEAM captain : "+ teamId)
//         const result = await Team.find({ $or: [{ captainId: teamId }, { _id: teamId }] })
//             .populate("captainId", "name")
//             .populate("players");
        
//         if (result.length>0) {
//             console.log("Result : "+result);
//             return response.status(200).json({ team: result });
//         }

//         return response.status(404).json({ error: "Team not found" });
//     } catch (err) {
//         console.error(err);
//         return response.status(500).json({ error: "internal server error" });
//     }
// };
export const getTeam = async (request, response, next) => {
  try {
      let teamId = request.params.teamId;
      const result = await Team.findOne({ _id: teamId })
          .populate("captainId", "name")
          .populate("players");

      console.log(result);

      if (result) {
          return response.status(200).json({ Team: result });
      }

      return response.status(404).json({ error: "Team not found" });
  } catch (err) {
      console.error(err);
      return response.status(500).json({ error: "internal server error" });
    }
};


// -----------------find the player not part of any team-----------------------------

export const withoutTeam = async (request, response, next) => {
    try {

        const teams = await Team.find({}, "players");
        const playersInTeams = teams.reduce((acc, team) => {
            acc.push(...team.players);
            return acc;
        }, []);

        const playersWithoutTeam = await User.find({
            _id: { $nin: playersInTeams, }, role: "player"
        });

        return response.status(200).json(playersWithoutTeam);
    } catch (error) {
        console.error("Error fetching players without a team:", error);
        return response.status(500).json({ message: "Internal Server Error" });
    }
}
//================================================================

export const addtoTeamReq = async (req, res, next) => {
  try {
    const { playerId, teamId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(playerId) || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    const player = await User.findById(playerId);
    const team = await Team.findById(teamId);

    if (!player) {
      return res.status(404).json({ message: "Player not found. Please check the player ID." });
    }

    if (!team) {
      return res.status(404).json({ message: "Team not found. Please check the team ID." });
    }

    if (team.players.includes(playerId)) {
      return res.status(400).json({ message: "Player is already part of the team." });
    }

    const captainId = team.captainId;
    const captain = await User.findById(captainId);

    const notificationForCaptain = {
      type: "received",
      senderId: playerId,
      receiverId:captainId,
      message: `${player.name} has requested to join your team ${team.teamName}.`,
    };

    const notificationForPlayer = {
      type: "sent",
      senderId:playerId,
      receiverId: captainId,
      message: `Your request to join team ${team.teamName} has been sent to the captain.`,
    };

    captain.notifications.push(notificationForCaptain);
    await captain.save();

    player.notifications.push(notificationForPlayer);
    await player.save();

    return res.status(200).json({
      message: `Request to join team ${team.teamName} has been sent successfully.`,
      teamId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Server error", error });
  }
};
//===========================================================================

export const getNotification = async (req, res, next) => {
  let {userId} = req.params;
  try{
    const user = await User.findById(userId).populate([
      { path: "notifications.receiverId", select: "name email" },
      { path: "notifications.senderId", select: "name email" },
  ])
   console.log(user)
      if(!user)
          console.log("no user exist");
      if(!user.notifications){

          return res.status(200).json({message : "Not Notification Yet"})
      }
          // console.log("notices : "+ user.notifications)
      return res.status(200).json({message : user.notifications})
  }catch(error){
      return res.status(500).json({error : "Internal Server Error",error})
}
}
//=============================================================================
export const reqacceptBYCaptin = async (req, res, next) => {
  try {
      const { status, playerId, teamId } = req.body;

      // Find player and team
      const player = await User.findById(playerId);
      const team = await Team.findById(teamId);
      console.log("idss n: "+playerId +" "+player +" "+ team)
      const captainId = team.captainId;

      if (!player) {
          console.log("Player not found");
          return res.status(404).json({ message: "Player not found" });
      }

      if (!team) {
          console.log("Team not found");
          return res.status(404).json({ message: "Team not found" });
      }

      const captain = await User.findById(captainId);

      if (!captain) {
          console.log("Captain not found");
          return res.status(404).json({ message: "Captain not found" });
      }

      // Add debugging logs to check notifications
      console.log("Player Notifications Before Update: ", player.notifications);
      console.log("Captain Notifications Before Update: ", captain.notifications);

      // Ensure notifications are arrays
      player.notifications = player.notifications || [];
      captain.notifications = captain.notifications || [];

      // Find pending notification for player
      const pendingNotification = player.notifications.find(
          (notif) => notif.status === "pending"
      );

      if (!pendingNotification) {
          console.log("No pending notification found for player");
          return res.status(404).json({ message: "No pending notification found" });
      }

      // Update player notification
      pendingNotification.status = status;
      pendingNotification.message = `Player's request to join the team is ${status}`;

      // Find captain's notification (for captain)
      const captainNotification = captain.notifications.find(
          (notif) => notif.senderId && notif.senderId.toString() === playerId.toString() && notif.status === "pending"
      );

      if (!captainNotification) {
          console.log("No pending notification found for captain");
          return res.status(404).json({ message: "No pending notification found for captain" });
      }

      // Update captain's notification
      captainNotification.status = status;
      captainNotification.message = `Player's request to join your team has been ${status}`;

      // Save player and captain
      await player.save();
      await captain.save();

      // Debugging logs after update
      console.log("Player Notifications After Update: ", player.notifications);
      console.log("Captain Notifications After Update: ", captain.notifications);

      // Add player to team if accepted
      if (status === "accepted") {
          team.players.push(playerId);
          await team.save();
      }

      return res
          .status(200)
          .json({ message: `Player request has been ${status} `});
  } catch (error) {
      console.error("Error in accepting request:", error);
      return res.status(500).json({ message: "Server error", error });
  }
};

//=========================Get Team By user ID========================================

export const getTeamByUser = async (request, response, next) => {
    try {
        let {id} = request.body;
        console.log("userId : "+ id);
        const result = await Team.find({ $or: [{ captainId: id }, { players: id }] })
            .populate("captainId", "name")
            .populate("players");
  
        console.log("Result by user :"+result);
  
        if (result) {
            return response.status(200).json({ message: result });
        }
  
        return response.status(404).json({ error: "Team not found" });
    } catch (err) {
        console.error(err);
        return response.status(500).json({ error: "internal server error" });
      }
  };