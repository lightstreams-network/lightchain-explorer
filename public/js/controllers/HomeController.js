angular.module('BlocksApp').controller('HomeController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    var URL = '/data';

    $rootScope.isHome = true;

    $scope.reloadBlocks = function() {
      $scope.blockLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: {"action": "latest_blocks"}
      }).success(function(data) {
        $scope.blockLoading = false;
        $scope.latest_blocks = data.blocks;
      });
    }
    

    $scope.reloadTransactions = function() {
      $scope.txLoading = true;
      $http({
        method: 'POST',
        url: URL,
        data: {"action": "latest_txs"}
      }).success(function(data) {
        $scope.latest_txs = data.txs;
        $scope.txLoading = false;
      });  
    }

    $scope.reloadBlocks();
    $scope.reloadTransactions();
    $scope.txLoading = false;
    $scope.blockLoading = false;
})
.directive('summaryStats', function($http) {
  return {
    restrict: 'E',
    templateUrl: '/views/summary-stats.html',
    scope: true,
    link: function(scope, elem, attrs){
      scope.stats = {};

      var statusUrl = "status";
      var tendermintDomain = "https://sirius-t.dev.lsops.biz";
      scope.stats.blockPerSecond = 1;
      scope.stats.validators = 1;
      scope.stats.usdPht = 0.15;

      // $http.post(etcEthURL, {"action": "etceth"})
      //  .then(function(res){
      //     scope.stats.etcHashrate = res.data.etcHashrate;
      //     scope.stats.ethHashrate = res.data.ethHashrate;
      //     scope.stats.etcEthHash = res.data.etcEthHash;
      //     scope.stats.ethDiff = res.data.ethDiff;
      //     scope.stats.etcDiff = res.data.etcDiff;
      //     scope.stats.etcEthDiff = res.data.etcEthDiff;
      //   });
      // $http.get(etcPriceURL)
      //  .then(function(res){
      //   });
      }
  }
});

