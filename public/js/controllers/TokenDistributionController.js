function wei2Pht(wei) {
  return web3.fromWei(wei, 'ether');
}

function pht2Wei(pht) {
  return web3.toBigNumber(web3.toWei(pht.toString(), 'ether'));
}

function toBN(value) {
  return web3.toBigNumber(value);
}

angular.module('BlocksApp').controller('TokenDistributionController', function($stateParams, $rootScope, $scope, $http, $location) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();
  });

  const TokenDistributionContract = web3.eth.contract(TokenDistributionABI);
  const TokenDistribution = TokenDistributionContract.at(TokenDistributionAddress);

  // $rootScope.$state.current.data["pageSubTitle"] = TokenDistributionAddress;
  $rootScope.isHome = true;
  $scope.tokenDistributionAddress = TokenDistributionAddress;
  $scope.tokenSymbol = $rootScope.setup.symbol;
  $scope.errorMsg = "";
  $scope.infoMsg = "";
  $scope.metamask = {
    isInstalled: false,
    isUnlocked: false,
    walletAddress: null,
    balance: "0",
    vesting: null
  };

  $scope.verifyMMIsSetup = function() {
    if (typeof web3 !== 'undefined') {
      $scope.metamask.isInstalled = true;
      console.log('MetaMask is installed')
    }
    else {
      $scope.metamask.isInstalled = false;
      console.log('MetaMask is not installed')
    }

    web3.eth.getAccounts(function(err, accounts) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err)
      }
      else if (accounts.length === 0) {
        $scope.metamask.isUnlocked = false;
        console.log('MetaMask is locked')
      }
      else {
        $scope.metamask.isUnlocked = true;
        if (web3.currentProvider.networkVersion !== $rootScope.setup.chainId) {
          $scope.errorMsg = "Metamask connection is not compatible"
        } else {
          $scope.metamask.walletAddress = web3.currentProvider.selectedAddress;
        }
        console.log('MetaMask is unlocked')
      }
    });
  };

  $scope.getBalance = function() {
    web3.eth.getBalance($scope.metamask.walletAddress, function(err, balance) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err)
      } else {
        $scope.metamask.balance = wei2Pht(balance.toString());
      }
    });
  };

  $scope.fetchVesting = function() {
    TokenDistribution.vestings($scope.metamask.walletAddress, function(err, vesting) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err);
        return;
      }

      $scope.metamask.vesting = {
        startTimestamp: parseInt(vesting[VestingProps.startTimestamp].toString()) * 1000,
        endTimestamp: parseInt(vesting[VestingProps.endTimestamp].toString()) * 1000,
        lockPeriod: parseInt(vesting[VestingProps.lockPeriod].toString()) / 86400,
        balanceInitial: parseFloat(wei2Pht(vesting[VestingProps.balanceInitial].toString())),
        balanceClaimed: parseFloat(wei2Pht(vesting[VestingProps.balanceClaimed].toString())),
        balanceRemaining: parseFloat(wei2Pht(vesting[VestingProps.balanceRemaining].toString())),
        bonusInitial: parseFloat(wei2Pht(vesting[VestingProps.bonusInitial].toString())),
        bonusClaimed: parseFloat(wei2Pht(vesting[VestingProps.bonusClaimed].toString())),
        bonusRemaining: parseFloat(wei2Pht(vesting[VestingProps.bonusRemaining].toString())),
        revocable: vesting[VestingProps.revocable],
        revoked: vesting[VestingProps.revoked]
      };
    })
  };

  $scope.withdraw = function() {
    TokenDistribution.withdraw($scope.metamask.walletAddress, {
      from: $scope.metamask.walletAddress,
      gasPrice: 500000000000,
    }, function(err, result) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err);
      } else{
        console.log(result);
        $scope.infoMsg = "Withdrawn vested token correctly";
        $scope.getBalance();
      }
    })
  };

});
