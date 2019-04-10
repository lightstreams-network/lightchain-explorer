const VestingProps = {
  startTimestamp: 0,
  endTimestamp: 1,
  lockPeriod: 2,
  balanceInitial: 3,
  balanceClaimed: 4,
  balanceRemaining: 5,
  bonusInitial: 6,
  bonusClaimed: 7,
  bonusRemaining: 8,
  revocable: 9,
  revoked: 10
};


const TokenDistributionABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "SALE_AVAILABLE_TOTAL_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x02784b67"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_recipient",
        "type": "address"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "transferRevokedTokens",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x19b46083"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "revokedAmount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x37aeb086"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "AVAILABLE_SEED_CONTRIBUTORS_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x4bbc1de7"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "AVAILABLE_OTHER_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x4dd1efa0"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x51cff8d9"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "PROJECT_INITIAL_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x61b74b46"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "name": "_nextBeneficiary",
        "type": "address"
      }
    ],
    "name": "updateVestingBeneficiary",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x7767c10a"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "AVAILABLE_FUTURE_OFFERING_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x82411c89"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8da5cb5b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x8f32d59b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "AVAILABLE_TEAM_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x98431a78"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "AVAILABLE_CONSULTANTS_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x9d05d777"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "openingTime",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xb7a8807c"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "PROJECT_AVAILABLE_TOTAL_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xc5efb556"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "vestings",
    "outputs": [
      {
        "name": "startTimestamp",
        "type": "uint256"
      },
      {
        "name": "endTimestamp",
        "type": "uint256"
      },
      {
        "name": "lockPeriod",
        "type": "uint256"
      },
      {
        "name": "balanceInitial",
        "type": "uint256"
      },
      {
        "name": "balanceClaimed",
        "type": "uint256"
      },
      {
        "name": "balanceRemaining",
        "type": "uint256"
      },
      {
        "name": "bonusInitial",
        "type": "uint256"
      },
      {
        "name": "bonusClaimed",
        "type": "uint256"
      },
      {
        "name": "bonusRemaining",
        "type": "uint256"
      },
      {
        "name": "revocable",
        "type": "bool"
      },
      {
        "name": "revoked",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xdaf49863"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "SALE_INITIAL_SUPPLY",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xe69bb5ca"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "revokeVestingSchedule",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf035a272"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0xf2fde38b"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "MAX_TOKENS",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xf47c84c5"
  },
  {
    "inputs": [
      {
        "name": "_openingTime",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor",
    "signature": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_bonus",
        "type": "uint256"
      }
    ],
    "name": "NewVesting",
    "type": "event",
    "signature": "0x627ad26dcfe82ec79b33fda0ddd062f6fab9f4914acac8345f79090dfd86fb54"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "Withdrawn",
    "type": "event",
    "signature": "0x7084f5476618d8e60b11ef0d7d3f06914655adb8793e28ff7f018d4c76d505d5"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_beneficiary",
        "type": "address"
      }
    ],
    "name": "RevokedVesting",
    "type": "event",
    "signature": "0x8cd79b36eae18470f999ddc31362fc2315d3508e4e0f687df8b09f866164ff2f"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_newBeneficiary",
        "type": "address"
      }
    ],
    "name": "UpdateVesting",
    "type": "event",
    "signature": "0xd77a2228cdb1c1e8932bfd6a14ee457fcb127fc8513666e2f16bdb5687d631c8"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_type",
        "type": "string"
      },
      {
        "indexed": false,
        "name": "_uint",
        "type": "uint256"
      }
    ],
    "name": "LogInt",
    "type": "event",
    "signature": "0x3b53f2745f01e9cc7d8317d92cca0b2e25a1e0f710c5b65c2da4002d794e399f"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event",
    "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "name": "_category",
        "type": "uint8"
      }
    ],
    "name": "scheduleProjectVesting",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x64544002"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "name": "_bonus",
        "type": "uint256"
      }
    ],
    "name": "schedulePrivateSaleVesting",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x2d709717"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_beneficiary",
        "type": "address"
      },
      {
        "name": "_bonus",
        "type": "uint256"
      }
    ],
    "name": "schedulePublicSaleVesting",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x44af46ca"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "projectSupplyDistributed",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x1d786891"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "saleSupplyDistributed",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0xbc1b745c"
  }
];