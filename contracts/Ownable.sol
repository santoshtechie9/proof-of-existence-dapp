pragma solidity ^0.4.22;

contract Ownable {
    
    address public owner;
   
    constructor() public {
        owner = msg.sender;
    }

    modifier OnlyOwner(){
        require(msg.sender == owner, "sender is not owner");
        _;
    }
    
}