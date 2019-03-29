var mongoose = require('mongoose');
var Promises = require('promise');

var Block = mongoose.model('Block');
var Transaction = mongoose.model('Transaction');
var filters = require('./filters');
var _ = require('lodash');
var async = require('async');

module.exports = function(app) {
  var web3relay = require('./web3relay');
  var consensus = require('./consensus');
  var Token = require('./token');

  /*
    Local DB: data request format
    { "address": "0x1234blah", "txin": true } 
    { "tx": "0x1234blah" }
    { "block": "1234" }
  */
  app.post('/addr', getAddr);
  app.post('/addr_count', getAddrCounter);
  app.post('/tx', getTx);
  app.post('/block', getBlock);
  app.post('/data', getData);

  app.post('/tokenrelay', Token);
  app.post('/web3relay', web3relay.data);
  app.post('/consensus', consensus.route);
}

var getAddr = function(req, res) {
  // TODO: validate addr and tx
  var addr = req.body.addr.toLowerCase();
  var count = parseInt(req.body.count);

  var limit = parseInt(req.body.length);
  var start = parseInt(req.body.start);

  var data = { draw: parseInt(req.body.draw), recordsFiltered: count, recordsTotal: count };

  var addrFind = Transaction.find({ $or: [{ "to": addr }, { "from": addr }] })

  var sortOrder = '-blockNumber';
  if (req.body.order && req.body.order[0] && req.body.order[0].column) {
    // date or blockNumber column
    if (req.body.order[0].column == 1 || req.body.order[0].column == 6) {
      if (req.body.order[0].dir == 'asc') {
        sortOrder = 'blockNumber';
      }
    }
  }

  addrFind.lean(true).sort(sortOrder).skip(start).limit(limit)
    .exec("find", function(err, docs) {
      if (docs)
        data.data = filters.filterTX(docs, addr);
      else
        data.data = [];
      res.write(JSON.stringify(data));
      res.end();
    });

};
var getAddrCounter = function(req, res) {
  var addr = req.body.addr.toLowerCase();
  var count = parseInt(req.body.count);
  var data = { recordsFiltered: count, recordsTotal: count };

  async.waterfall([
    function(callback) {

      Transaction.count({ $or: [{ "to": addr }, { "from": addr }] }, function(err, count) {
        if (!err && count) {
          // fix recordsTotal
          data.recordsTotal = count;
          data.recordsFiltered = count;
        }
        callback(null);
      });

    }], function(err) {
    res.write(JSON.stringify(data));
    res.end();
  });

};
var getBlock = function(req, res) {
  // TODO: support queries for block hash
  var txQuery = "number";
  var number = parseInt(req.body.block);

  var blockFind = Block.findOne({ number: number }).lean(true);
  blockFind.exec(function(err, doc) {
    if (err || !doc) {
      console.error("BlockFind error: " + err)
      console.error(req.body);
      res.write(JSON.stringify({ "error": true }));
    } else {
      var block = filters.filterBlocks([doc]);
      res.write(JSON.stringify(block[0]));
    }
    res.end();
  });
};

var getTxs = function({} , res) {
  Transaction.get()
}

var getTx = function(req, res) {
  var tx = req.body.tx.toLowerCase();
  var txFind = Block.findOne({ "transactions.hash": tx }, "transactions timestamp")
    .lean(true);
  txFind.exec(function(err, doc) {
    if (!doc) {
      console.log("missing: " + tx)
      res.write(JSON.stringify({}));
      res.end();
    } else {
      // filter transactions
      var txDocs = filters.filterBlock(doc, "hash", tx)
      res.write(JSON.stringify(txDocs));
      res.end();
    }
  });
};
/*
  Fetch data from DB
*/
var getData = function(req, res) {
  // TODO: error handling for invalid calls
  var action = req.body.action.toLowerCase();
  var limit = req.body.limit;

  if (action in DATA_ACTIONS) {
    if (isNaN(limit))
      var lim = MAX_ENTRIES;
    else
      var lim = parseInt(limit);
    DATA_ACTIONS[action](lim, res);
  } else {
    console.error("Invalid Request: " + action)
    res.status(400).send();
  }
};

/* 
  temporary blockstats here
*/
var latestBlock = function(req, res) {
  var block = Block.findOne({}, "totalDifficulty")
    .lean(true).sort('-number');
  block.exec(function(err, doc) {
    res.write(JSON.stringify(doc));
    res.end();
  });
}

var getLatest = function(lim, res, callback) {
  var blockFind = Block.find({}, "number transactions timestamp miner extraData")
    .lean(true).sort('-number').limit(lim);
  blockFind.exec(function(err, docs) {
    callback(docs, res);
  });
}

/* get blocks from db */
var sendBlocks = function(lim, res) {
  var blockFind = Block.find({}, "number timestamp miner extraData proposer validators")
    .lean(true).sort('-number').limit(lim);

  blockFind.exec(function(err, docs) {
    if (!err && docs) {
      var block = docs[docs.length - 1];
      if (_.isUndefined(block)) {
        console.log("block not found");
        res.write(JSON.stringify({ "error": true }));
        res.end();
        return
      }

      var blockNumber = docs[docs.length - 1].number;
      // aggregate transaction counters
      Transaction.aggregate([
        { $match: { blockNumber: { $gte: blockNumber } } },
        { $group: { _id: '$blockNumber', count: { $sum: 1 } } }
      ]).exec(function(err, results) {
        var txns = {};
        if (!err && results) {
          // set transaction counters
          results.forEach(function(txn) {
            txns[txn._id] = txn.count;
          });
          docs.forEach(function(doc) {
            doc.txn = txns[doc.number] || 0;
          });
        }
        res.write(JSON.stringify({ "blocks": filters.filterBlocks(docs) }));
        res.end();
      });
    } else {
      console.log("blockFind error:" + err);
      res.write(JSON.stringify({ "error": true }));
      res.end();
    }
  });
};

var sendTxs = function(lim, res) {
  Transaction.find({}).lean(true).sort('-blockNumber').limit(lim)
    .exec(function(err, txs) {
      res.write(JSON.stringify({ "txs": txs }));
      res.end();
    });
};

var TotalTxsCount = function(lim, res) {
  Transaction.count()
    .exec(function(err, count) {
      if (err) {
        console.error(err);
        totalTxs = 0;
      } else {
        totalTxs  = count;
      }

      res.write(JSON.stringify({
        "totalTxs": totalTxs,
      }));
      res.end();
    });
};

var CalculateTPS = function(lim, res) {
  Transaction.aggregate()
    .exec(function(err, count) {
      if (err) {
        console.error(err);
        totalTxs = 0;
      } else {
        totalTxs = count;
      }

      res.write(JSON.stringify({
        "totalTxs": totalTxs,
      }));
      res.end();
    });
};

var lastTxsCount = function(lim, res) {
  let oneDayInSec = 86400;
  let oneWeekInSec = oneDayInSec * 7;
  let oneMonthInSec = oneDayInSec * 30;
  let nowDateInSec = (new Date()).getTime() / 1000;

  let oneDayCount = new Promise(function(resolve) {
    Transaction.count({ timestamp: { $gte: nowDateInSec - oneDayInSec } })
      .exec(function(err, count) {
        if (err) {
          console.error(err);
          resolve(0)
        } else {
          resolve(count)
        }
      });
  });
  let oneWeekCount = new Promise(function(resolve) {
    Transaction.count({ timestamp: { $gte: nowDateInSec - oneWeekInSec } })
      .exec(function(err, count) {
        if (err) {
          console.error(err);
          resolve(0)
        } else {
          resolve(count)
        }
      });
  });
  let oneMonthCount = new Promise(function(resolve) {
    Transaction.count({ timestamp: { $gte: nowDateInSec - oneMonthInSec } })
      .exec(function(err, count) {
        if (err) {
          console.error(err);
          resolve(0)
        } else {
          resolve(count)
        }
      });
  });


  Promises.all([oneDayCount, oneWeekCount, oneMonthCount]).then(function(values) {
    res.write(JSON.stringify({
      "oneDayCount": values[0],
      "oneWeekCount": values[1],
      "oneMonthCount": values[2],
    }));
    res.end();
  });
};

var GetAllTxs = function(lim, res) {
  Transaction().find().exec(function(err, values) {
    res.write(JSON.stringify(values));
  });
};

const MAX_ENTRIES = 10;

const DATA_ACTIONS = {
  "latest_blocks": sendBlocks,
  "latest_txs": sendTxs,
  "latest_txs_counts": lastTxsCount,
  "total_txs": TotalTxsCount,
  "get_all_txs": GetAllTxs,
};
