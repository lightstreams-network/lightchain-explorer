function debugNamespace(web3) {
  web3._extend({
    property: 'debug',
    methods: [
      new web3._extend.Method({
        name: 'traceTransaction',
        call: 'debug_traceTransaction',
        params: 2
      }),
    ]
  });
}

function traceNamespace(web3) {
  web3._extend({
    property: 'trace',
    methods: [
      new web3._extend.Method({
        name: 'call',
        call: 'trace_call',
        params: 3,
        inputFormatter: [web3._extend.formatters.inputCallFormatter, null, web3._extend.formatters.inputDefaultBlockNumberFormatter]
      }),

      new web3._extend.Method({
        name: 'rawTransaction',
        call: 'trace_rawTransaction',
        params: 2
      }),

      new web3._extend.Method({
        name: 'replayTransaction',
        call: 'trace_replayTransaction',
        params: 2
      }),

      new web3._extend.Method({
        name: 'block',
        call: 'trace_block',
        params: 1,
        inputFormatter: [web3._extend.formatters.inputDefaultBlockNumberFormatter]
      }),

      new web3._extend.Method({
        name: 'filter',
        call: 'trace_filter',
        params: 1
      }),

      new web3._extend.Method({
        name: 'get',
        call: 'trace_get',
        params: 2
      }),

      new web3._extend.Method({
        name: 'transaction',
        call: 'trace_transaction',
        params: 1
      })
    ]
  });
}

function parityNamespace(web3) {
  web3._extend({
    property: 'parity',
    methods: [
      new web3._extend.Method({
        name: 'pendingTransactions',
        call: 'parity_pendingTransactions',
        params: 0,
        outputFormatter: web3._extend.formatters.outputTransactionFormatter
      }),

      new web3._extend.Method({
        name: 'pendingTransactionsStats',
        call: 'parity_pendingTransactionsStats',
        params: 0
      }),

      new web3._extend.Method({
        name: 'listAccounts',
        call: 'parity_listAccounts',
        params: 3,
        inputFormatter: [null, null, web3._extend.formatters.inputDefaultBlockNumberFormatter]
      }),

      new web3._extend.Method({
        name: 'phraseToAddress',
        call: 'parity_phraseToAddress',
        params: 1
      })
    ]
  });
  return web3;
};

module.exports = function(web3, {parity, trace, debug}) {
  // Geth/Aleth-debugging
  if (parity) {
    parityNamespace(web3)
  }
  if(trace) {
    traceNamespace(web3)
  }
  if (debug) {
    debugNamespace(web3)
  }

  // Tracing
  // traceNamespace(web3)
  // Parity-specific
  // parityNamespace(web3)
};