pragma solidity ^0.4.22;

import './Mortal.sol';

contract ProofDB  is Mortal {
    
    //Document idenfiers alongwith ipfs has of the document
    struct Document {
        bytes32 docHash;
        uint docTimestamp;
        string ipfsHash;
    }

    //To keep track of all the documents owned by a user
    struct User {
        address addr;
        string userName;
        bytes32[] documentList;
        mapping(bytes32 => Document) documentDetails;
    }

    //Maintain user usage count to implement throtlling
    struct UserUsageCount {
        uint uploadTime;
        uint count;
    }
    
    address[] public allowedContractsKeys;
    mapping(address => bool) allowedContracts;
    mapping( address => User )  users;
    mapping( address => bool )  admins;
    mapping( string => Document )  documents;
    
    modifier onlyAllowedContractOrOwner {
        require (allowedContracts[msg.sender] != true && msg.sender != owner,"Should be a owner");
        _;
    }

    function addAllowedContractOrOwner(address _addr)
    public
    onlyOwner 
    returns(bool) {
        if( allowedContracts[_addr] == false ) {
            allowedContracts[_addr] = true;
            allowedContractsKeys.push(_addr);
            return true;
        }
        return false;
    }

    function isAllowedContractOrOwner(address _addr)
    public
    view 
    returns(bool) {
        return allowedContracts[_addr];
    }
    
    function addDocument(address caller, bytes32 _docHash, string _userName, string _ipfsHash) 
    public
    returns(bool) {
        if(users[caller].documentDetails[_docHash].docHash == 0x0 ){
            users[caller].addr = msg.sender;
            users[caller].userName = _userName;
            users[caller].documentList.push(_docHash);
            users[caller].documentDetails[_docHash] = Document(_docHash, block.timestamp,_ipfsHash);
            return true;
        }
        return false;
    }
    
    function getDocument(address caller,bytes32 _docHash) 
    public 
    view 
    returns(bytes32, string, uint, string){
        require(_docHash != 0x0, "Document Hash is mandatory");
        Document storage document = users[caller].documentDetails[_docHash];
        return(document.docHash,users[caller].userName,document.docTimestamp,document.ipfsHash);
    }
    
    function fetchAllDocuments(address caller) 
    public 
    view 
    returns(bytes32[]){
        return users[caller].documentList;
    }

}   
