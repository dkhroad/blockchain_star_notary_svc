# Decentralized Star Notary 

## Summary 

* Contract Address: [0xf931bc4fa13badb7542e60a5b1c721fd20d0e062](https://rinkeby.etherscan.io/address/0xf931bc4fa13badb7542e60a5b1c721fd20d0e062)
* Create Star Txn:  [0x85034480dff4c0685ccbe7725a40fced0785607c077dedcb3bc91e3507a5da43](https://rinkeby.etherscan.io/tx/0x85034480dff4c0685ccbe7725a40fced0785607c077dedcb3bc91e3507a5da43)
* putStarUpForSale Txn: [0xcfaa0ed1344ad799d0b028ed1a5affdb67552ddd76719e1930b4eacb7a5948f3](https://rinkeby.etherscan.io/tx/0xcfaa0ed1344ad799d0b028ed1a5affdb67552ddd76719e1930b4eacb7a5948f3)

## Installation
### Pre-requisites 

* `npm install -g truffle`
* `npm install -g  ganache-cli`

```
npm install
``` 

## Testing 

```
truffle compile
truffle test
```

## Deploying 

### On Local Blockchain (Ganache) 
```
truffle migrate --network test
```

### On Rinkeby TestNet 
```
export MNEMONIC=<mnemominc phrase>
export LOCAL_KEY=<infura API key>
truffle migrate ---network rinkeby
``