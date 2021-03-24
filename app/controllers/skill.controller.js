const db = require('../models')

const Skills = db.skills

// Create and Save a new Job
exports.findAll = (res) => {
  Skills.findAll()
    .then(data => res.send({ data }))
    .catch(err => res.send({ message: err.message }))
}
