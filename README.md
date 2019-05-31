# Lightchain Explorer

This project was forked from [ETC Block Explorer Development](https://github.com/ethereumclassic/explorer).

**Live Version**: [explorer.lightstreams.io](https://explorer.mainnet.lightstreams.io)

## Installation

### Pre-requirements


- [Nodejs and npm](https://docs.npmjs.com/getting-started/installing-node)
- [Mongo-db](https://docs.mongodb.com/v3.2/installation/)
- [Lightchain](https://github.com/lightstreams-network/lightchain)

#### Lightchain

**Installation**
To install lightchain you can follow the instructions written at the
[lightchain repository](https://github.com/lightstreams-network/lightchain).

Also Lightstreams team provides **precompiled** binaries for macOd and Linux amd64:
== macOS ==
```
wget "https://s3.eu-central-1.amazonaws.com/lightstreams-public/lightchain/lightchain-osx" -O /usr/local/bin/lightchain
```

== Linux (amd64) ==
```
wget "https://s3.eu-central-1.amazonaws.com/lightstreams-public/lightchain/lightchain-linux-amd64" -O /usr/local/bin/lightchain
```

**Run Lightchain node**

In order to run a local explorer we need a local `lightchain` node running
locally first. Firstly, and ONLY IF YOU DIDN'T DO IT BEFORE, we need to
initialize the lightchain data directory:
```
lightchain init --datadir=${HOME}/.lightchain
```

Once we have the lightchain node initialize we run the synchronization of the
node, enabling the rpc API as follow:
```
lightchain run --datadir=${HOME}/.lightchain --rpc --rpcapi admin,db,eth,net,shh,txpool,personal,web3
```

The synchronization might take several minutes, but you can continuous to next step.
If you want to see more option regarding every possible option of
lightchain visit our [cli docs](https://docs.lightstreams.network/cli-docs/lightchain/)


### How to use it

Clone Repository
```
git clone https://github.com/lightstreams-network/lightchain-explorer
```

Install dependencies

```
npm install
```

Create a config setting file using sample version
```
mv config.json.sample config.json
```

The setup configuration is stored at `config.json`. Edit its content to match your local requirements:
```json
{
    "nodeAddr":     "localhost",
    "gethPort":     8545,
    "tendermintAddr": "127.0.0.1:26657",
    "syncConsensus" : true,
    "startBlock":   0,
    "quiet":        false,
    "syncAll":      true,
    "patch":        true,
    "patchBlocks":  100,
    "bulkSize":     100,
    ...
}
```

The most relevant properties are the next ones:

* ```nodeAddr```    Your node API RPC address. It runs part of `lightchain node` and it listens on interface `localhost`.
* ```gethPort```    Your node API RPC port. It runs as part of `lightchain node` and it listens on port `8545`.
* ```tendermintAddr``` Your Tendermint API RPC. It runs as part of `lightchain node` and it listens on `127.0.0.1:26657`.

* ```startBlock```  This is the start block of the blockchain, should always be 0 if you want to sync the whole ETC blockchain.
* ```endBlock```    This is usually the 'latest'/'newest' block in the blockchain, this value gets updated automatically, and will be used to patch missing blocks if the whole app goes down.
* ```quiet```       Suppress some messages. (admittedly still not quiet)
* ```syncAll```     If this is set to true at the start of the app, the sync will start syncing all blocks from lastSync, and if lastSync is 0 it will start from whatever the endBlock or latest block in the blockchain is.
* ```patch```       If set to true and below value is set, sync will iterated through the # of blocks specified.
* ```patchBlocks``` If `patch` is set to true, the amount of block specified will be check from the latest one.

Explorer service is split into two sub-services, one for populating the local
mongodb database with the information fetch from the local lightchain node, and
a second one to serve the UI and the endpoints used for this UI.

Once said that, we firstly launch the sync process:
```
npm run sync
```

After that we will see how we connect to the local node and retrive
blocks and transactions to be stored in mongodb.

Now on a different terminal we run:
```
npm run app
```
This will start a node server on [localhost:3000](localhost:3000) serving
your local version of the blockchain explorer.

We also could run both process in parallel using:
```
npm run start
```

## Troubleshooting
### Cleaning DB
Data is being allocated into a DB names `blockDB` in mongo. In case
we need to re-sync our db we shoud wipe the database beforehand as follow:
```
mongo blockDB --eval "db.dropDatabase();"
```
