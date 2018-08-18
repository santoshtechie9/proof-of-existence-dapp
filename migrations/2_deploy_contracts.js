var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfOwnership = artifacts.require("./ProofOfOwnership.sol");
var ProofOfExistance = artifacts.require("./ProofOfExistance.sol");
var Mortal = artifacts.require("Mortal");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Mortal);
  deployer.deploy(ProofOfOwnership);
  deployer.deploy(ProofOfExistance);
};
