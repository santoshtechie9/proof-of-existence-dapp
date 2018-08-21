var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var ProofOfOwnership = artifacts.require("./ProofOfOwnership.sol");
var ProofOfExistance = artifacts.require("./ProofOfExistance.sol");
var Mortal = artifacts.require("./Mortal.sol");
var ProofDB = artifacts.require("./ProofDB.sol");
var ProofLogic = artifacts.require("./ProofLogic.sol");
var Relay = artifacts.require("./Relay.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Mortal);
  deployer.deploy(ProofOfOwnership);
  deployer.deploy(ProofOfExistance).then(()=>{
    return deployer.deploy(ProofDB)
  }).then(()=>{
    return deployer.deploy(ProofLogic, ProofDB.address);
  }).then(()=>{
    return deployer.deploy(Relay, ProofLogic.address);
  })

};
