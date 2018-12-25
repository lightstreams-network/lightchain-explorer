/**
 * User: ggarrido
 * Copyright 2018 (c) Lightstreams, Palma
 */
var _ = require('lodash');
var got = require('got');

/*Start config for node connection and sync*/
// load config.json
var config = { tendermintAddr: 'http://localhost:26657' };

try {
  var local = require('../config.json');
  _.extend(config, local);
  console.log('config.json found.');
} catch ( error ) {
  if (error.code === 'MODULE_NOT_FOUND') {
    var local = require('../config.json');
    _.extend(config, local);
    console.log('No config file found. Using default configuration... (config.example.json)');
  } else {
    throw error;
    process.exit(1);
  }
}

module.exports.route = function(req, res) {
  if (! "action" in req.body) {
    console.error("Invalid Request: Missing action");
    res.status(400).send();
    return;
  }

  switch(req.body.action) {
    case 'status':
      getStatus({}, res);
      break;
    default:
      console.error("Invalid Request: " + req.body.action);
      res.status(400).send();
      return;
  }
};

var getStatus = function({}, res) {
  got.get(`${config.tendermintAddr}/dump_consensus_state`, { json: true, protocol:'http:' })
    .then(response => {
      const { validators, last_validators } = response.body.result.round_state;
      const activeValidators = _.map(validators.validators, (validator) => {
        return validator.address
      });
      const allValidators = _.sortedUniq(_.merge(
        _.map(last_validators.validators, (validator) => {
          return validator.address
        }), activeValidators));

      res.write(JSON.stringify({
        active_validators: activeValidators,
        validators: allValidators
      }));
      res.end();
    }).catch((e) => {
      console.error(`Got error: ${e.message}`);
      res.write(JSON.stringify({ "error": e.message }));
      res.status(500).send();
    });
};
