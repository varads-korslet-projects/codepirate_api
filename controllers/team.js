var mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt')

const Team = require('../models/team')
const Member = require('../models/member');

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
        memberids = []
        leader = await Member.findOne({email: req.member.email})
        memberids.push(leader._id.toString())
        member2 = await Member.findOne({email: member2Email})
        memberids.push(member2._id.toString())
        if(!member2){
            return res.status(400).json({error:"Please create second member's accounts first"})
        }
        teamEntry = {
            name,
            leader: leader._id,
            member2: member2._id
        }
        if(req.body.member3Email){
            member3 = await Member.findOne({email: req.body.member3Email})
            if(member3){
                teamEntry.member3 = member3._id
                memberids.push(member3._id.toString())
            } else{
                return res.status(400).json({error:"Please create third member's accounts first"})
            }
        }
        if(req.body.member4Email){
            member4 = await Member.findOne({email: req.body.member4Email})
            if(member4){
                teamEntry.member4 = member4._id
                memberids.push(member4._id.toString())
            } else {
                return res.status(400).json({error:"Please create fourth member's accounts first"})
            }
        }
        for (const id of memberids) {
            clashingTeam = await Team.findOne({
                $or: [
                    { leader: id },
                    { member2: id },
                    { member3: id },
                    { member4: id },
                ],
            });
            if(clashingTeam){
                clashingMember = await Member.findOne({_id:id})
                return res.status(409).json({message: "Member already in team", clashingMember, clashingTeam})
            }
        }
        console.log(teamEntry)
        const result = await Team.create(teamEntry)
        return res.status(201).json(result)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.getTeam = async (req, res) => {
    try {
        const member = await Member.findOne({ email: req.member.email });

        const team = await Team.findOne({
            $or: [
                { leader: member._id },
                { member2: member._id },
                { member3: member._id },
                { member4: member._id },
            ],
        });

        if (!team) {
            return res.status(404).json({ status: "Member not in any team" });
        } else {
            return res.status(200).json(team);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

exports.updateTeam = async(req,res) => {
    teamData = req.body
    teamLeader = await Member.findOne({email: req.member.email})
    try{
        team = await Team.findOne({leader: teamLeader._id})
        memberids = []
        memberids.push(teamLeader._id.toString())
        if(!team){
            return res.status(403).json({message: "Only allowed to team leaders"})
        }
        member2 = await Member.findOne({email:teamData.member2Email})
        if(member2){
            teamData.member2 = member2._id;
            memberids.push(member2._id.toString())
        } else {
            return res.status(404).json({error: "Member 2 hasn't registered"})
        }
        if(teamData.member3Email){
            member3 = await Member.findOne({email:teamData.member3Email})
            if(member3){
                teamData.member3 = member3._id;
                memberids.push(member3._id.toString())
            } else {
                return res.status(404).json({error: "Member 3 hasn't registered"})
            }
        }
        if(teamData.member4Email){
            member4 = await Member.findOne({email:teamData.member4Email})
            if(member4){
                teamData.member4 = member4._id;
                memberids.push(member4._id.toString())
            } else {
                return res.status(404).json({error: "Member 4 hasn't registered"})
            }
        }
        for (const id of memberids) {
            clashingTeam = await Team.findOne({
                $or: [
                    { leader: id },
                    { member2: id },
                    { member3: id },
                    { member4: id },
                ],
            });
            if(clashingTeam){
                clashingMember = await Member.findOne({_id:id})
                return res.status(409).json({message: "Member already in team", clashingMember, clashingTeam})
            }
        }
        team.set(teamData);
        result = await team.save()
        console.log(teamData)
        return res.status(200).json(result)
    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.login = async(req,res) => {
    const {emailId, password} = req.body;
    if(!emailId || !password){
        console.log(req.body, emailId, password)
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
            return res.status(200).json({success: "Login successful", token});
        }
        else{
            return res.status(401).json({error: "Wrong Id or Password"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

exports.createMember = async(req,res) => {
    const {name, email, phone, collegeName, password} = req.body;
    if(!name||!email||!phone||!collegeName||!password){
        return res.status(400).json({error: "Bad request"})
    }
    try{
        hashed_password = bcrypt.hashSync(password, 10);
        memberEntry = {
            name,
            email,
            phone,
            collegeName,
            password: hashed_password
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
        return res.status(500).json({ error: error.message });
    }
}

exports.leaveTeam = async(req,res) => {
    member = await Member.findOne({email: req.member.email})
    try{
        const team = await Team.findOne({
            $or: [
                { leader: member._id },
                { member2: member._id },
                { member3: member._id },
                { member4: member._id },
            ],
        });
        if (!team) {
            return res.status(404).json({ status: "Member not in any team" });
        }
        const roles = ["leader", "member2", "member3", "member4"];
        const role = roles.find(r => team[r]?.equals(member._id));
        if (role) {
            // Set the role field to undefined
            team.set(role, undefined);
            // Save the changes to the database
            await team.save();
        } else {
            return res.status(404).json({ status: "Member not found in any role" });
        }
        return res.status(200).json({ status: "Successfully left the team", team});
    } catch(error){
        console.log(error)
        return res.status(500).json(error.message)
    }
}

exports.deleteTeam = async(req, res) => {
    teamLeader = await Member.findOne({email: req.member.email})
    try{
        team = await Team.findOne({leader: teamLeader._id})
        if(!team){
            return res.status(403).json({message: "Only allowed to team leaders"})
        }
        const deleted = await Team.deleteOne({ _id: team._id });
        return res.status(200).json({ message: "Team deleted successfully", deleted});
    } catch(error){
        console.log(error)
        return res.status(500).json(error.message)
    }
}