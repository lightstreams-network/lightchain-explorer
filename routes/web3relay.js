#!/usr/bin/env node

/*
    Endpoint for client to talk to etc node
*/


var _ = require('lodash');
var BigNumber = require('bignumber.js');
var etherUnits = require(__lib + "etherUnits.js");

var filterBlocks = require('./filters').filterBlocks;
var filterTrace = require('./filters').filterTrace;

var Web3 = require('../lib/web3');
var web3;

exports.data = function(req, res){
  web3 = Web3();
  if (!web3.isConnected())
    throw "No connection, please specify web3host in conf.json";

  if ("tx" in req.body) {
    web3getTx({
      txHash: req.body.tx.toLowerCase()
    }, res)
  } else if ("tx_trace" in req.body) {
    web3getTxTrace({
      txHash: req.body.tx_trace.toLowerCase()
    }, res)
  } else if ("addr_trace" in req.body) {
    web3getAddrTrace({
      addr: req.body.addr_trace.toLowerCase()
    }, res)
  } else if ("addr" in req.body) {
    web3getAddr({
      addr: req.body.addr.toLowerCase(),
      options: req.body.options
    }, res)
  } else if ("block" in req.body) {
    var blockNumOrHash;
    if (/^(0x)?[0-9a-f]{64}$/i.test(req.body.block.trim())) {
        blockNumOrHash = req.body.block.toLowerCase();
    } else {
        blockNumOrHash = parseInt(req.body.block);
    }
    web3getBlock({blockNumOrHash}, res);
  } else if ("action" in req.body) {
    if (req.body.action === 'blockrate') {
      web3getBlockrate({}, res)
    } else {
      console.error("Invalid Request: " + action)
      res.status(400).send();
    }
  } else {
    console.error("Invalid Request: " + action)
    res.status(400).send();
  }
};

var web3getTx = function({ txHash }, res) {
  web3.eth.getTransaction(txHash, function(err, tx) {
    if (err || !tx) {
      console.error("TxWeb3 error :" + err)
      if (!tx) {
        web3.eth.getBlock(txHash, function(err, block) {
          if (err || !block) {
            console.error("BlockWeb3 error :" + err)
            res.write(JSON.stringify({ "error": true }));
          } else {
            console.log("BlockWeb3 found: " + txHash)
            res.write(JSON.stringify({ "error": true, "isBlock": true }));
          }
          res.end();
        });
      } else {
        res.write(JSON.stringify({ "error": true }));
        res.end();
      }
    } else {
      var ttx = tx;
      ttx.value = etherUnits.toEther(new BigNumber(tx.value), "wei");
      //get timestamp from block
      var block = web3.eth.getBlock(tx.blockNumber, function(err, block) {
        if (!err && block)
          ttx.timestamp = block.timestamp;
        ttx.isTrace = (ttx.input != "0x");
        res.write(JSON.stringify(ttx));
        res.end();
      });
    }
  });
}

var web3getTxTrace = function({ txHash }, res) {
  if(_.isUndefined(web3.trace)) {
    res.write(JSON.stringify({ "error": true }));
    res.end();
    return;
  }

  web3.trace.transaction(txHash, function(err, tx) {
    if (err || !tx) {
      console.error("TraceWeb3 error :" + err)
      res.write(JSON.stringify({ "error": true }));
    } else {
      res.write(JSON.stringify(filterTrace(tx)));
    }
    res.end();
  });
};

var web3getAddrTrace = function({ addr }, res) {
  if (_.isUndefined(web3.trace)) {
    res.write(JSON.stringify({ "error": true }));
    res.end();
    return;
  }

  // need to filter both to and from
  // from block to end block, paging "toAddress":[addr],
  // start from creation block to speed things up
  // TODO: store creation block
  var filter = { "fromBlock": "0x1d4c00", "toAddress": [addr] };
  web3.trace.filter(filter, function(err, tx) {
    if (err || !tx) {
      console.error("TraceWeb3 error :" + err)
      res.write(JSON.stringify({ "error": true }));
    } else {
      res.write(JSON.stringify(filterTrace(tx)));
    }
    res.end();
  })
};

var web3getAddr = function({ addr, options}, res) {
  var addrData = {};

  if (options.indexOf("balance") > -1) {
    try {
      addrData["balance"] = web3.eth.getBalance(addr);
      addrData["balance"] = etherUnits.toEther(addrData["balance"], 'wei');
    } catch ( err ) {
      console.error("AddrWeb3 error :" + err);
      addrData = { "error": true };
    }
  }
  if (options.indexOf("count") > -1) {
    try {
      addrData["count"] = web3.eth.getTransactionCount(addr);
    } catch ( err ) {
      console.error("AddrWeb3 error :" + err);
      addrData = { "error": true };
    }
  }
  if (options.indexOf("bytecode") > -1) {
    try {
      addrData["bytecode"] = web3.eth.getCode(addr);
      if (addrData["bytecode"].length > 2)
        addrData["isContract"] = true;
      else
        addrData["isContract"] = false;
    } catch ( err ) {
      console.error("AddrWeb3 error :" + err);
      addrData = { "error": true };
    }
  }

  res.write(JSON.stringify(addrData));
  res.end();
}

var web3getBlock = function({ blockNumOrHash }, res) {
  web3.eth.getBlock(blockNumOrHash, function(err, block) {
    if (err || !block) {
      console.error("BlockWeb3 error :" + err)
      res.write(JSON.stringify({ "error": true }));
    } else {
      res.write(JSON.stringify(filterBlocks(block)));
    }
    res.end();
  });
}

var web3getBlockrate = function({ }, res) {
  web3.eth.getBlock('latest', function(err, latest) {
    if (err || !latest) {
      console.error("StatsWeb3 error :" + err);
      res.write(JSON.stringify({ "error": true }));
      res.end();
    } else {
      console.log("StatsWeb3: latest block: " + latest.number);
      var checknum = latest.number - 100;
      if (checknum < 0)
        checknum = 0;
      var nblock = latest.number - checknum;
      web3.eth.getBlock(checknum, function(err, block) {
        if (err || !block) {
          console.error("StatsWeb3 error :" + err);
          res.write(JSON.stringify({
            "blockTime": 0,
            "hashrate": 0
          }));
        } else {
          console.log("StatsWeb3: check block: " + block.number);
          var blocktime = (latest.timestamp - block.timestamp) / nblock;
          res.set('Content-Type', 'application/json');
          res.write(JSON.stringify({
            "blockHeight": latest.number,
            "blockTime": blocktime,
          }));
        }
        res.end();
      });
    }
  });
};