pragma solidity ^0.4.22;


/** @title Owned contract 
    * it assign a owner at the time of deployment. 
    */
contract Owned {
    
    address public owner;

    /** @dev Modifier to check if the sender is owner.*/
    modifier onlyOwner(){
        require(msg.sender == owner, "msg sender is not owner");
        _;
    }
   
    constructor() public {
        owner = msg.sender;
    }

    /** @dev function to change the owner of the contract.*/
    function changeOwner(address _newOwner) public
    onlyOwner 
    {
        require(_newOwner != 0x0,"address cannot be 0x0");
        owner = _newOwner;
    }

}


/** @title Mortal contract extends Owner contract. */
contract Mortal is Owned {
    
    /** @dev Kill funtion to destroy the contract.
        * It transfers the balance in the smart contract to the owner account if any.
        */
    function kill() public 
    onlyOwner{
        require(msg.sender == owner,"message sender is not owner");
        selfdestruct(owner);
    }
    
}