/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

/**`
* Pass in an array of RPC urls to grab a random one on each run.
* This function uses a closure so that the same rpc url is used on each run as 
* HDWallet provider calls it multiple times
* 
* @param {*} rpcUrlArray 
* @returns rpcUrl
*/
function randomRpcHandler() {
  let rpc = undefined;
  return function (rpcUrlArray) {
    if (!rpc) {
      // Using `| 0` here in place of Math.floor()
      rpc = rpcUrlArray[(Math.random() * rpcUrlArray.length) | 0];
      console.log(`truffle-config::Using rpc ${rpc}`)
    }
    return rpc;
  }
}

const BSC_RPC = randomRpcHandler();
const BSC_TESTNET_RPC = randomRpcHandler();
const POLYGON_RPC = randomRpcHandler();
const POLYGON_TESTNET_RPC = randomRpcHandler();

const MAINNET_DEPLOYER_KEY = process.env.MAINNET_DEPLOYER_KEY;
const TESTNET_DEPLOYER_KEY = process.env.TESTNET_DEPLOYER_KEY;

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,           // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
      gas: 6721975
    },
    bsc: {
      provider: () => new HDWalletProvider(MAINNET_DEPLOYER_KEY, BSC_RPC([
        `https://bsc-dataseed.binance.org/`,
        `https://bsc-dataseed.binance.org/`,
        `https://bsc-dataseed2.defibit.io/`,
        `https://bsc-dataseed1.defibit.io/`,
        `https://bsc-dataseed1.ninicoin.io/`,
        `https://bsc-dataseed2.defibit.io/`,
        `https://bsc-dataseed3.defibit.io/`,
        `https://bsc-dataseed4.defibit.io/`,
        `https://bsc-dataseed2.ninicoin.io/`,
        `https://bsc-dataseed3.ninicoin.io/`,
        `https://bsc-dataseed4.ninicoin.io/`,
        `https://bsc-dataseed1.binance.org/`,
        `https://bsc-dataseed2.binance.org/`,
        `https://bsc-dataseed3.binance.org/`,
        `https://bsc-dataseed4.binance.org/`,
      ])),
      network_id: 56,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: false
    },
    "bsc-testnet": {
      provider: () => new HDWalletProvider(TESTNET_DEPLOYER_KEY, BSC_TESTNET_RPC([
        `https://data-seed-prebsc-1-s1.binance.org:8545`,
        `https://data-seed-prebsc-2-s1.binance.org:8545`,
        `https://data-seed-prebsc-1-s2.binance.org:8545`,
        `https://data-seed-prebsc-2-s2.binance.org:8545`,
        `https://data-seed-prebsc-1-s3.binance.org:8545`,
        `https://data-seed-prebsc-2-s3.binance.org:8545`,
      ])),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polygon: {
      provider: () => new HDWalletProvider(MAINNET_DEPLOYER_KEY, POLYGON_RPC([
        `https://polygon-rpc.com/`,
        `https://rpc-mainnet.matic.network`,
        `https://matic-mainnet.chainstacklabs.com`,
        `https://rpc-mainnet.maticvigil.com`,
        `https://rpc-mainnet.matic.quiknode.pro`,
        `https://matic-mainnet-full-rpc.bwarelabs.com`,
      ])),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    'polygon-testnet': {
      provider: () => new HDWalletProvider(TESTNET_DEPLOYER_KEY, POLYGON_TESTNET_RPC([
        `https://rpc-mumbai.matic.today`,
        `https://matic-mumbai.chainstacklabs.com`,
        `https://rpc-mumbai.maticvigil.com`,
        `https://matic-testnet-archive-rpc.bwarelabs.com`,

      ])),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  plugins: [
    'truffle-plugin-verify',
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY,
    hecoinfo: process.env.HECOINFO_API_KEY,
    ftmscan: process.env.FTMSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.6",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
        enabled: true,
        runs: 200
      },
      //  evmVersion: "byzantium"
      // }
    }
  },

  // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
  //
  // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
  // those previously migrated contracts available in the .db directory, you will need to run the following:
  // $ truffle migrate --reset --compile-all

  db: {
    enabled: false
  }
};
