const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    hash_password: {
        type: String
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
        unique: true
    },
    member3:{
        type: ObjectId,
        ref: "Member",
        required: false,
        unique: true
    },
    member4:{
        type: ObjectId,
        ref: "Member",
        required: false,
        unique: true
    },
},
{timestamps:true}
);

module.exports = mongoose.model('Team', teamSchema)