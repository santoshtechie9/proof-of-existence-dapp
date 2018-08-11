pragma solidity ^0.4.22;


contract Owned {
    
    address public owner;
    constructor() public {
        owner = msg.sender;
    }
    
}

contract Mortal is Owned {
    
    function kill() public {
        if(msg.sender == owner){
            selfdestruct(owner);
        }
        
    }
    
}
    
contract ProofOfOwnership is Mortal {

    struct Document {
        string docHash;
        string docTimestamp;
        string currentOwnerName;
        address currentOwnerAddress;
        //address[] previousOwners;
    }
    
    mapping( string => Document) public documents; 

    function addDocument(string _docHash, string _docTimestamp, string _currentOwnerName) public returns(bool){
       
       //Input paramenters validation
       //Document hash should not be empty and length should 256 bytes
        require( 
            bytes(_docHash).length > 0 && bytes(_docHash).length <= 256, 
            "Hash length should be 256 bytes"
            );
           
        documents[_docHash] = Document(_docHash, _docTimestamp, _currentOwnerName, msg.sender);
        
        return(true);
    }

    function fetchDocumentDetails(string _docHash) public view returns(string,string,string){
        
        require( 
            bytes(_docHash).length > 0 && bytes(_docHash).length <= 256, 
            "Hash length should be 256 bytes"
            );
           
        Document storage document = documents[_docHash];
        return(document.docHash,document.docTimestamp,document.currentOwnerName);
    }

}
    
    
