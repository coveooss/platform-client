const express = require('express');
const app = express()
const fields = require('./routes/fields.js');
const extensions = require('./routes/extensions.js');

/*-----------------------------------*\
 Fields API
\*-----------------------------------*/
app.get('/rest/organizations/:org/indexes/page/fields', (req, res) => {
  console.log('*********************');
  console.log('test');
  console.log('*********************');
  
  fields.getFields(req, res);
});

app.post('/rest/organizations/:org/indexes/fields/batch/create', (req, res) => {
  fields.createFields(req, res);
});

app.put('/rest/organizations/:org/indexes/fields/batch/update', (req, res) => {
  fields.updateFields(req, res);
});

app.delete('/rest/organizations/:org/indexes/fields/batch/delete', (req, res) => {
  fields.deleteFields(req, res);
});

/*-----------------------------------*\
 Extension API
\*-----------------------------------*/

app.get('/rest/organizations/:org/extensions', (req, res) => {
  extensions.getAllExtension(req, res);
});

app.get('/rest/organizations/:org/extensions/:extensionId', (req, res) => {
  extensions.getOneExtension(req, res);
});

/*-----------------------------------*\
 Root
\*-----------------------------------*/
app.post('/', (req, res) => {
  res.send('Mock API')
});

app.listen(3000, () => {
  console.log('Mock API listening on port 3000!')
})