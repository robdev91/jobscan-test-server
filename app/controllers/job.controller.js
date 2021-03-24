const db = require("../models")
const Jobs = db.jobs
const Skills = db.skills
const JobSkills = db.job_skills

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
  const skills = req.body.skills.split(',').map(item => item.trim())

  const job = {
    id,
    title,
    company,
  }

  createJob(job, skills, req, res)
}

// Create a job
const createJob = (job, skills, req, res) => {
  Jobs.create(job)
    .then(data => createSkills(data.id, skills, req, res))
    .catch(err => {
      console.log(err)
      res.status(500).send({
        message: "Some error occurred while creating the Job."
      })
    })
}

// Create skills if not exist
const createSkills = (job_id, skills, req, res) => {
  const skill_arr = skills.map(skill => { return { name: skill } })
  if (skill_arr.length !== 0) {
    Skills.bulkCreate(skill_arr, { ignoreDuplicates: true })
      .then(_data => fetchSkillIds(job_id, skills, req, res))
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: "Some error occurred while creating the skills."
        })
      })
  } else {
    fetchSkillIds(job_id, skills, req, res)
  }
}

// Fetch skill ids
const fetchSkillIds = (job_id, skills, req, res) => {
  if (skills.length !== 0) {
    Skills.findAll({
      where: {
        name: skills
      }
    }).then(data => insertJobSkills(job_id, data, req, res))
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: "Some error occurred while fetching skill ids."
        })
      })
  } else {
    insertJobSkills(job_id, [], req, res)
  }
}

// Insert job_skills
const insertJobSkills = (job_id, skill_ids, req, res) => {
  const job_skills = skill_ids.map(skill => { return { job_id, skill_id: skill.id } })
  if (job_skills.length !== 0) {
    JobSkills.bulkCreate(job_skills, { ignoreDuplicates: true })
      .then(_data => {
        res.send({
          message: 'Successfully added the job with skills'
        })
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({
          message: "Some error occurred while creating the skills."
        })
      })
  } else {
    res.send({
      message: 'Successfully added the job with skills'
    })
  }
}