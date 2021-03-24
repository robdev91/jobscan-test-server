module.exports = (sequelize, Sequelize) => {
  const Skill = sequelize.define('skills', {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  })

  return Skill
}