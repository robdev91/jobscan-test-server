module.exports = (sequelize, Sequelize) => {
  const Skill = sequelize.define("skills", {
    name: {
      type: Sequelize.STRING,
    },
  });

  return Skill;
};