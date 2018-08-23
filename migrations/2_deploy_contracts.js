var Mortal = artifacts.require("./Mortal.sol");
var ProofDB = artifacts.require("./ProofDB.sol");
var Proof = artifacts.require("./Proof.sol");
var Relay = artifacts.require("./Relay.sol");
var ProofOfOwnership = artifacts.require("./ProofOfOwnership.sol");
var ProofOfExistance = artifacts.require("./ProofOfExistance.sol");

module.exports = function (deployer) {
  deployer.deploy(ProofOfOwnership);
  deployer.deploy(ProofOfExistance);

  deployer.deploy(Mortal).then(() => {
    return deployer.deploy(ProofDB)
  }).then(() => {
    return deployer.deploy(Proof, ProofDB.address);
  }).then(() => {
    return deployer.deploy(Relay, Proof.address);
  })

};
