const skills = require('../controllers/skill.controller')

const router = require('express').Router()

// Create a new Job
router.get('/', skills.findAll)

module.exports = router