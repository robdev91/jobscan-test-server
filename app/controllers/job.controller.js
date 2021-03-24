const db = require("../models")
const Jobs = db.jobs
const Skills = db.skills

// Create and Save a new Job
exports.create = (req, res) => {
  // Validate request
  if (!req.body.id || !req.body.title || !req.body.company || !req.body.skills) {
    res.status(400).send({
      message: "Content can not be empty!"
    })
    return
  }

  const id = req.body.id
  const title = req.body.title
  const company = req.body.company
  const skills = req.body.skills.split(',')

  // Create a Job
  const job = {
    id,
    title,
    company,
  }

  // Save Job in the database
  createJob(job, (err, job_data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Job."
      })
    } else {
      // Save skills
      createSkills(skills, (err, skill_data) => {
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Job."
          })
        } else {
          res.status(200).send({
            job_data,
            skill_data
          })
        }
      })
    }
  })
}

const createJob = (job, callback) => {
  Jobs.create(job)
    .then(data => callback(null, data))
    .catch(err => callback(err))
}

const createSkills = (names = [], callback) => {
  let skills = []
  names.forEach(name => skills.push({name}))
  Skills.bulkCreate(skills)
    .then(data => callback(null, data))
    .catch(err => callback(err))
}