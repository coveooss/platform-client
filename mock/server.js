const express = require('express');
const devField = require('./dev/fields.json');
const devField2 = require('./dev/fields2.json');
const devField0 = require('./dev/fields0.json');
const prodField = require('./prod/fields.json');
const app = express()

app.get('/rest/organizations/dev/indexes/page/fields', function(req, res) {
  if (req.query.page == 0) {
    res.send(devField)
  } else if (req.query.page == 1) {
    res.send(devField2)
  } else {
    res.send(devField0)
  }
});

app.get('/rest/organizations/prod/indexes/page/fields', function(req, res) {
  res.send(prodField)
});

app.get('/', function(req, res) {
  res.send('HELLO!')
});

app.listen(3000, function() {
  console.log('Mock API listening on port 3000!')
})