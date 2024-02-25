var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt')

const Team = require('../models/team')
const Member = require('../models/member')

exports.createTeam = async(req,res) => {}

exports.getTeam = async(req,res) => {}

exports.updateTeam = async(req,res) => {}

exports.login = async(req,res) => {
    const {emailId, password} = req.body;
    try{
        const member = await Member.findOne({email:emailId});
        if(!student){
            return res.status(404).json({error: "Email ID does not exist!"});
        }
        const match = await bcrypt.compare(password, member.password)
        if(match){
            const token = jwt.sign({ email: member.email, role: "member" },  process.env.signingkey, { expiresIn: '1d' })
            res.status(201).json({success: "Login successful", token});
        }
        else{
            res.status(401).json({error: "Wrong Id or Password"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
}

exports.leaveTeam = async(req,res) => {}

exports.deleteTeam = as