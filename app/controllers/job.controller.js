const db = require('../models')

const Jobs = db.jobs
const Skills = db.skills
const JobSkills = db.job_skills
const Searches = db.searches
const SearchParams = db.searchParams

const Op = db.Sequelize.Op
const QueryTypes = db.Sequelize.QueryTypes

// Create and Save a new Job
exports.create = (req, res) => {
  // Validate request
  if (!req.body.id || !req.body.title || !req.body.company || !req.body.skills) {
    res.status(400).send({
      message: 'Content can not be empty!'
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
      res.status(500).send({ message })
    } else {
      res.send({ message })
    }
  })
}

// find jobs
exports.findSome = (req, res) => {
  // Validate request
  if (!req.query.skills || !req.query.scores) {
    res.status(400).send({
      message: 'skills and scores are required'
    })
    return
  }
  const skills = req.query.skills.trim().split(',')
  const scores = req.query.scores.trim().split(',')
  if (skills.length !== scores.length || skills.length === 0) {
    res.status(400).send({
      message: 'skills and scores must have the same non-zero length.'
    })
    return
  }

  // build and sort skill_score
  let skill_scores = []
  for (let i = 0; i < skills.length; i++) {
    skill_scores.push({
      skill: skills[i],
      score: scores[i]
    })
  }
  skill_scores = skill_scores.sort((a, b) => a.skill - b.skill)
  const title = skill_scores.map(skill_score => skill_score.skill + ',' + skill_score.score).join(',')

  // get search id (if not exist, create it)
  getSearchId(title, (err, id) => {
    if (err) {
      createSearch(title, (err, id) => {
        if (err) {
          res.status(500).send({
            message: err.message
          })
        } else {
          createSearchParams(id, skill_scores, res, findJobs)
        }
      })
    } else {
      findJobs(null, id, res)
    }
  })
}

// find if the search already exists
const getSearchId = (title, cb) => {
  Searches.findAll({
    where: {
      title: [title]
    }
  })
    .then(data => {
      if (data.length > 0) {
        cb(null, data[0].id)
      } else {
        cb(Error('No data is returned'))
      }
    })
    .catch(err => {
      cb(err, -1)
    })
}

// create the search
const createSearch = (title, cb) => {
  Searches.create({ title })
    .then(data => cb(null, data.id))
    .catch(err => cb(err, 'Some error occurred while creating the Job.'))
}

// create search_params
const createSearchParams = (search_id, skill_scores, res, cb) => {
  const search_params = skill_scores.map(skill_score => { return { search_id, skill_id: skill_score.skill, score: skill_score.score } })
  SearchParams.bulkCreate(search_params, { ignoreDuplicates: true })
    .then(_data => cb(null, search_id, res))
    .catch(err => cb(err, 0, res))
}

// fetch jobs
const findJobs = (err, search_id, res) => {
  if (err) {
    res.status(500).send({
      message: err.message
    })
    return
  }
  db.sequelize.query(
    '\
    SELECT `a`.*, `b`.`score` FROM `jobs` `a` \
      INNER JOIN \
      (SELECT `job_skills`.`job_id`, SUM(`score`) as `score` FROM `job_skills` \
        INNER JOIN `search_params` \
        ON `job_skills`.`skill_id`=`search_params`.`skill_id` \
        WHERE `search_params`.`search_id`=' + search_id + ' GROUP BY `job_skills`.`job_id`) `b` \
      ON `a`.`id`=`b`.`job_id` ORDER BY `b`.`score` DESC'
  , { type: QueryTypes.SELECT })
    .then(data => {
      res.send({ jobs: data })
    })
    .catch(err => {
      res.send({
        message: err.message
      })
    })
}

// fill data from csv file
exports.fillMock = () => {
  const csv = require('csvtojson')
  const path = require('path')
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
      .catch(err => cb(err, 'Some error occurred while creating the job_skills.'))
  } else {
    cb(null, 'Successfully added the job with skills.')
  }
}