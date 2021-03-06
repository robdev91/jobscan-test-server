
const Sequelize = require('sequelize')

const mode = process.env.ENVIRONMENT
const dialectOptions = ((mode === 'dev') ? {} : {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
})
const SQL = ((mode === 'dev') ? 'mysql' : 'postgres')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: SQL,
  protocol: SQL,
  dialectOptions
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.jobs = require('./job.model')(sequelize, Sequelize)
db.skills = require('./skill.model')(sequelize, Sequelize)
db.job_skills = require('./job_skill.model')(sequelize, Sequelize)
db.searches = require('./search.model')(sequelize, Sequelize)
db.searchParams = require('./search_param.model')(sequelize, Sequelize)

module.exports = db