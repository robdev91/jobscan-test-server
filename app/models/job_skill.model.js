module.exports = (sequelize, Sequelize) => {
  const Job_skill = sequelize.define("job_skills", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    job_id: {
      type: Sequelize.INTEGER,
    },
    skill_id: {
      type: Sequelize.STRING
    },
  });

  return Job_skill;
};