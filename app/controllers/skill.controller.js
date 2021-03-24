const db = require('../models')

const Skills = db.skills

// Create and Save a new Job
exports.findAll = (_req, res) => {
  Skills.findAll()
    .then(data => res.send({ skills: data.map(skill => { return { id: skill.id, name: skill.name } }) }))
    .catch(err => res.send({ message: err.message }))
}
