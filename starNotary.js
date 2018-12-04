
if(typeof web3 != 'undefined') { 
  web3 = new Web3(web3.currentProvider) // what Metamask injected 
} else {
  // Instantiate and set Ganache as your provider
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}
// The default (top) wallet account from a list of test accounts 
web3.eth.defaultAccount = web3.eth.accounts[0];

// The interface definition for your smart contract (the ABI) 
var abi =  [
  {
    "constant": true,
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "starExists",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "starForSale",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "from",
        "type": "address"
      },
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "name": "_data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tokenIdToStarMapping",
    "outputs": [
      {
        "name": "name",
        "type": "string"
      },
      {
        "name": "ra",
        "type": "string"
      },
      {
        "name": "dec",
        "type": "string"
      },
      {
        "name": "mag",
        "type": "string"
      },
      {
        "name": "starStory",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_ra",
        "type": "string"
      },
      {
        "name": "_dec",
        "type": "string"
      },
      {
        "name": "_mag",
        "type": "string"
      },
      {
        "name": "_starStory",
        "type": "string"
      },
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "createStar",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256"
      },
      {
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "putStarUpForSale",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "buyStar",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_ra",
        "type": "string"
      },
      {
        "name": "_dec",
        "type": "string"
      },
      {
        "name": "_mag",
        "type": "string"
      }
    ],
    "name": "checkIfStarExist",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenIdToStarInfo",
    "outputs": [
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      },
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
var StarNotary = web3.eth.contract(abi);

// Grab the contract at specified deployed address with the interface defined by the ABI
var starNotary = StarNotary.at("0xf931bc4fa13badb7542e60a5b1c721fd20d0e062");


function updateStatus(status) {
  document.getElementById('status').innerText = status;
}
// Enable claim button being clicked
function claimButtonClicked() { 
  updateStatus('');
  const starName = document.getElementById('star-name').value;
  const starRa = document.getElementById('star-ra').value;
  const starDec = document.getElementById('star-dec').value;
  const starMag = document.getElementById('star-mag').value;
  const starStory = document.getElementById('star-story').value;
  const tokenId = parseInt(document.getElementById('token-id').value);

  if (!(starRa && starDec && starMag && tokenId)) {
    updateStatus("RA, Dec, & Mag can\'t be empty");
    return;
  }


  web3.eth.getAccounts(function(error, accounts) { 
    if (error) { 
      console.log(error)
      return
    }
    var account = accounts[0]
    starNotary.createStar.sendTransaction(starName,
      starRa,starDec,starMag,starStory,tokenId,
      {from: account, gas: 6000000}, function (error, result) {
      if (!error) {
        updateStatus("Transaction sent!");
        console.log(result);
        var transferEvent = starNotary.Transfer();
        transferEvent.watch(function(error, result) {
          if (!error) {
            updateStatus("Star created!");
          } else {
            updateStatus('watching for transfer event is failing!');
            console.log('watching for transfer event is failing!');
          }
        });
      } else { 
        updateStatus("Star creation failed!"); 
        console.log(error);
      }
    });
  })
}

function queryButtonClicked() {
  updateStatus('');
  const tokenId = parseInt(document.getElementById('query-token-id').value);
  if (!tokenId) {
    updateStatus("TokenId can't be empty");
    return;
  }
  web3.eth.getAccounts((error,accounts) =>  {
    if (error) {
      console.log(error);
      return;
    }
    const account = accounts[0];
    starNotary.tokenIdToStarInfo.call(tokenId,(error,result) => {
      if (!error) {
        console.log(result);
        document.getElementById('query-result').innerText = result;
        updateStatus('Query successful!');
      } else {
        console.log(error);
        updateStatus('Query failed!');
      }
    })
  });
}
