const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  protocol: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.jobs = require("./job.model")(sequelize, Sequelize);
db.skills = require("./skill.model")(sequelize, Sequelize);
db.job_skills = require("./job_skill.model")(sequelize, Sequelize);

module.exports = db;