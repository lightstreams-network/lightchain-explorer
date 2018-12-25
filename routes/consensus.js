/**
 * User: ggarrido
 * Copyright 2018 (c) Lightstreams, Palma
 */
var _ = require('lodash');

var consensus = require('../lib/consensus')();

if (consensus.isConnected())
  console.log("Web3 connection established");
else
  throw "No connection, please specify web3host in conf.json";

module.exports.route = function(req, res) {
  if (! 'action' in req.body) {
    console.error("Invalid Request: Missing action");
    res.status(400).send();
    return;
  }

  switch(req.body.action) {
    case 'status':
      consensus.getStatus()
        .then(resp => {
          res.write(JSON.stringify(resp));
          res.end();
        })
        .catch((e) => {
          console.error(`Got error: ${e.message}`);
          res.write(JSON.stringify({ "error": e.message }));
          res.status(500).send();
        });
      break;
    case 'block-status':
      if (! 'height' in req.body) {
        console.error("Invalid Request: Missing height");
        res.status(400).send();
        return;
      }
      consensus.getBlockStatus(req.body.height)
        .then(resp => {
          res.write(JSON.stringify(resp));
          res.end();
        })
        .catch((e) => {
          console.error(`Got error: ${e.message}`);
          res.write(JSON.stringify({ "error": e.message }));
          res.status(500).send();
        });
      break;
    default:
      console.error("Invalid Request: " + req.body.action);
      res.status(400).send();
      return;
  }
};
