const express = require('express')

const router = express.Router()

//middlewares
const {authCheckMember} = require("../middlewares/auth");

const { login, leaveGroup, updateMembers, createTeam, getTeam, deleteTeam } = require('../controllers/team')

router.get("/team",authCheckMember, getTeam)
router.post("/createTeam",authCheckMember, createTeam)
router.post("/changeTeam",authCheckMember, updateMembers)
router.delete("/deleteTeam",authCheckMember, deleteTeam)
router.post("/login", login)
router.post("/leaveTeam",authCheckMember, leaveGroup)