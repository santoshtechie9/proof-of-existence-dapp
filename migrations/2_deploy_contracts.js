var Mortal = artifacts.require("./Mortal.sol");
var ProofDB = artifacts.require("./ProofDB.sol");
var Proof = artifacts.require("./Proof.sol");
var Register = artifacts.require("./Register.sol");

module.exports = function (deployer) {

  deployer.deploy(Mortal).then(() => {
    return deployer.deploy(ProofDB)
  }).then(() => {
    return deployer.deploy(Proof, ProofDB.address);
  }).then(() => {
    return deployer.deploy(Register, Proof.address);
  })

};
