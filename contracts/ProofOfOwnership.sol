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
    

contract ProofOfOwnership is Mortal {
    
    mapping(address => bool) admins;
    mapping( string => Document) documents; 
    
    struct Document {
        string docHash;
        string docTimestamp;
        string currentOwnerName;
        address currentOwnerAddress;
        //address[] previousOwners;
    }

    event LogFallback(string _message, address _sender);
    event LogAssignAdmin(address _sender, string _message);
    modifier onlyOwner(){
        require(msg.sender == owner, "msg sender is not owner");
        _;
    }
    
    modifier onlyAdmin(){
        require(admins[msg.sender] == true,"sender is not Admin");
        _;
    }

    function assignAdminAccess(address _address) public 
    onlyOwner 
    returns(bool){
        if(admins[_address] == false){
            admins[_address] = true;
            emit LogAssignAdmin(_address,"assigned admin previlige");
            return true;
        } else{
            emit LogAssignAdmin(_address,"is already admin");
            return false;
        }

    }

    function revokeAdminAccess(address _address) public 
    onlyOwner 
    returns(bool){
        if(admins[_address] == true){
            // admins[_address];
            delete admins[_address];
            emit LogAssignAdmin(_address,"revoked admin previlige");
            return true;
        }else{
            emit LogAssignAdmin(_address,"This address do not have admin previlige");
            return false;
        }

        
    }

    function isAdmin(address _address) public view returns(bool){
        if(admins[_address] == true){
            return true;
        }else {
            return false;
        }
    }

    function addDocument(string _docHash, string _docTimestamp, string _currentOwnerName) public returns(bool){
       
       //Input paramenters validation
       //Document hash should not be empty and length should 256 bytes
        require( 
            bytes(_docHash).length > 0 && bytes(_docHash).length <= 32, 
            "Hash length should be 32 bytes"
            );
           
        require( 
            bytes(_docTimestamp).length > 0 && bytes(_docTimestamp).length <= 32, 
            "Hash length should be 32 bytes"
            );

        require( 
            bytes(_currentOwnerName).length > 0 && bytes(_currentOwnerName).length <= 32, 
            "Hash length should be 32 bytes"
            );


        documents[_docHash] = Document(_docHash, _docTimestamp, _currentOwnerName, msg.sender);
        
        return(true);
    }

    function fetchDocumentDetails(string _docHash) public view returns(string,string,string){
        
        require( 
            bytes(_docHash).length > 0 && bytes(_docHash).length <= 32, 
            "Hash length should be 32 bytes"
            );
           
        Document storage document = documents[_docHash];
        //require(document);
        return(document.docHash,document.docTimestamp,document.currentOwnerName);
    }
    
    
    //this method will let he owner withdraw funds sent to the contract account.
    function withdrawFunds() public 
    onlyOwner 
    returns(bool){
        uint balance = address(this).balance;
        //require(balance > 0,"contract balance is zero");
        //owner.transfer(balance);
        msg.sender.transfer(balance);
        return true;
    }
    
    function checkBalance() public view returns(uint) {
        return address(this).balance;
    }
    
    // function sendEther(address _to) public 
    // payable 
    // onlyOwner 
    // {
    //     _to.transfer(1 ether);
    // }
    
    function () public payable {
        
        emit LogFallback("value received from", msg.sender);
    
    }

}

    
