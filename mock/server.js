const express = require('express');
const app = express()
const fields = require('./routes/fields.js');

/*-----------------------------------*\
 Fields API
\*-----------------------------------*/
app.get('/rest/organizations/:org/indexes/page/fields', function(req, res) {
  fields.getFields(req, res);
});

app.post('/rest/organizations/:org/indexes/page/fields/batch/create', function(req, res) {
  fields.createFields(req, res);
});

app.post('/rest/organizations/:org/indexes/page/fields/batch/update', function(req, res) {
  fields.updateFields(req, res);
});

app.listen(3000, function() {
  console.log('Mock API listening on port 3000!')
})