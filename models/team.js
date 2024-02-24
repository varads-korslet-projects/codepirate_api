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
    },
    Members: [{
        Id: {
            type: ObjectId,
            ref: "Member",
        },
    }]
},
{timestamps:true}
);

module.exports = mongoose.model('Team', teamSchema)