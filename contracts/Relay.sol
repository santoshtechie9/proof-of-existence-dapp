pragma solidity ^0.4.22;

import './Mortal.sol';

// This contract maintains the current version of Proof contract.
// Proof contract has the logic and code
contract Relay is Mortal {
    
    address public currentVersion;
    
    // event to log the current version of the contract
    event LogCurrentVersion(address _address);
    
    // Modifier to restrict access.
    // Only owner will be able to change the current version of the contract
    modifier onlyOwner() {
        require(msg.sender == owner,"Sender is not owner");
        _;
    }
    
    // Constructor accepts the intial versioin of the contract address 
    constructor(address initAddr) public {
        currentVersion = initAddr;
        owner = msg.sender;
    }
    
    // Function to chang the current version of the contract address
    // Only owner can access execute this function to the version of smart contract
    function changeContractVersion(address newVersion) public
    onlyOwner()
    returns (bool)
    {
        currentVersion = newVersion;
        emit LogCurrentVersion(currentVersion);
        return true;
    }
    
    // This function returns the current version of the smart contrace
    function getCurrentVersion() public view returns(address){
        return currentVersion;
    }
    
}