const express = require('express');
const devField = require('./dev/fields.json');
const prodField = require('./prod/fields.json');
const app = express()

app.get('/rest/organizations/dev/indexes/page/fields', function(req, res) {
  res.send(devField)
});

app.get('/rest/organizations/prod/indexes/page/fields', function(req, res) {
  res.send(prodField)
});

app.listen(3000, function() {
  console.log('Mock API listening on port 3000!')
})