exports.bulkInsertSkill = (Skills, names = [], success, err) => {
  let skills = [];
  names.forEach(name => skills.push({name}));
  Skills.bulkCreate(skills)
    .then(success)
    .catch(err);
}