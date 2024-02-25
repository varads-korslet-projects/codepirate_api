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
    if(!emailId || !password){
        return res.status(400).json({error: "Bad request"})
    }
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
        res.status(500).json({ error: error.message });
    }
}

exports.createMember = async(req,res) => {
    const {name, email, phone, collegeName, password} = req.body;
    if(!name||!email||!phone||!collegeName||!password){
        return res.status(400).json({error: "Bad request"})
    }
    try{
        memberEntry = {
            name,
            email,
            phone,
            collegeName,
            password
        }
        const emailClash = await Member.findOne({email});
        const phoneClash = await Member.findOne({phone});
        if(emailClash||phoneClash){
            return res.status(409).json({error: "User exists in database"})
        }
        const result = await Member.create(memberEntry)
        return res.status(201).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.leaveTeam = async(req,res) => {}

exports.deleteTeam = as