const jobs = require('../controllers/job.controller')

const router = require('express').Router()

// Create a new Job
router.post('/', jobs.create)

// Find jobs
router.get('/', jobs.findSome)

module.exports = router