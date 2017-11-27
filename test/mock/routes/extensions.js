const devExtensions = require('./../dev/extensions/extensions.json');
const prodExtensions = require('./../prod/extensions/extensions.json');

exports.getAllExtension = function(req, res) {
  let orgId = req.params.org;

  switch (orgId) {
    case 'dev':
      setTimeout((() => { res.send(devExtensions) }), 1000);
      break;
    case 'prod':
      setTimeout((() => { res.send(prodExtensions) }), 1000);
      break;
    default:
      res.status(404).send({ 'errorCode': 'ORGANIZATION_NOT_FOUND' });
      break;
  }
};

exports.getOneExtension = function(req, res) {
  let orgId = req.params.org;
  let extensionId = req.params.extensionId;
  res.status(204).send();
};

exports.createExtension = function(req, res) {
  let orgId = req.params.org;
  let extensionId = req.params.extensionId;
  res.status(204).send();
};

exports.updateExtension = function(req, res) {
  let orgId = req.params.org;
  let extensionId = req.params.extensionId;
  setTimeout((() => { res.status(204).send({}) }), 1000);
};

exports.deleteExtension = function(req, res) {
  let orgId = req.params.org;
  let extensionId = req.params.extensionId;
};