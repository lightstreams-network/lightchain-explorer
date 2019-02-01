angular.module('BlocksApp').controller('TokenController', function($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    var activeTab = $location.url().split('#');
    if (activeTab.length > 1)
      $scope.activeTab = activeTab[1];

    $rootScope.$state.current.data["pageSubTitle"] = $stateParams.hash; //replace with token name
    $scope.addrHash = isAddress($stateParams.hash) ? $stateParams.hash : undefined;
    var address = $scope.addrHash;
    $scope.token = {"balance": 0};
    $scope.settings = $rootScope.setup;

    $http.get('/tokens.json')
    .then(function(res) {
      const tokens = res.data;
      const t = tokens.filter(t => t.address == $scope.addrHash);
      if (t.length === 1) {
        $scope.token = { ...$scope.token, ...t[0] };
      }

    });

    //fetch dao stuff
    $http({
      method: 'POST',
      url: '/tokenrelay',
      data: {"action": "info", "address": address}
    }).then(function(resp) {
      console.log(resp.data);
      $scope.token = { ...$scope.token, ...resp.data };
      $scope.token.address = address;
      $scope.addr = {"bytecode": resp.data.bytecode};
      if (resp.data.name)
        $rootScope.$state.current.data["pageTitle"] = resp.data.name;
    });

    $scope.form = {};
    $scope.errors = {};
    $scope.showTokens = false;
    $scope.getBalance = function(a) {
        var addr = a.toLowerCase();

        $scope.form.addrInput="";
        $scope.errors = {};

        $scope.form.tokens.$setPristine();
        $scope.form.tokens.$setUntouched();
        if (isAddress(addr)) {
          $http({
            method: 'POST',
            url: '/tokenrelay',
            data: {"action": "balanceOf", "user": addr, "address": address}
          }).then(function(resp) {
            console.log(resp.data)
            $scope.showTokens = true;
            $scope.userTokens = resp.data.tokens;
          });
        } else 
            $scope.errors.address = "Invalid Address";

    }

})
