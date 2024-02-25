const express = require('express')

const router = express.Router()

//middlewares
const {authCheckTeam} = require("../middlewares/auth");

const {} = require('../controllers/member')

const {} = require('../controllers/team')

router.get("/team")
router.post("/createTeam")
router.post("/changeTeam")
router.post("/login")
