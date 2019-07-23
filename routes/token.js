#!/usr/bin/env node

/*
    Endpoint for client interface with ERC-20 tokens
*/
const Web3 = require('../lib/web3');

module.exports = function(req, res) {
  web3 = Web3();
  if (web3.isConnected())
    console.log("Web3 connection established");
  else
    throw "No connection, please specify web3host in conf.json";

  if (typeof req.body.address === 'undefined') {
    res.status(400).send();
    return;
  }

  const Contract = web3.eth.contract(ABI);
  var contractAddress = req.body.address;
  var Token = Contract.at(contractAddress);

  if (req.body.action === "info") {
    try {
      var actualBalance = web3.eth.getBalance(contractAddress);
      actualBalance = etherUnits.toEther(actualBalance, 'wei');
      // totalSupply = etherUnits.toEther(totalSupply, 'wei')*100;
      var decimals = Token.decimals();
      var name = Token.name();
      var symbol = Token.symbol();
      var count = web3.eth.getTransactionCount(contractAddress);
      var tokenData = {
        "balance": actualBalance,
        "total_supply": totalSupply,
        "count": count,
        "name": name,
        "symbol": symbol,
        "bytecode": web3.eth.getCode(contractAddress)
      }
      res.write(JSON.stringify(tokenData));
      res.end();
    } catch (e) {
      console.error(e);
    }
  } else if (req.body.action === "balanceOf") {
    var addr = req.body.user.toLowerCase();
    try {
      var tokens = Token.balanceOf(addr);
      // tokens = etherUnits.toEther(tokens, 'wei')*100;
      res.write(JSON.stringify({"tokens": tokens}));
      res.end();
    } catch (e) {
      console.error(e);
    }
  }
};