angular.module('BlocksApp')
  .controller('ValidatorController', function($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {
      // initialize core components
      App.initAjax();
    });

    $rootScope.isHome = false;
    $scope.address = $stateParams.address;
    $scope.validator = {
      address: $scope.address
    };

    $scope.settings = $rootScope.setup;

    $http({
      method: 'POST',
      url: '/consensus',
      data: { "action": "validator", "address": $scope.address }
    }).then(function(resp) {
      if (resp.data.error) {
        $location.path("/err404/validator/" + $scope.address);
        return;
      }
      $scope.validator = resp.data;
    });
    //
    // var fetchInternalTxs = function() {
    //   $http({
    //     method: 'POST',
    //     url: '/web3relay',
    //     data: { "tx_trace": $scope.hash }
    //   }).then(function(resp) {
    //     $scope.internal_transactions = resp.data;
    //   });
    // }
  });
