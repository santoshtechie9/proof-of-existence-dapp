pragma solidity ^0.4.22;

contract Owned {
    
    address public owner;
    constructor() public {
        owner = msg.sender;
    }
    
}

contract Mortal is Owned {
    
    function kill() public {
        require(msg.sender == owner,"message sender is not owner");
        selfdestruct(owner);
    }
    
}