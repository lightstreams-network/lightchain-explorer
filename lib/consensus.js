const got = require('got');
var _ = require('lodash');

let consensusConn;
let config = { tendermintAddr: 'http://localhost:26657' };

var getStatus = function() {
  return got.get(`${config.tendermintAddr}/dump_consensus_state`, { json: true, protocol: 'http:' })
    .then(response => {
      const { validators, last_validators } = response.body.result.round_state;
      const activeValidators = _.map(validators.validators, (validator) => {
        return validator.address
      });
      const allValidators = _.sortedUniq(_.merge(
        _.map(last_validators.validators, (validator) => {
          return validator.address
        }), activeValidators));

      return {
        active_validators: activeValidators,
        validators: allValidators
      }
    })
};

var getBlockStatus = function(height) {
  return Promise.all([
    got.get(`${config.tendermintAddr}/block`, { json: true, protocol: 'http:', query: { height } }),
    got.get(`${config.tendermintAddr}/validators`, { json: true, protocol: 'http:', query: { height } })
  ])
    .then(function(values) {
      const responseOne = values[0];
      const responseTwo = values[1];
      const proposer = _.get(responseOne, 'body.result.block_meta.header.proposer_address',
        '0000000000000000000000000000000000000000');

      const validators = _.map(
        _.get(responseTwo, 'body.result.validators', []), (validator) => validator.address
      );

      return {
        validators: validators,
        proposer: `0x${proposer}`
      }
    })
};

module.exports = () => {
  if (!_.isUndefined(consensusConn)) {
    return consensusConn;
  }

  try {
    var globalCfg = require('../config.json');
    console.log('config.json found.');
    _.extend(config, globalCfg);
  } catch ( error ) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.log('No config file found. Using default configuration... (config.example.json)');
    } else {
      console.error(error);
      process.exit(1);
    }
  }

  consensusConn = {
    isConnected: () => {
      return new Promise((resolve) => {
        got.get(`${config.tendermintAddr}/status`, { json: true, protocol: 'http:' })
          .then((resp) => {
            if ('body' in resp) {
              const network = _.get(resp.body, 'result.node_info.network');
              console.log(`Consensus connected:`, network);
              resolve(true);
            }
            resolve(false);
          })
          .catch((err) => {
            console.log(`Error:`, err);
            resolve(false);
          })
      })
    },
    getStatus,
    getBlockStatus
  };

  return consensusConn;
};