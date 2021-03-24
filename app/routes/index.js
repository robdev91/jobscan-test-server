module.exports = app => {
  const jobRouter = require("./job.routes");
  const skillRouter = require("./skill.routes");

  app.use('/api/jobs', jobRouter);
  app.use('/api/skills', skillRouter);
};