import GroupMessage,  { Group } from "../model/groupChat.model.js";
import { User } from "../model/user.model.js";

export const createGroup = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log("User Id : " + userId)
        const { groupName, members, description } = req.body;
        req.body.members = userId;
        const checkGroup = await Group.findOne({ groupName });
        if (!checkGroup) {
            const group = await Group.create(req.body);
            console.log("Group data : " + group);
            return res.status(201).json({ message: "Group created successfully", group : group });
        } else {
            return res.status(401).json({ error: `${groupName} is not available/already exist` })
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
        const group = await Group.findById({ _id: groupId })
            .populate("members", "name")
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

//==========================================================================================
export const addToGroup = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const { playerId } = req.body;
        if(!playerId){
            return res.status(201).json({message:"Invalid User"})
        }
        const group = await Group.findById({ _id: groupId });
        if (group) {
            group.members.push(playerId);
            await group.save();
            res.status(201).json({ message: `Player Added to the group ${group.groupName}` });
        } else {
            res.status(401).json({ message: 'Player not added to the team!' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

//===================================================================

export const getGroupByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const groups = await Group.findOne({ members: userId })
            .populate('members', 'name profile_picture')
            .populate('messages');
        if (!groups || groups.length === 0) {
            return res.status(404).json({ message: 'No groups found with this userId.' });
        }
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
        const group = await Group.findById({ _id: groupId });
        const updatedGroup = await Group.findByIdAndUpdate({ _id: groupId }, { groupName, description }, { new: true });
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        return res.status(201).json({message: updatedGroup});
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//===================================== Message Send ====================================

export const sendMessages = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { groupId, message } = req.body;
        const group = await Group.findOne({ _id: groupId });
        console.log("Group data : " + group);
        if(!group.members.includes(userId)){
            return res.status(403).json({ message: "You are not a member of this group" });
        }
        let currentDate = Date.now();
        currentDate = new Date(currentDate);
        console.log("currentDate : " + currentDate);
        const createdMessage = await GroupMessage.create({
            senderId: userId,
            groupId: groupId,
            message: message,
            sendDate: currentDate
        });
        return res.status(201).json({ message: 'Message sent', data: createdMessage });
    } catch (error) {
        console.log(err.message);
        return res.status(500).json({ error: 'Internal Server Error', error });
    }
}

//================================== View All Message ======================================

export const ViewAllMessages = async (req, res, next) => {
    try {
        const { groupId } = req.params;
        const group = await GroupMessage.find({ groupId: groupId })
        .populate("senderId", "name").sort({sendDate:1});
        console.log("Group Messages : " + group);
        return res.status(200).json({ data: group });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
