angular.module('BlocksApp').controller('TxTableController', function($stateParams, $rootScope, $scope, $http, $location) {
    var activeTab = $location.url().split('#');
    if (activeTab.length > 1)
      $scope.activeTab = activeTab[1];

    $rootScope.$state.current.data["pageSubTitle"] = $stateParams.hash;
    $scope.addrHash = $stateParams.hash;
    $scope.addr = {"balance": 0, "count": 0};
    $scope.settings = $rootScope.setup;

    //fetch web3 stuff
  $http.post('/data', { "action": "get_all_txs" })
    .then(function(res) {
      console.log('Txs counts', res.data);
      scope.stats.totalTxs = res.data.totalTxs;
    }).catch(function(err) {
    console.error(err);
    scope.blockLoading = false;
  });

    // fetch ethf balance 
    if ($scope.settings.useEthFiat)
    $http({
      method: 'POST',
      url: '/fiat',
      data: {"addr": $scope.addrHash}
    }).then(function(resp) {
      $scope.addr.ethfiat = resp.data.balance;
    });

    //fetch transactions
    var fetchTxs = function() {
      var table = $("#table_txs").DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        ajax: function(data, callback, settings) {
          data.addr = $scope.addrHash;
          data.count = $scope.addr.count;
          $http.post('/addr', data).then(function(resp) {
            // save data
            $scope.data = resp.data;
            // check $scope.records* if available.
            resp.data.recordsTotal = $scope.recordsTotal ? $scope.recordsTotal : resp.data.recordsTotal;
            resp.data.recordsFiltered = $scope.recordsFiltered ? $scope.recordsFiltered : resp.data.recordsFiltered;
            callback(resp.data);
          });

          // get mined, recordsTotal counter only once.
          if (data.draw > 1)
            return;

          $http.post('/addr_count', data).then(function(resp) {
            $scope.addr.count = resp.data.recordsTotal;

            data.count = resp.data.recordsTotal;

            // set $scope.records*
            $scope.recordsTotal = resp.data.recordsTotal;
            $scope.recordsFiltered = resp.data.recordsFiltered;
            // draw table if $scope.data available.
            if ($scope.data) {
              $scope.data.recordsTotal = resp.data.recordsTotal;
              $scope.data.recordsFiltered = resp.data.recordsFiltered;
              callback($scope.data);
            }
          });
        },
        "lengthMenu": [
                    [10, 20, 50, 100, 150, 500],
                    [10, 20, 50, 100, 150, 500] // change per page values here
                ],
        "pageLength": 20, 
        "order": [
            [6, "desc"]
        ],
        "language": {
          "lengthMenu": "_MENU_ transactions",
          "zeroRecords": "No transactions found",
          "infoEmpty": ":(",
          "infoFiltered": "(filtered from _MAX_ total txs)"
        },
        "columnDefs": [ 
          { "targets": [ 5 ], "visible": false, "searchable": false },
          {"type": "date", "targets": 6},
          {"orderable": false, "targets": [0,2,3,4]},
          { "render": function(data, type, row) {
                        if (data != $scope.addrHash)
                          return '<a href="/addr/'+data+'">'+data+'</a>'
                        else
                          return data
                      }, "targets": [2,3]},
          { "render": function(data, type, row) {
                        return '<a href="/block/'+data+'">'+data+'</a>'
                      }, "targets": [1]},
          { "render": function(data, type, row) {
                        return '<a href="/tx/'+data+'">'+data+'</a>'
                      }, "targets": [0]},
          { "render": function(data, type, row) {
                        return getDuration(data).toString();
                      }, "targets": [6]},
          ]
      });
    };

    var fetchInternalTxs = function() {
      $http({
        method: 'POST',
        url: '/web3relay',
        data: {"addr_trace": $scope.addrHash}
      }).then(function(resp) {
        $scope.internal_transactions = resp.data;
      });      
    }
    
});
