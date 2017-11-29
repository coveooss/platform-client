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
      res.status(404).send({
        'message': `The organization '${orgId}' does not exist.`,
        'errorCode': 'ORGANIZATION_NOT_FOUND'
      });
      break;
  }
};

exports.getOneExtension = function(req, res) {
  let orgId = req.params.org;
  let extensionId = req.params.extensionId;
  if (orgId !== 'dev' && orgId != 'prod') {
    res.status(404).send({
      'message': `The organization '${orgId}' does not exist.`,
      'errorCode': 'ORGANIZATION_NOT_FOUND'
    });
  } else {
    try {
      let extension = require(`./../${orgId}/extensions/${extensionId}.json`);
      res.status(204).send(extension);
    } catch (error) {
      res.status(404).send({
        'message': `The extension '${extensionId}' of organization 'ccli1wq3fmkys' does not exist.`,
        'errorCode': 'EXTENSION_NOT_FOUND'
      });
    }
  }
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