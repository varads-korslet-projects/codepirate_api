var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt')

const Team = require('../models/team')
const Member = require('../models/member');
const member = require('../models/member');

exports.createTeam = async(req,res) => {
    const {name, member2Email} = req.body;
    if(!name||!member2Email){
        return res.status(400).json({error: "Bad request"})
    }
    try{
        team = await Team.findOne({name})
        if(team){
            return res.status(409).json({error: "Team with that name already exists"})
        }
        leader = await Member.findOne({email: req.member.email})
        member2 = await Member.findOne({email: member2Email})
        if(!member2){
            return res.status(400).json({error:"Please create second member's accounts first"})
        }
        if(req.body.member3Email){
            member3 = await Member.findOne({email: req.body.member3Email})
            return res.status(400).json({error:"Please create third member's accounts first"})
        }
        if(req.body.member4Email){
            member4 = await Member.findOne({email: req.body.member4Email})
            return res.status(400).json({error:"Please create fourth member's accounts first"})
        }
        teamEntry = {
            name,
            leader: leader._id,
            member2: member2._id
        }
        if(member3){
            teamEntry.member3 = member3._id
        }
        if(member4){
            teamEntry.member4 = member4._id
        }
        console.log(teamEntry)
        const result = await Team.create(teamEntry)
        return res.status(201).json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.getTeam = async(req,res) => {
    try{
        member = await Member.findOne({email: request.member.email})
        team = await Team.findOne({leader: member._id})
        if(!team){
            team = await Team.findOne({member2: member._id})
        }
        if(!team){
            team = await Team.findOne({member3: member._id})
        }
        if(!team){
            team = await Team.findOne({member4: member._id})
        }
        if(!team){
            return res.status(404).json({status:"Member not in any team"})
        } else {
            return res.status(201).json(team)
        }
    } catch(error){
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateTeam = async(req,res) => {}

exports.login = async(req,res) => {
    const {emailId, password} = req.body;
    if(!emailId || !password){
        return res.status(400).json({error: "Bad request"})
    }
    try{
        const member = await Member.findOne({email:emailId});
        if(!member){
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
            return res.status(409).json({error: "User already exists in database"})
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