const skills = require("../controllers/skill.controller.js")

const router = require("express").Router()

// Create a new Job
router.post("/", skills.create)

// Retrieve all Jobs
router.get("/", skills.findAll)

module.exports = router