const db = require("../models");
const Skills = db.skills;
const helper = require('./helpers');

exports.findAll = (req, res) => {
  Skills.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving jobs."
      });
    });
}

exports.create = (req, res) => {
  helper.bulkInsertSkill([req.body.name],
    data => {
      res.send(data);
    },
    err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Job."
      });
    });
}
