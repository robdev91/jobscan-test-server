module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("jobs", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: Sequelize.STRING
    },
    company: {
      type: Sequelize.STRING
    },
    skills: {
      type: Sequelize.STRING
    }
  });

  return Job;
};