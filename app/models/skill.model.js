module.exports = (sequelize, Sequelize) => {
  const Skill = sequelize.define("skills", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  return Skill;
};