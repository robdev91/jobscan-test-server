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
  const skills = req.body.skills

  const job = {
    id,
    title,
    company,
  }

  createJob(job, skills, (err, message) => {
    if (err) {
      console.log(err)
      res.status(500).send({ message })
    } else {
      res.send({ message })
    }
  })
}

exports.fillMock = () => {
  const csv = require('csvtojson')
  const path = require('path')
  console.log(__dirname)
  csv()
    .fromFile(path.join(__dirname, '..', '..', 'mock.csv'))
    .then(data => {
      const jobPromises = data.map(item => {
        const job = {
          id: item.job_posting_id,
          title: item.job_posting_title,
          company: item.job_posting_company,
        }
        const skills = item.skills
        return new Promise((resolve, reject) => createJob(job, skills, (err, _message) => {
          if (err) reject()
          else resolve()
        }))
      })
      Promise.allSettled(jobPromises).
        then((results) => results.forEach((result) => console.log(result.status)));
    })
}

// Create a job
const createJob = (job, skills, cb) => {
  Jobs.create(job)
    .then(data => createSkills(data.id, skills.split(',').map(item => item.trim()), cb))
    .catch(err => cb(err, 'Some error occurred while creating the Job.'))
}

// Create skills if not exist
const createSkills = (job_id, skills, cb) => {
  const skill_arr = skills.map(skill => { return { name: skill } })
  if (skill_arr.length !== 0) {
    Skills.bulkCreate(skill_arr, { ignoreDuplicates: true })
      .then(_data => fetchSkillIds(job_id, skills, cb))
      .catch(err => cb(err, 'Some error occurred while creating the skills.'))
  } else {
    fetchSkillIds(job_id, skills, cb)
  }
}

// Fetch skill ids
const fetchSkillIds = (job_id, skills, cb) => {
  if (skills.length !== 0) {
    Skills.findAll({
      where: {
        name: skills
      }
    }).then(data => insertJobSkills(job_id, data, cb))
      .catch(err => cb(err, 'Some error occurred while fetching skill ids.'))
  } else {
    insertJobSkills(job_id, [], cb)
  }
}

// Insert job_skills
const insertJobSkills = (job_id, skill_ids, cb) => {
  const job_skills = skill_ids.map(skill => { return { job_id, skill_id: skill.id } })
  if (job_skills.length !== 0) {
    JobSkills.bulkCreate(job_skills, { ignoreDuplicates: true })
      .then(_data => cb(null, 'Successfully added the job with skills.'))
      .catch(err => cb(err, 'Some error occurred while creating the skills.'))
  } else {
    cb(null, 'Successfully added the job with skills.')
  }
}