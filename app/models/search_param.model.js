module.exports = (sequelize, Sequelize) => {
  const SearchParams = sequelize.define('search_params', {
    search_id: {
      type: Sequelize.INTEGER,
    },
    skill_id: {
      type: Sequelize.INTEGER,
    },
    score: {
      type: Sequelize.INTEGER,
    },
  })

  return SearchParams
}