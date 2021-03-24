module.exports = app => {
  const jobRouter = require("./job.routes")

  app.use('/api/jobs', jobRouter)
}