var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfOwnership = artifacts.require("./ProofOfOwnership.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(ProofOfOwnership);
};
