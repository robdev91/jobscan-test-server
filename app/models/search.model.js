module.exports = (sequelize, Sequelize) => {
  const Search = sequelize.define('searches', {
    title: {
      type: Sequelize.STRING,
    },
  })

  return Search
}