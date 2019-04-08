var BlocksApp = angular.module("BlocksApp", [
  "ui.router",
  "ui.bootstrap",
  "oc.lazyLoad",
  "ngSanitize"
]);
BlocksApp.constant('_', window._);
BlocksApp.config(['$ocLazyLoadProvider', '$locationProvider',
  function($ocLazyLoadProvider, $locationProvider) {
    $ocLazyLoadProvider.config({
      cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
    $locationProvider.html5Mode({
      enabled: true
    });
  }]);
/* Setup global settings */
BlocksApp.factory('settings', ['$rootScope', '$http', function($rootScope, $http) {
  // supported languages
  var settings = {
    layout: {
      pageSidebarClosed: false, // sidebar menu state
      pageContentWhite: false, // set page content layout
      pageBodySolid: false, // solid body color state
      pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    },
    assetsPath: '/',
    globalPath: '/',
    layoutPath: '/',
  };

  $rootScope.settings = settings;
  return settings;
}]);

/* Load config settings */
BlocksApp.factory('setupObj', ['$rootScope', '$http', function($rootScope, $http) {
  return $http.get('/config').then(function(res) {
    return res.data;
  })
}]);

/* Setup App Main Controller */
BlocksApp.controller('MainController', ['$scope', '$rootScope', function($scope, $rootScope) {
  $scope.$on('$viewContentLoaded', function() {
    //App.initComponents(); // init core components
    //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
  });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive.
 ***/
/* Setup Layout Part - Header */
BlocksApp.controller('HeaderController', ['$scope', '$location', '$http', 'setupObj', function($scope, $location, $http, setupObj) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initHeader(); // init header
  });
  $scope.form = {};
  $scope.searchQuery = function(s) {
    var search = s.toLowerCase();

    $scope.form.searchInput = "";
    $scope.form.searchForm.$setPristine();
    $scope.form.searchForm.$setUntouched();
    if (isAddress(search))
      $location.path("/addr/" + search);
    else if (isTransaction(search))
      $location.path("/tx/" + search);
    else if (!isNaN(search))
      $location.path("/block/" + search);
    else
      $scope.form.searchInput = search;
  }
  setupObj.then(function(res) {
    $scope.settings = res;
  });
  $http.get('/genesis.json')
    .then(function(res) {
      const genesis = res.data;
      const addresses = Object.keys(genesis.alloc);
      $scope.alloc_addresses = {
        "Token Sale Account": addresses[0],
        "Project Account": addresses[1]
      };
    });
  $http.get('/tokens.json')
    .then(function(res) {
      $scope.tokens = res.data;
    })
}]);
/* Search Bar */
BlocksApp.controller('PageHeadController', ['$scope', 'setupObj', function($scope, setupObj) {
  $scope.$on('$includeContentLoaded', function() {
  });

  $scope.$watch('current.data');

  setupObj.then(function(res) {
    $scope.settings = res;
  });
}]);
/* Setup Layout Part - Footer */
BlocksApp.controller('FooterController', ['$scope', 'setupObj', function($scope, setupObj) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initFooter(); // init footer
  });
  setupObj.then(function(res) {
    $scope.settings = res;
  });
}]);
/* Setup Rounting For All Pages */
BlocksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  // Redirect any unmatched url
  $urlRouterProvider.otherwise("home");
  $stateProvider
  // Dashboard
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html",
      data: { pageTitle: 'Blockchain Explorer' },
      controller: "HomeController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load([{
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '/js/controllers/HomeController.js',
              '/css/todo-2.min.css'
            ]
          }]);
        }]
      }
    })
    .state('address', {
      url: "/addr/{hash}",
      templateUrl: "views/address.html",
      data: { pageTitle: 'Address' },
      controller: "AddressController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              '/js/controllers/AddressController.js',
              '/plugins/datatables/datatables.min.css',
              '/plugins/datatables/datatables.bootstrap.css',
              '/plugins/datatables/datatables.all.min.js',
              '/plugins/datatables/datatable.min.js'
            ]
          });
        }]
      }
    })
    .state('txtable', {
      url: "/transactions",
      templateUrl: "views/tx-list.html",
      data: { pageTitle: 'Transactions' },
      controller: "TxTableController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              '/js/controllers/TxTableController.js',
              '/plugins/datatables/datatables.min.css',
              '/plugins/datatables/datatables.bootstrap.css',
              '/plugins/datatables/datatables.all.min.js',
              '/plugins/datatables/datatable.min.js'
            ]
          });
        }]
      }
    })
    .state('accounts', {
      url: "/accounts",
      templateUrl: "views/accounts.html",
      data: { pageTitle: 'Accounts' },
      controller: "AccountsController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              '/js/controllers/AccountsController.js',
              '/plugins/datatables/datatables.min.css',
              '/plugins/datatables/datatables.bootstrap.css',
              '/plugins/datatables/datatables.all.min.js',
              '/plugins/datatables/datatable.min.js'
            ]
          });
        }]
      }
    })
    .state('block', {
      url: "/block/{number}",
      templateUrl: "views/block.html",
      data: { pageTitle: 'Block' },
      controller: "BlockController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              '/js/controllers/BlockController.js'
            ]
          });
        }]
      }
    })
    .state('tx', {
      url: "/tx/{hash}",
      templateUrl: "views/tx.html",
      data: { pageTitle: 'Transaction' },
      controller: "TxController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              '/js/controllers/TxController.js'
            ]
          });
        }]
      }
    })
    .state('validator', {
      url: "/validator/{address}",
      templateUrl: "views/validator.html",
      data: { pageTitle: 'Validator' },
      controller: "ValidatorController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
            files: [
              '/js/controllers/ValidatorController.js'
            ]
          });
        }]
      }
    })
    .state('coinfactory', {
      url: "/coinfactory",
      templateUrl: "views/coinfactory.html",
      data: { pageTitle: 'Coin Factory' },
      controller: "TokenListController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '/js/controllers/CoinFactoryController.js'
            ]
          });
        }]
      }
    })
    .state('token', {
      url: "/token/{hash}",
      templateUrl: "views/token.html",
      data: { pageTitle: 'Tokens' },
      controller: "TokenController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '/js/controllers/TokenController.js'
            ]
          });
        }]
      }
    })
    .state('distribution', {
      url: "/distribution",
      templateUrl: "views/token_distribution.html",
      data: { pageTitle: 'Token Distribution' },
      controller: "TokenDistributionController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '/js/controllers/TokenDistributionController.js',
              '/js/abi/TokenDistribution.js'
            ]
          });
        }]
      }
    })
    .state('err404', {
      url: "/err404/{thing}/{hash}",
      templateUrl: "views/err_404.html",
      data: { pageTitle: '404 Not Found.' },
      controller: "ErrController",
      resolve: {
        deps: ['$ocLazyLoad', function($ocLazyLoad) {
          return $ocLazyLoad.load({
            name: 'BlocksApp',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '/js/controllers/ErrController.js'
            ]
          });
        }]
      }
    })
}]);
BlocksApp.filter('timeDuration', function() {
  return function(timestamp) {
    return getDuration(timestamp).toString();
  };
})
  .filter('totalDifficulty', function() {
    return function(hashes) {
      return getDifficulty(hashes);
    };
  })
  .filter('teraHashes', function() {
    return function(hashes) {
      var result = hashes / Math.pow(1000, 4);
      return parseInt(result);
    }
  })
/* Init global settings and run the app */
BlocksApp.run(["$rootScope", "settings", "$state", "setupObj", function($rootScope, settings, $state, setupObj) {
  $rootScope.$state = $state; // state to be accessed from view
  $rootScope.$settings = settings; // state to be accessed from view
  setupObj.then(function(res) {
    $rootScope.setup = res;
  });
}]);
