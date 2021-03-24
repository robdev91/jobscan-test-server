module.exports = (sequelize, Sequelize) => {
  const Job = sequelize.define("jobs", {
    title: {
      type: Sequelize.STRING,
    },
    company: {
      type: Sequelize.STRING,
    },
  });

  return Job;
};