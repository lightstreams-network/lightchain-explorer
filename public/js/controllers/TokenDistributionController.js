angular.module('BlocksApp').controller('TokenDistributionController', function($stateParams, $rootScope, $scope, $http) {
  $scope.$on('$viewContentLoaded', function() {
    // initialize core components
    App.initAjax();
  });

  const TokenDistributionContract = web3.eth.contract(TokenDistributionABI);
  const TokenDistribution = TokenDistributionContract.at($rootScope.setup.tokenDistributionAddress);

  // $rootScope.$state.current.data["pageSubTitle"] = TokenDistributionAddress;
  $rootScope.isHome = true;
  $scope.tokenDistributionAddress = $rootScope.setup.tokenDistributionAddress;
  $scope.tokenSymbol = $rootScope.setup.symbol;
  $scope.errorMsg = "";
  $scope.infoMsg = "";
  $scope.vesting = null;
  $scope.metamask = {
    isInstalled: false,
    isUnlocked: false,
    walletAddress: "0x00000000000000000000000000000",
    balance: "0"
  };

  const wei2pht = function(wei) {
    if (typeof web3 !== 'undefined') {
      return web3.fromWei(wei, 'ether');
    }
    console.error("Web3 is not loaded")
  };

  const verifyMMIsInstalled = function() {
    if (typeof web3 !== 'undefined') {
      $scope.metamask.isInstalled = true;
      console.log('MetaMask is installed')
    }
    else {
      $scope.errorMsg = "MetaMask extension was not detected. Please install MetaMask following " +
        "<a href='https://metamask.io/'>official instructions</a>";
      $scope.metamask.isInstalled = false;
      console.log('MetaMask is not installed')
    }
  };

  const verifyMMIsUnlock = function(cb) {
    web3.eth.getAccounts(function(err, accounts) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err)
      }
      else if (accounts.length === 0) {
        $scope.errorMsg = "MetaMask extension was detected but it seems to be locked. Please unlock it to continue.";
        $scope.metamask.isUnlocked = false;
        console.log('MetaMask is locked')
      }
      else {
        if (web3.currentProvider.networkVersion !== $rootScope.setup.chainId) {
          $scope.errorMsg = "MetaMask selected network is not corresponding to Lightstreams blockchain. Please configure your" +
            " extension to use Lightstreams."
        } else {
          $scope.metamask.isUnlocked = true;
          console.log('MetaMask is unlocked')
        }
      }

      cb();
      $scope.$apply();
    });
  };

  const updateBalance = function() {
    web3.eth.getBalance($scope.metamask.walletAddress, function(err, balance) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err)
      } else {
        $scope.metamask.balance = wei2pht(balance.toString());
      }
      $scope.$apply();
    });
  };

  const calculateWithdrawable = function(vesting) {
    if(vesting.revoked) {
      return 0;
    }

    const oneDayInMs = 86400 * 1000;
    let withdrawableBalance = 0;
    let withdrawableBonus = 0;

    // const now = (new Date()).getTime() + (oneDayInMs * 30 * 1);
    const now = (new Date()).getTime();
    const vestingPeriodInMs = vesting.endTimestamp - vesting.startTimestamp;
    const vestedTimeInMs = now - vesting.startTimestamp;
    if (vesting.lockPeriod === 0) {
      return vesting.bonusRemaining + vesting.balanceRemaining;
    }

    const lockPeriodInMs = vesting.lockPeriod * oneDayInMs;
    const lockPeriods = parseInt(vestingPeriodInMs / lockPeriodInMs) + 1;
    const curPeriod = parseInt(vestedTimeInMs / lockPeriodInMs) + 1;

    const vestedAmountPerPeriod = (vesting.balanceInitial / lockPeriods);
    withdrawableBalance = vestedAmountPerPeriod*curPeriod - vesting.balanceClaimed;
    if (withdrawableBalance > vesting.balanceRemaining) {
      withdrawableBalance = vesting.balanceRemaining
    }

    if (curPeriod > lockPeriods && vesting.bonusInitial > 0) {
      withdrawableBonus = vestedAmountPerPeriod * (curPeriod-lockPeriods);
      if (withdrawableBonus > vesting.bonusRemaining) {
        withdrawableBonus = vesting.bonusRemaining;
      }
    }

    return withdrawableBalance + withdrawableBonus;
  };

  const fetchVesting = function() {
    TokenDistribution.vestings($scope.metamask.walletAddress, function(err, vesting) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err);
        return;
      }

      const fetchVesting = {
        startTimestamp: parseInt(vesting[VestingProps.startTimestamp].toString()) * 1000,
        endTimestamp: parseInt(vesting[VestingProps.endTimestamp].toString()) * 1000,
        lockPeriod: parseInt(vesting[VestingProps.lockPeriod].toString()) / 86400,
        balanceInitial: parseFloat(wei2pht(vesting[VestingProps.balanceInitial].toString())),
        balanceClaimed: parseFloat(wei2pht(vesting[VestingProps.balanceClaimed].toString())),
        balanceRemaining: parseFloat(wei2pht(vesting[VestingProps.balanceRemaining].toString())),
        bonusInitial: parseFloat(wei2pht(vesting[VestingProps.bonusInitial].toString())),
        bonusClaimed: parseFloat(wei2pht(vesting[VestingProps.bonusClaimed].toString())),
        bonusRemaining: parseFloat(wei2pht(vesting[VestingProps.bonusRemaining].toString())),
        withdrawable: 0,
        revocable: vesting[VestingProps.revocable],
        revoked: vesting[VestingProps.revoked]
      };

      fetchVesting.withdrawable = calculateWithdrawable(fetchVesting);
      $scope.vesting = fetchVesting;
      $scope.$apply();
    })
  };

  $scope.withdraw = function() {
    TokenDistribution.withdraw($scope.metamask.walletAddress, {
      from: $scope.metamask.walletAddress,
      gasPrice: "500000000000",
    }, function(err, result) {
      if (err != null) {
        $scope.errorMsg = err.message;
        console.log(err);
        $scope.$apply();
      } else {
        debugger;
        console.log(result);
        $scope.infoMsg = "Withdrawn processed correctly <a href='/tx/"+result+"'>"+result+"</a>";
        updateBalance();
        fetchVesting();
      }
    })
  };

  $scope.refresh = function() {
    $scope.errorMsg = "";
    $scope.infoMsg = "";
    verifyMMIsInstalled();
    if ($scope.metamask.isInstalled) {
      verifyMMIsUnlock(function() {
        if ($scope.metamask.isUnlocked) {
          $scope.metamask.walletAddress = web3.currentProvider.selectedAddress;
          updateBalance();
          fetchVesting();
          $scope.$apply();
        }
      });
    }
  };

  $scope.refresh();
});
