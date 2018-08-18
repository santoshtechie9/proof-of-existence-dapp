pragma solidity ^0.4.18;

contract ProofOfExistance{
    
    struct Document {
        bytes32 docHash;
        uint docTimestamp;
        string ipfsHash;
        //mapping ( address => bool ) accessControlList;
    }
    
    struct User {
        address addr;
        string userName;
        bytes32[] documentList;
        mapping ( bytes32 => Document) documentDetails;
    }
    
    mapping ( address => User) users;

    event LogUploadDocument(address addr,string userName, bytes32 dochash, uint docTimestamp, string ipfsHash);
    
    function uploadDocument(bytes32 _docHash,string _userName,string _ipfsHash) public returns(bool) {
        
        //check whether the document already exists in the blockchain
        //if the document does not exist then add the document details and return true
        //if the document already exists then do nothing and return false
        //string storage docHash = users[msg.sender].documentDetails[_docHash].docHash;

        //bytes32 docHash_digest = keccak256(abi.encodePacked(_docHash));

        if(users[msg.sender].documentDetails[_docHash].docHash == 0){
            users[msg.sender].addr = msg.sender;
            users[msg.sender].userName = _userName;
            users[msg.sender].documentList.push(_docHash);
            users[msg.sender].documentDetails[_docHash] = Document(_docHash,block.timestamp,_ipfsHash);
        
            emit LogUploadDocument(msg.sender, _userName,_docHash, block.timestamp, _ipfsHash);
            
        }else {
            return false;
        }
        return true;
    }
    
    function fetchDocument(bytes32 _docHash) public returns(bytes32, uint, string){
      
        require( _docHash != 0 ,"docHash is a mandatory field it cannot be empty or zero");
        
        Document storage document = users[msg.sender].documentDetails[_docHash];
        emit LogUploadDocument(msg.sender,users[msg.sender].userName,document.docHash, document.docTimestamp,document.ipfsHash);
        return(document.docHash,document.docTimestamp,document.ipfsHash);
    }
    
    function fetchAllDocuments() public view returns(bytes32[]){
        return users[msg.sender].documentList;
    }
    
}