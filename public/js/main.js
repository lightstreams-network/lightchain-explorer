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
BlocksApp.controller('HeaderController', ['$scope', '$rootScope', '$location', '$http', 'setupObj', function($scope, $rootScope, $location, $http, setupObj) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initHeader(); // init header
  });

  $rootScope.$watch('setup', function(newValue) {
    if(typeof newValue !== 'undefined'){
      $scope.alloc_addresses = newValue.genesisAllocation;
      $scope.showDistribution = newValue.tokenDistributionAddress;
    }
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
  };

  $scope.isMobileAndTablet = function() {
    var check = false;
    (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };

  setupObj.then(function(res) {
    $scope.settings = res;
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
      // url: "/addr/{hash}",
      url: "/{path:addr|address}/{hash}",
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
              '/js/smartcontracts/TokenDistribution.js'
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
