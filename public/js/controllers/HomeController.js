angular.module('BlocksApp')
  .controller('HomeController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
      // initialize core components
      App.initAjax();

      // $scope.refreshBlocksInterval = setInterval(function() {
      //   console.log("Refresh blocks and transactions");
      //   $scope.reloadBlocks();
      //   $scope.reloadTransactions();
      // }, 5000);
    });

    // $scope.$on('$destroy', function() {
    //   clearInterval($scope.refreshBlocksInterval);
    //   clearInterval($scope.refeshStatsInterval);
    // });

    var URL = '/data';

    $rootScope.isHome = true;

    $scope.loadMoreBlocks = function() {
      $scope.blockLimit += 10;
      $scope.reloadBlocks();
    };

    $scope.loadMoreTransactions = function() {
      $scope.txsLimit += 10;
      $scope.reloadTransactions();
    };

    $scope.reloadBlocks = function() {
      $scope.blockLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: { "action": "latest_blocks", "limit": $scope.blockLimit }
      }).then(function(resp) {
        $scope.latest_blocks = resp.data.blocks;
        $scope.blockLoading = false;
      }).catch(function(err) {
        console.error(err);
        $scope.blockLoading = false;
      });
    };

    $scope.reloadTransactions = function() {
      $scope.txLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: { "action": "latest_txs", "limit": $scope.txsLimit }
      }).then(function(resp) {
        $scope.latest_txs = resp.data.txs;
        $scope.txLoading = false;
      }).catch(function(err) {
        console.error(err);
        $scope.blockLoading = false;
      });
    }

    $scope.reloadBlocks();
    $scope.reloadTransactions();
    $scope.txLoading = false;
    $scope.blockLoading = false;
    $scope.txsLimit = 10;
    $scope.blockLimit = 10;
    $scope.settings = $rootScope.setup;
  })
  .directive('simpleSummaryStats', function($http) {
    return {
      restrict: 'E',
      templateUrl: '/views/summary-stats.html',
      scope: true,
      link: function(scope, elem, attrs) {
        scope.stats = {};
        // scope.stats.onlinevalidators = 1;
        // scope.stats.totalvalidators = 1;
        // scope.stats.usdPht = 0.15;
        // scope.stats.oneTxDayCount = 0;
        // scope.stats.oneTxWeekCount = 0;
        // scope.stats.oneTxMonthCount = 0;

        scope.stats.totalSupply = 300000000;
        scope.stats.totalTxs = null;
        scope.stats.tps = null;

        scope.refreshStats = function() {
          $http.post("/web3relay", { "action": "blockrate" })
            .then(function(res) {
              console.log('blockrate', res.data);
              scope.stats.blockHeight = res.data.blockHeight;
              scope.stats.blockTime = res.data.blockTime;
            });
          $http.post('/data', { "action": "total_txs" })
            .then(function(res) {
              scope.stats.totalTxs = res.data.totalTxs;
            }).catch(function(err) {
            console.error(err);
            scope.blockLoading = false;
          });
          $http.post('/data', { "action": "calculate_tps" })
            .then(function(res) {
              scope.stats.tps = res.data.tps;
            }).catch(function(err) {
            console.error(err);
            scope.blockLoading = false;
          });
          // $http.post("/consensus", { "action": "status" })
          //   .then(function(res) {
          //     console.log('Consensus', res.data);
          //     scope.stats.onlinevalidators = _.size(res.data.active_validators);
          //     scope.stats.totalvalidators = _.size(res.data.validators);
          //   });
          // $http.post('/data', { "action": "latest_txs_counts" })
          //   .then(function(res) {
          //     console.log('Txs counts', res.data);
          //     scope.stats.oneTxDayCount = res.data.oneDayCount;
          //     scope.stats.oneTxWeekCount = res.data.oneWeekCount;
          //     scope.stats.oneTxMonthCount = res.data.oneMonthCount;
          //   }).catch(function(err) {
          //   console.error(err);
          //   scope.blockLoading = false;
          // });
        };

        scope.refreshStats();
      }
    }
  })
  .directive('siteNotes', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/site-notes.html'
    }
  });
