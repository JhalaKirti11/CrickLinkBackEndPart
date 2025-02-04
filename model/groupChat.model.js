import mongoose from 'mongoose';

// GroupMessage Schema
const groupMessage = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        sendDate: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

const group = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupMessage'
    }],
    description: {
        type: String
    },
}, { timestamps: true }
);

export const Group = mongoose.model('Group', group);
export default mongoose.model('GroupMessage', groupMessage);