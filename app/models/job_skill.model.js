module.exports = (sequelize, Sequelize) => {
  const Job_skill = sequelize.define('job_skills', {
    job_id: {
      type: Sequelize.INTEGER,
    },
    skill_id: {
      type: Sequelize.INTEGER,
    },
  })

  return Job_skill
}