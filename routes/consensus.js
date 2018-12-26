/**
 * User: ggarrido
 * Copyright 2018 (c) Lightstreams, Palma
 */
var _ = require('lodash');

var Consensus = require('../lib/consensus');
var consensus;

module.exports.route = function(req, res) {
  var consensus = Consensus();
  if (!consensus.isConnected())
    throw "No connection, please specify web3host in conf.json";

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
    case 'validator':
      if (!'address' in req.body) {
        console.error("Invalid Request: Missing address");
        res.status(400).send();
        return;
      }
      const addr = _.startsWith(req.body.address, '0x')
        ? req.body.address.replace('0x', '')
        : req.body.address

      consensus.getValidator(addr)
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
