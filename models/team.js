const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    leader:{
        type: ObjectId,
        ref: "Member",
        required: true,
        unique: true
    },
    member2:{
        type: ObjectId,
        ref: "Member",
        required: true,
    },
    member3:{
        type: ObjectId,
        ref: "Member",
        required: false,
    },
    member4:{
        type: ObjectId,
        ref: "Member",
        required: false,
    },
},
{timestamps:true}
);

module.exports = mongoose.model('Team', teamSchema)