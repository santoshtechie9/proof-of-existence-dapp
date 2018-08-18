pragma solidity ^0.4.18;

import 'truffle/DeployedAddresses.sol';
import 'truffle/Assert.sol';
import '../contracts/ProofOfOwnership.sol';

contract TestProofOfOwnership {

    function testAddNewDocument() public {
        ProofOfOwnership  proofOfOwnership = ProofOfOwnership(DeployedAddresses.ProofOfOwnership());
        bool expected = true;
        bool returned = proofOfOwnership.addDocument("document1","2018-07-30 09:30:00","sans");
        Assert.equal(returned, expected, "Function should return TRUE");
    }

}