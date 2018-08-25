pragma solidity ^0.4.22;

import './Mortal.sol';

// This contract maintains the current version of Proof contract.
// Proof contract has the logic and code
contract Register is Mortal {
    
    address backendContract;
    address[] public previousBackends;
    
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
        backendContract = initAddr;
        owner = msg.sender;
    }
    
    // Function to chang the current version of the contract address
    // Only owner can access execute this function to the version of smart contract
    function changeContractVersion(address _newBackend) public
    onlyOwner()
    returns (bool)
    {
        if(_newBackend != backendContract) {
            previousBackends.push(backendContract);
            backendContract = _newBackend;
            return true;
        }
        emit LogCurrentVersion(backendContract);
        return false;
    }
    
    // This function returns the current version of the smart contrace
    function getCurrentVersion() public view returns(address){
        return backendContract;
    }
    
}