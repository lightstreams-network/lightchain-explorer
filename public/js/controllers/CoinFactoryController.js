angular.module('BlocksApp').controller('CoinFactoryController', function($stateParams, $rootScope, $scope, $http) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    $scope.settings = $rootScope.setup;

    $http.get('/tokens.json')
      .then(function(res){
        $scope.tokens = res.data;
      })

});