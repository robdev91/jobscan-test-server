module.exports = (sequelize, Sequelize) => {
  const Search = sequelize.define("searches", {
    title: {
      type: Sequelize.STRING,
    },
    skill: {
      type: Sequelize.STRING,
    },
    score: {
      type: Sequelize.INTEGER,
    },
  })

  return Search
}