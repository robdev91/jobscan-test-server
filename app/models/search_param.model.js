module.exports = (sequelize, Sequelize) => {
  const SearchParams = sequelize.define('search_params', {
    search_id: {
      type: Sequelize.STRING,
    },
    skill_id: {
      type: Sequelize.STRING,
    },
    score: {
      type: Sequelize.INTEGER,
    },
  })

  return SearchParams
}