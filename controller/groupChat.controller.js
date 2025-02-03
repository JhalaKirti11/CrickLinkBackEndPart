import {Group} from "../model/groupChat.model.js";
import { User } from "../model/user.model.js";


export const createGroup = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log("User Id : "+ userId)
        const { groupName, players, description } = req.body;

        req.body.captainId = userId;
        console.log("Captan ID : "+ req.body.captainId);
        const checkGroup = await Group.findOne({ groupName });
        if (!checkGroup) {
            const group = await Group.create(req.body);
            console.log("Group data : " + group);
            return res.status(201).json({ message: "Group created successfully" });
        } else {
            return res.status(401).json({ error: "Group can not be created!" })
        }
    } catch (error) {
        console.log("error : " + error);
        return res.status(501).json({ error: "Internal server error!", error });
    }
}
//========================================================================

export const viewGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        console.log("view group by groupId : " + groupId)
        const group = await Group.findById({_id:groupId})
            .populate("captainId", "name")
            .populate("players");

        if (group) {
            return res.status(201).json({ message: group });
        } else {
            return res.status(201).json({ message: "Group not found" });
        }
    } catch (error) {
        console.log("error : " + error);
        return res.status(501).json({ error: "Internal server error!" });
    }
}


export const joinGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { playerId } = req.body;
        console.log("gids : " + groupId + " pid : " + playerId);
        const group = await Group.findById({ _id: groupId });
        if (group) {
            group.players.push(playerId);
            await group.save();
            res.status(201).json({ message: `Player Added to the group ${group.groupName}` });
        } else {
            res.status(401).json({ message: 'Player not added to the team-chat' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//===================================================================

export const getGroupByUserId = async (req, res, next)=>{
    try{
        const {userId} = req.params;
        const groups = await Group.find({ $or: [{ captainId: userId }, { players: userId }] })
        .populate('captainId', 'name profile_picture')  // Populate the creator's details
        .populate('players', 'name profile_picture')
        .populate('messages');
  
      // If no groups are found
      if (!groups || groups.length === 0) {
        return res.status(404).json({ message: 'No groups found for this user.' });
      }
  
      // Return the groups
      return res.status(200).json({ groups });
      
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}


//=========================================================================

export const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { groupName, description } = req.body;
  
    try {
      const group = await Group.findById({_id: groupId});
  
      // Authorization check: Make sure the user is the creator or admin
      if (group.captainId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized: You are not the creator of this group" });
      }
  
      const updatedGroup = await Group.findByIdAndUpdate({_id:groupId}, { groupName, description }, { new: true });
      if (!updatedGroup) {
        return res.status(404).json({ message: 'Group not found' });
      }
      res.json(updatedGroup);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

//===================================== Message Send =============================================================

export const sendMessages = async (req, res, next)=>{
    try{
        const { userId }= req.params;
        const { groupId, message} = req.body;

        const group = await Group.findOne({_id: groupId});
        console.log("Group data : "+ group);

        let currentDate = Date.now();
        currentDate = new Date(currentDate);
        console.log("currentDate : " + currentDate);
       
        const createdMessage = group.messages.push({
            senderId: userId,
            groupId: groupId,
            message:message,
            sendDate: currentDate
        });

        // captain.messages.push(createMessage);
        await group.save();
        res.status(201).json({ message: 'Message sent', data: createdMessage });

    }catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}

//================================== View All Message ======================================

export const ViewAllMessages = async (req, res, next)=>{
    try{
        const {groupId} = req.params;
       
            const group = await Group.findById({_id:groupId}).populate([
              { path: "messages.groupId", select: "groupName" },
              { path: "messages.senderId", select: "name" },
          ]);
          console.log("Group Messages : "+group.messages);
          res.status(200).json({ data : group.messages });

    }catch (err) {
      console.log(err.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
}