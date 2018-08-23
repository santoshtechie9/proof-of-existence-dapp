pragma solidity ^0.4.22;

contract Owned {
    
    address public owner;
        
    modifier onlyOwner(){
        require(msg.sender == owner, "msg sender is not owner");
        _;
    }
   
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