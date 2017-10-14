const devField = require('./../dev/fields-page-1.json');
const devField2 = require('./../dev/fields-page-2.json');
const prodField = require('./../prod/fields.json');

exports.getFields = function(req, res) {
  if (req.query.page == 0) {
    res.send(devField)
  } else if (req.query.page == 1) {
    res.send(devField2)
  } else {
    res.send({
      "items": [],
      "totalPages": 0,
      "totalEntries": 0
    })
  }
};

exports.createFields = function(req, res) {};

exports.updateFields = function(req, res) {};

exports.deleteFields = function(req, res) {};