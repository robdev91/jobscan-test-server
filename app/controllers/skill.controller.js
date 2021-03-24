const db = require("../models");
const Skills = db.skills;

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
  insert_skill([req.body.name],
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

const insert_skill = (names = [], success, err) => {
  let skills = [];
  names.forEach(name => skills.push({name}));
  Skills.bulkCreate(skills)
    .then(success)
    .catch(err);
}