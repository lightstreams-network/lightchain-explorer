const Web3 = require("web3");
const web3extend = require('./web3-extend');

const _ = require('lodash');

let web3;
let config = { nodeAddr: 'localhost', gethPort: 8545 };

module.exports = () => {
  if (!_.isUndefined(web3) && web3.isConnected()) {
    return web3;
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

  console.log('Connecting ' + config.nodeAddr + ':' + config.gethPort + '...');
  if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
  } else {
    try {
      web3 = new Web3(new Web3.providers.HttpProvider('http://' + config.nodeAddr + ':' + config.gethPort));
    } catch(err) {
      console.log(`Error: ${err.message}`);
    }
  }

  if (_.isUndefined(web3) || !web3.isConnected()) {
    console.log('Not connected yet');
    return null;
  }

  if (_.get(web3, 'version.node', '').split('/')[0].toLowerCase().includes('parity')) {
    web3extend(web3, {parity:true});
  }

  web3extend(web3, { debug: true });

  console.log("Web3 connection established");
  return web3;
};