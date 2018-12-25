const Web3 = require("web3");
const _ = require('lodash');

let web3conn;

let config = { nodeAddr: 'localhost', gethPort: 8545 };

module.exports = () => {
  if (!_.isUndefined(web3conn)) {
    if (web3conn.isConnected()) {
      console.log("Web3 connection established");
      return web3conn;
    }
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
    web3conn = new Web3(web3.currentProvider);
  } else {
    web3conn = new Web3(new Web3.providers.HttpProvider('http://' + config.nodeAddr + ':' + config.gethPort));
  }

  if (web3conn.version.node.split('/')[0].toLowerCase().includes('parity')) {
    web3conn = require("./trace.js")(web3conn);
  }

  return web3conn;
};