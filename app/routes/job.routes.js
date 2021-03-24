const jobs = require("../controllers/job.controller.js")

const router = require("express").Router()

// Create a new Job
router.post("/", jobs.create)

module.exports = router