// Allows us to use ES6 in our migrations and tests.
require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require("truffle-hdwallet-provider");

// Edit truffle.config file should have settings to deploy the contract to the Rinkeby Public Network.
// Infura should be used in the truffle.config file for deployment to Rinkeby.

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '4447' // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider("tourist thing boss grass cabin sudden raise erase average unit misery brother", "https://rinkeby.infura.io/v3/2992ad5d6af74e53b8f883ce8ce0a81c")
      },
      network_id: '4',
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
  compilers: {
    solc: {
      version: "0.4.24"
    }
  } 
}
