const Multicall = artifacts.require("Multicall");

module.exports = async function (deployer) {
  await deployer.deploy(Multicall);

  console.dir({ Multicall: Multicall.address });
};
