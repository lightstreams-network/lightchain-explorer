angular.module('BlocksApp')
  .controller('HomeController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
      // initialize core components
      App.initAjax();

      $scope.refreshBlocksInterval = setInterval(function() {
        console.log("Refresh blocks and transactions");
        $scope.reloadBlocks();
        $scope.reloadTransactions();
      }, 5000);
    });

    $scope.$on('$destroy', function() {
      clearInterval($scope.refreshBlocksInterval);
      clearInterval($scope.refeshStatsInterval);
    });

    var URL = '/data';

    $rootScope.isHome = true;

    $scope.reloadBlocks = function() {
      $scope.blockLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: { "action": "latest_blocks" }
      }).then(function(resp) {
        $scope.latest_blocks = resp.data.blocks;
        $scope.blockLoading = false;
      });
    }

    $scope.reloadTransactions = function() {
      $scope.txLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: { "action": "latest_txs" }
      }).then(function(resp) {
        $scope.latest_txs = resp.data.txs;
        $scope.txLoading = false;
      });
    }

    $scope.reloadBlocks();
    $scope.reloadTransactions();
    $scope.txLoading = false;
    $scope.blockLoading = false;
    $scope.settings = $rootScope.setup;
  })
  .directive('simpleSummaryStats', function($http) {
    return {
      restrict: 'E',
      templateUrl: '/views/summary-stats.html',
      scope: true,
      link: function(scope, elem, attrs) {
        scope.stats = {};
        scope.stats.onlinevalidators = 1;
        scope.stats.totalvalidators = 1;
        scope.stats.usdPht = 0.15;

        scope.refreshStats = function() {
          $http.post("/web3relay", { "action": "hashrate" })
            .then(function(res) {
              console.log(res.data);
              scope.stats.hashrate = res.data.hashrate;
              scope.stats.difficulty = res.data.difficulty;
              scope.stats.blockHeight = res.data.blockHeight;
              scope.stats.blockTime = res.data.blockTime;
            });
        }

        scope.refreshStats();

        scope.$parent.refeshStatsInterval = setInterval(function() {
          console.log("Refresh stats");
          scope.refreshStats();
        }, 5000);

        // $http.post(etcEthURL, { "action": "etceth" })
        //     .then(function(res) {
        //         scope.stats.etcHashrate = res.data.etcHashrate;
        //         scope.stats.ethHashrate = res.data.ethHashrate;
        //         scope.stats.etcEthHash = res.data.etcEthHash;
        //         scope.stats.ethDiff = res.data.ethDiff;
        //         scope.stats.etcDiff = res.data.etcDiff;
        //         scope.stats.etcEthDiff = res.data.etcEthDiff;
        //     });
      }
    }
  })
  .directive('siteNotes', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/site-notes.html'
    }
  });
