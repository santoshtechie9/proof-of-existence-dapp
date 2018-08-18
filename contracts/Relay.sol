pragma solidity ^0.4.22;

import './Mortal.sol';

contract Relay is Mortal {
    
    address public currentVersion;
    address public owner;
    
    event LogCurrentVersion(address _address);
    
    modifier onlyOwner() {
        require(msg.sender == owner,"Sender is not owner");
        _;
    }
    
    
    constructor(address initAddr) public {
        currentVersion = initAddr;
        owner = msg.sender;
    }
    
    function changeContract(address newVersion) public
    onlyOwner()
    {
        currentVersion = newVersion;
    }
    
    function getCurrentVersion() public returns(address){
        emit LogCurrentVersion(currentVersion);
        return currentVersion;
    }

    function() public {
        require(currentVersion.delegatecall(msg.data),"contract call failed");
    }
    
}